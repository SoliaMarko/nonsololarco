import {
  ArgumentsHost,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@nonsololarco/db';

import { ErrorCode } from '../errors/error-code.enum';
import { AllExceptionsFilter } from './all-exceptions.filter';

interface Captured {
  body?: unknown;
  status?: number;
}

/**
 * Builds a minimal ArgumentsHost plus a place to read what the filter wrote.
 * Only the express bits the filter touches are stubbed.
 */
function makeHost(method = 'GET', url = '/api/tracks') {
  const captured: Captured = {};

  const response = {
    status(code: number) {
      captured.status = code;

      return this;
    },
    json(body: unknown) {
      captured.body = body;

      return this;
    },
  };

  const host = {
    switchToHttp: () => ({
      getResponse: () => response,
      getRequest: () => ({ method, url }),
    }),
  } as unknown as ArgumentsHost;

  return { captured, host };
}

/** Prisma's known-request error requires a code and a client version. */
function prismaKnown(code: string, meta?: Record<string, unknown>) {
  return new Prisma.PrismaClientKnownRequestError('boom', {
    code,
    clientVersion: '7.0.0',
    meta,
  });
}

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;

  beforeEach(() => {
    filter = new AllExceptionsFilter();
    // The filter logs every exception; silence it so the suite output stays
    // readable. Behaviour under test is the response, not the log.
    vi.spyOn(filter['logger'], 'error').mockImplementation(() => undefined);
    vi.spyOn(filter['logger'], 'warn').mockImplementation(() => undefined);
  });

  describe('HTTP exceptions', () => {
    it.each([
      [
        new BadRequestException('bad'),
        HttpStatus.BAD_REQUEST,
        ErrorCode.VALIDATION_FAILED,
      ],
      [
        new UnauthorizedException('nope'),
        HttpStatus.UNAUTHORIZED,
        ErrorCode.UNAUTHORIZED,
      ],
      [new ForbiddenException('no'), HttpStatus.FORBIDDEN, ErrorCode.FORBIDDEN],
      [
        new NotFoundException('gone'),
        HttpStatus.NOT_FOUND,
        ErrorCode.NOT_FOUND,
      ],
      [new ConflictException('dupe'), HttpStatus.CONFLICT, ErrorCode.CONFLICT],
    ])('maps %#: status %i to %s', (exception, status, code) => {
      const { captured, host } = makeHost();

      filter.catch(exception, host);

      expect(captured.status).toBe(status);
      expect(captured.body).toMatchObject({ code });
    });

    it('preserves the status of an exception it has no code for', () => {
      const { captured, host } = makeHost();

      filter.catch(new HttpException('teapot', 418), host);

      expect(captured.status).toBe(418);
      expect(captured.body).toMatchObject({ code: ErrorCode.INTERNAL_ERROR });
    });

    it('moves class-validator field messages into details', () => {
      const { captured, host } = makeHost('POST', '/api/tracks');
      const exception = new BadRequestException({
        message: ['title should not be empty', 'bpm must not be less than 20'],
        error: 'Bad Request',
        statusCode: 400,
      });

      filter.catch(exception, host);

      expect(captured.body).toMatchObject({
        code: ErrorCode.VALIDATION_FAILED,
        details: {
          fields: ['title should not be empty', 'bpm must not be less than 20'],
        },
      });
    });
  });

  describe('Prisma errors', () => {
    it('maps a unique constraint violation to 409 CONFLICT', () => {
      const { captured, host } = makeHost('POST', '/api/tracks');

      filter.catch(prismaKnown('P2002', { target: ['email'] }), host);

      expect(captured.status).toBe(HttpStatus.CONFLICT);
      expect(captured.body).toMatchObject({
        code: ErrorCode.CONFLICT,
        details: { fields: ['email'] },
      });
    });

    it('maps a missing record to 404', () => {
      const { captured, host } = makeHost('PATCH', '/api/tracks/nope');

      filter.catch(prismaKnown('P2025'), host);

      expect(captured.status).toBe(HttpStatus.NOT_FOUND);
      expect(captured.body).toMatchObject({
        code: ErrorCode.NOT_FOUND,
        details: {},
      });
    });

    it('maps a foreign key violation to 400', () => {
      const { captured, host } = makeHost();

      filter.catch(prismaKnown('P2003'), host);

      expect(captured.status).toBe(HttpStatus.BAD_REQUEST);
      expect(captured.body).toMatchObject({
        code: ErrorCode.VALIDATION_FAILED,
      });
    });

    // This is the case that motivated the whole filter: a P1000 used to reach
    // the browser as a bare "Internal server error".
    it.each(['P1000', 'P1001', 'P1002', 'P1008', 'P1017'])(
      'maps the connection failure %s to 503 DATABASE_UNAVAILABLE',
      (code) => {
        const { captured, host } = makeHost();

        filter.catch(prismaKnown(code), host);

        expect(captured.status).toBe(HttpStatus.SERVICE_UNAVAILABLE);
        expect(captured.body).toMatchObject({
          code: ErrorCode.DATABASE_UNAVAILABLE,
        });
      },
    );

    it('maps an initialization failure to 503', () => {
      const { captured, host } = makeHost();
      const exception = new Prisma.PrismaClientInitializationError(
        'cannot connect',
        '7.0.0',
      );

      filter.catch(exception, host);

      expect(captured.status).toBe(HttpStatus.SERVICE_UNAVAILABLE);
      expect(captured.body).toMatchObject({
        code: ErrorCode.DATABASE_UNAVAILABLE,
      });
    });

    it('falls back to 500 for an unrecognised Prisma code', () => {
      const { captured, host } = makeHost();

      filter.catch(prismaKnown('P2099'), host);

      expect(captured.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(captured.body).toMatchObject({ code: ErrorCode.INTERNAL_ERROR });
    });
  });

  describe('unknown exceptions', () => {
    it('returns a generic 500 for a plain Error', () => {
      const { captured, host } = makeHost();

      filter.catch(new Error('something exploded'), host);

      expect(captured.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(captured.body).toEqual({
        code: ErrorCode.INTERNAL_ERROR,
        message: 'Internal server error',
        details: {},
      });
    });

    it('does not leak the original message or stack to the client', () => {
      const { captured, host } = makeHost();

      filter.catch(new Error('connect ECONNREFUSED 10.0.0.7:5432'), host);

      expect(JSON.stringify(captured.body)).not.toContain('ECONNREFUSED');
      expect(JSON.stringify(captured.body)).not.toContain('10.0.0.7');
    });

    it('handles a thrown non-Error value', () => {
      const { captured, host } = makeHost();

      filter.catch('just a string', host);

      expect(captured.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(captured.body).toMatchObject({ code: ErrorCode.INTERNAL_ERROR });
    });
  });

  describe('logging', () => {
    it('logs 5xx at error level with the stack', () => {
      const { host } = makeHost();
      const spy = vi.spyOn(filter['logger'], 'error');

      filter.catch(new Error('boom'), host);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][1]).toContain('Error: boom');
    });

    it('logs 4xx at warn level, since the caller is at fault', () => {
      const { host } = makeHost();
      const warn = vi.spyOn(filter['logger'], 'warn');
      const error = vi.spyOn(filter['logger'], 'error');

      filter.catch(new NotFoundException('gone'), host);

      expect(warn).toHaveBeenCalledTimes(1);
      expect(error).not.toHaveBeenCalled();
    });
  });

  it('always returns exactly the documented three keys', () => {
    const { captured, host } = makeHost();

    filter.catch(new BadRequestException('bad'), host);

    expect(Object.keys(captured.body as object).sort()).toEqual([
      'code',
      'details',
      'message',
    ]);
  });
});
