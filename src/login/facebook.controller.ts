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
export class FacebookController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Public()
  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Public()
  @Get('/facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(@Req() req: Request, @Res() res): Promise<any> {
    const userDataFromFacebook = req.user as any;
    const userFromDatabase = await this.usersService.findByEmail(
      userDataFromFacebook.user.email
    );

    if (userFromDatabase && userFromDatabase.allowFacebookLogin) {
      userFromDatabase.facebookToken = userDataFromFacebook.accessToken;
      await this.usersService.update(userFromDatabase);
      res.redirect(
        process.env.FRONTEND_URL +
          '/kirjaudu/facebook/' +
          userDataFromFacebook.accessToken
      );
    } else if (!userFromDatabase) {
      const user = new User();
      user.accountType = 'user';
      user.hash = randomBytes(16).toString('hex');
      user.salt = randomBytes(16).toString('hex');
      user.refreshToken = randomBytes(16).toString('hex');
      user.firstName = userDataFromFacebook.user.firstName;
      user.lastName = userDataFromFacebook.user.lastName;
      user.email = userDataFromFacebook.user.email;
      user.allowFacebookLogin = true;
      user.facebookToken = userDataFromFacebook.accessToken;
      user.confirmed = true;
      user.handle = (
        (user.lastName ?? user.companyName).replace(' ', '') +
        Math.floor(1000 + Math.random() * 9000)
      ).toLowerCase();

      await this.usersService.create(user);
      res.redirect(
        process.env.FRONTEND_URL +
          '/kirjaudu/facebook/' +
          userDataFromFacebook.accessToken
      );
    } else {
      res.redirect(process.env.FRONTEND_URL + '/kirjaudu/facebook');
    }
  }
}
