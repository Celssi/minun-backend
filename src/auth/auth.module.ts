import {Module} from '@nestjs/common';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {jwtConstants} from './constants';
import {LocalStrategy} from './local.straregy';
import {JwtStrategy} from './jwt.strategy';
import {JwtAuthGuard} from './jwt-auth.guard';
import {APP_GUARD} from '@nestjs/core';
import {UsersModule} from '../users/users.module';
import {AuthService} from './auth.service';
import {CurrentUserGuard} from './current-user.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {expiresIn: '5s'}
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: CurrentUserGuard
    },
  ],
  exports: [AuthService]
})
export class AuthModule {
}
