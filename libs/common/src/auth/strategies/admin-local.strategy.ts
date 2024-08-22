import {PassportStrategy} from "@nestjs/passport";
import { Strategy } from 'passport-local';
import {AuthService} from "@app/common/auth/auth.service";


export class AdminLocalStrategy extends  PassportStrategy(Strategy,'admin-local'){
    constructor(private readonly authService: AuthService) {
        super({
            usernameField: 'email',
            passwordField: 'password',
        });
    }
    async validate(email: string, password: string) {
        return await this.authService.validateAdmin(email,password);
    }

}