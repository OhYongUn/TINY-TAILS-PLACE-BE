import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {Strategy} from 'passport-local';
import {AuthService} from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,

        });
    }

    async validate(req: any, email: string, password: string): Promise<any> {
        const isAdminRoute = req.route.path.includes('/admin');
        let user;

        try {
            if (isAdminRoute) {
                user = await this.authService.validateAdmin(email, password);
            } else {
                user = await this.authService.validateUser(email, password);
            }
        } catch (error) {
            throw new UnauthorizedException('Invalid credentials');
        }
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return {
            ...user,
            isAdmin: isAdminRoute
        };
    }
}
