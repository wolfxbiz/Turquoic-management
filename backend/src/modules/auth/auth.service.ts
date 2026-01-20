import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IamService } from '../iam/iam.service';
import { User } from '../iam/domain/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private iamService: IamService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.iamService.findByEmail(email);
        if (user && (await bcrypt.compare(pass, user.passwordHash))) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: User) {
        const payload = {
            email: user.email,
            sub: user.id,
            tenantId: user.tenantId,
            isAdmin: user.isAdmin
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
