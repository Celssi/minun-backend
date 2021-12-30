import {Module} from '@nestjs/common';
import {AuthModule} from '../auth/auth.module';
import {LoginController} from './login.controller';
import {UsersModule} from '../users/users.module';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [LoginController]
})
export class LoginModule {
}
