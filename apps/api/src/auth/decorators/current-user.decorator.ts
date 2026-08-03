import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// The subset of User fields returned by JwtStrategy.validate.
// Never includes passwordHash or other sensitive columns.
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

interface AuthenticatedRequest extends Request {
  user: SessionUser;
}

// Usage: getProfile(@CurrentUser() user: SessionUser) instead of
// digging into request.user manually in every controller.
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): SessionUser => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user;
  },
);
