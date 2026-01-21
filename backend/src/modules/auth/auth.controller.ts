import {
    Controller,
    Post,
    Body,
    Res,
    Get,
    HttpCode,
    HttpStatus,
    UnauthorizedException,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUserDto } from '../../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        const user = await this.authService.validateUser(
            loginDto.email,
            loginDto.password,
        );

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const { access_token } = await this.authService.login(user);

        const isProd = process.env.NODE_ENV === 'production';
        response.cookie('Authentication', access_token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
            maxAge: 3600 * 1000, // 1 hour
        });

        return {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            isAdmin: user.isAdmin,
            tenantId: user.tenantId,
            team: user.team ? { id: user.team.id, name: user.team.name } : null,
            jobTitle: user.jobTitle,
            avatarUrl: user.avatarUrl,
        };
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Res({ passthrough: true }) response: Response) {
        response.cookie('Authentication', '', {
            httpOnly: true,
            expires: new Date(0),
        });
        return { message: 'Logged out successfully' };
    }

    @Get('me')
    getMe(@CurrentUser() user: CurrentUserDto) {
        return user;
    }
}
