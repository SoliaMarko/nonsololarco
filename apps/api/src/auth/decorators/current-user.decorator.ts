import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@nonsololarco/db';

// Usage: getProfile(@CurrentUser() user: User) instead of
// digging into request.user manually in every controller.
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
