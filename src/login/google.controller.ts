import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { Public } from '../auth/public.decorator';
import { User } from '../models/user.entity';
import { randomBytes } from 'crypto';

@Controller()
export class GoogleController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Public()
  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Public()
  @Get('/google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleLoginRedirect(@Req() req: Request, @Res() res): Promise<any> {
    const userDataFromGoogle = req.user as any;
    const userFromDatabase = await this.usersService.findByEmail(
      userDataFromGoogle.email
    );

    if (userFromDatabase && userFromDatabase.allowGoogleLogin) {
      userFromDatabase.googleToken = userDataFromGoogle.accessToken;
      await this.usersService.update(userFromDatabase);
      res.redirect(
        process.env.FRONTEND_URL +
          '/kirjaudu/google/' +
          userDataFromGoogle.accessToken
      );
    } else if (!userFromDatabase) {
      const user = new User();
      user.accountType = 'user';
      user.hash = randomBytes(16).toString('hex');
      user.salt = randomBytes(16).toString('hex');
      user.refreshToken = randomBytes(16).toString('hex');
      user.firstName = userDataFromGoogle.firstName;
      user.lastName = userDataFromGoogle.lastName;
      user.email = userDataFromGoogle.email;
      user.allowGoogleLogin = true;
      user.googleToken = userDataFromGoogle.accessToken;
      user.confirmed = true;
      user.handle = (
        (user.lastName ?? user.companyName).replace(' ', '') +
        Math.floor(1000 + Math.random() * 9000)
      ).toLowerCase();

      await this.usersService.create(user);
      res.redirect(
        process.env.FRONTEND_URL +
          '/kirjaudu/google/' +
          userDataFromGoogle.accessToken
      );
    } else {
      res.redirect(process.env.FRONTEND_URL + '/kirjaudu/google');
    }
  }
}
