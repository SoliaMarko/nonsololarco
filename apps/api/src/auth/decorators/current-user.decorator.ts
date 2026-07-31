import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@nonsololarco/db';

type AuthenticatedRequest = Request & {
  user: User;
};

// Usage: getProfile(@CurrentUser() user: User) instead of
// digging into request.user manually in every controller.
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user;
  },
);
