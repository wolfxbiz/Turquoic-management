import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { IamModule } from '../iam/iam.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        IamModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const secret = configService.get<string>('JWT_SECRET');
                const expiresIn = configService.get<string>('JWT_EXPIRATION') || '3600s';
                return {
                    secret,
                    signOptions: {
                        expiresIn: expiresIn as any,
                    },
                };
            },
        }),
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule { }
