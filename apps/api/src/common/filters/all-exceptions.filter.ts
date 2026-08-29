import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@nonsololarco/db';
import type { Request, Response } from 'express';

import { ErrorCode } from '../errors/error-code.enum';

/** The body shape every error response has. Documented in CLAUDE.md. */
export interface ErrorResponseBody {
  code: ErrorCode;
  message: string;
  details: Record<string, unknown>;
}

interface Mapped {
  code: ErrorCode;
  details: Record<string, unknown>;
  message: string;
  status: number;
}

/** HTTP status → error code, for exceptions Nest raises itself. */
const STATUS_TO_CODE: Partial<Record<number, ErrorCode>> = {
  [HttpStatus.BAD_REQUEST]: ErrorCode.VALIDATION_FAILED,
  [HttpStatus.UNAUTHORIZED]: ErrorCode.UNAUTHORIZED,
  [HttpStatus.FORBIDDEN]: ErrorCode.FORBIDDEN,
  [HttpStatus.NOT_FOUND]: ErrorCode.NOT_FOUND,
  [HttpStatus.CONFLICT]: ErrorCode.CONFLICT,
};

/**
 * Prisma error codes worth translating into something a client can act on.
 *
 * Everything absent from this map falls through to a 500, which is correct:
 * an unrecognised database failure is a bug in our code, not a request the
 * caller could have made differently.
 */
const PRISMA_KNOWN: Record<
  string,
  { code: ErrorCode; message: string; status: number }
> = {
  // Unique constraint violation — the caller asked for something that collides.
  P2002: {
    code: ErrorCode.CONFLICT,
    message: 'A record with these values already exists',
    status: HttpStatus.CONFLICT,
  },
  // Foreign key constraint failure. Deliberately neutral, because P2003 does
  // not say which direction failed: an insert naming a parent that is absent,
  // or a delete blocked by a child that still exists. Track.leadMember is a
  // required relation defaulting to Restrict, so deleting a user who leads a
  // track raises this too — and "referenced record does not exist" would then
  // be exactly backwards, sending the caller looking for a missing row that is
  // in fact still present.
  P2003: {
    code: ErrorCode.CONFLICT,
    message: 'Operation violates a relational constraint',
    status: HttpStatus.CONFLICT,
  },
  // An update or delete matched no rows.
  P2025: {
    code: ErrorCode.NOT_FOUND,
    message: 'Record not found',
    status: HttpStatus.NOT_FOUND,
  },
};

/**
 * Lowest status we treat as "our fault".
 *
 * A plain number rather than `HttpStatus.INTERNAL_SERVER_ERROR`, because
 * `Mapped.status` is a number — an unrecognised HttpException keeps whatever
 * status it carried — and comparing the two would mix an enum with a number.
 */
const SERVER_ERROR_THRESHOLD = 500;

/** `true` for the connection-level failures that mean "the database is down". */
function isConnectionError(code: string): boolean {
  // P1000 authentication failed, P1001 unreachable, P1002 timeout,
  // P1008 operation timed out, P1017 server closed the connection.
  return ['P1000', 'P1001', 'P1002', 'P1008', 'P1017'].includes(code);
}

/**
 * Extracts the field names from a `class-validator` failure.
 *
 * The ValidationPipe puts an array of human-readable strings on `message`.
 * They are useful to a developer reading logs but not to a client, so they go
 * in `details` while `message` stays a single sentence.
 */
function validationDetails(response: unknown): Record<string, unknown> {
  if (typeof response !== 'object' || response === null) return {};

  const message = (response as { message?: unknown }).message;

  return Array.isArray(message) ? { fields: message } : {};
}

