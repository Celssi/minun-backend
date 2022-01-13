import {Module} from '@nestjs/common';
import {AuthModule} from '../auth/auth.module';
import {LoginController} from './login.controller';
import {UsersModule} from '../users/users.module';
import {FacebookController} from './facebook.controller';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [LoginController, FacebookController]
})
export class LoginModule {
}
