import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  PreconditionFailedException,
  UnauthorizedException
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user || !user.active) {
      throw new UnauthorizedException();
    } else if (!user.confirmed) {
      throw new PreconditionFailedException('Not confirmed');
    }
    return user;
  }
}
