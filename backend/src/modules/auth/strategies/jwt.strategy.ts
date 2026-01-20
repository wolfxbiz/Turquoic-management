import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { IamService } from '../../iam/iam.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private iamService: IamService,
    ) {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }

        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.Authentication;
                },
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),

            ignoreExpiration: false,
            secretOrKey: secret,
        });
    }

    async validate(payload: any) {
        const user = await this.iamService.findById(payload.sub);
        if (!user || !user.isActive) {
            throw new UnauthorizedException();
        }
        return {
            userId: user.id,
            tenantId: user.tenantId,
            email: user.email,
            isAdmin: user.isAdmin,
        };
    }
}