/**
 * Turns every uncaught exception into the documented error body.
 *
 * The contract is `{ code, message, details }`. `code` is machine-readable and
 * is what the client maps to a translated string; `message` is English, for
 * logs and developers, and must never be rendered to a user.
 *
 * Registered globally in `main.ts`, so it sees everything that escapes a
 * controller — including errors Prisma throws, which previously surfaced as a
 * bare 500 with no indication of the cause. A dropped database connection and
 * a malformed request body used to look identical to the client.
 *
 * The stack trace is logged and never returned: a 5xx body carrying internals
 * is a disclosure bug.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const mapped = this.mapException(exception);

    this.log(mapped, request, exception);

    const body: ErrorResponseBody = {
      code: mapped.code,
      message: mapped.message,
      details: mapped.details,
    };

    response.status(mapped.status).json(body);
  }

  /** Chooses the code, status and safe message for one exception. */
  private mapException(exception: unknown): Mapped {
    if (exception instanceof HttpException)
      return this.fromHttpException(exception);

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.fromPrismaKnown(exception);
    }

    if (exception instanceof Prisma.PrismaClientInitializationError) {
      return {
        code: ErrorCode.DATABASE_UNAVAILABLE,
        message: 'Database is unavailable',
        details: {},
        status: HttpStatus.SERVICE_UNAVAILABLE,
      };
    }

    if (exception instanceof Prisma.PrismaClientValidationError) {
      // The query itself was malformed — our bug, not the caller's.
      return {
        code: ErrorCode.INTERNAL_ERROR,
        message: 'Internal server error',
        details: {},
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      code: ErrorCode.INTERNAL_ERROR,
      message: 'Internal server error',
      details: {},
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }

  /** Nest's own exceptions already carry the status; derive the code from it. */
  private fromHttpException(exception: HttpException): Mapped {
    const status = exception.getStatus();

    // A 5xx HttpException is still a server fault, and its message was written
    // by whoever threw it — `new HttpException('db password rejected', 500)`
    // would otherwise be serialised straight to the client. The disclosure
    // rule follows the status, not the class that produced it.
    if (status >= SERVER_ERROR_THRESHOLD) {
      return {
        code: ErrorCode.INTERNAL_ERROR,
        message: 'Internal server error',
        details: {},
        status,
      };
    }

    const response = exception.getResponse();

    const message =
      typeof response === 'string'
        ? response
        : (exception.message ?? 'Request failed');

    return {
      code: STATUS_TO_CODE[status] ?? ErrorCode.INTERNAL_ERROR,
      message,
      details: validationDetails(response),
      status,
    };
  }

  private fromPrismaKnown(
    exception: Prisma.PrismaClientKnownRequestError,
  ): Mapped {
    if (isConnectionError(exception.code)) {
      return {
        code: ErrorCode.DATABASE_UNAVAILABLE,
        message: 'Database is unavailable',
        details: {},
        status: HttpStatus.SERVICE_UNAVAILABLE,
      };
    }

    const known = PRISMA_KNOWN[exception.code];

    if (!known) {
      return {
        code: ErrorCode.INTERNAL_ERROR,
        message: 'Internal server error',
        details: {},
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }

    // `meta.target` names the columns involved, which is safe to expose: they
    // are field names the client already knows from the request it sent.
    const target = exception.meta?.target;

    return {
      ...known,
      details: target === undefined ? {} : { fields: target },
    };
  }

  /**
   * Logs at a level matching who is at fault.
   *
   * 5xx means we broke something, so it gets `error` and the full stack. 4xx
   * means the caller sent something wrong, which is routine and would drown
   * the log at `error` level, so it gets `warn` and one line.
   */
  private log(mapped: Mapped, request: Request, exception: unknown): void {
    const where = `${request.method} ${request.url}`;

    if (mapped.status >= SERVER_ERROR_THRESHOLD) {
      const stack = exception instanceof Error ? exception.stack : undefined;

      this.logger.error(`${where} → ${mapped.code}: ${mapped.message}`, stack);

      return;
    }

    this.logger.warn(
      `${where} → ${mapped.status} ${mapped.code}: ${mapped.message}`,
    );
  }
}
