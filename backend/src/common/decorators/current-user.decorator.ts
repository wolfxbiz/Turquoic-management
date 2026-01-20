import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentUserDto {
    userId: string;
    tenantId: string;
    email: string;
    isAdmin: boolean;
}

export const CurrentUser = createParamDecorator(
    (data: unknown, context: ExecutionContext): CurrentUserDto => {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        return {
            userId: user.sub || user.userId,
            tenantId: user.tenantId,
            email: user.email,
            isAdmin: user.isAdmin || false,
        };
    },
);
