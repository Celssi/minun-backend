import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { Request } from 'express';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { Public } from '../auth/public.decorator';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../models/user.entity';
import { randomBytes, createHash } from 'crypto';

@Controller('api/login')
export class LoginController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post()
  async login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @Public()
  @Get('logout/:refreshToken')
  async logout(@Req() req, @Param() params) {
    const user = await this.usersService.findByRefreshToken(
      params.refreshToken
    );

    if (!user) return;

    user.facebookToken = null;
    user.googleToken = null;
    user.refreshToken = randomBytes(16).toString('hex');
    await this.usersService.update(user);
  }

  @Public()
  @Post('refresh')
  async refresh(@Req() req: Request) {
    const user = await this.usersService.findByRefreshToken(
      req.body.refreshToken
    );

    if (
      !user ||
      !this.authService.isRefreshTokenValid(req.body.refreshToken) ||
      !this.authService.isTokenValid(req.body.token)
    ) {
      throw new HttpException('Invalid refresh token', HttpStatus.FORBIDDEN);
    }

    return this.authService.login(user);
  }

  @Public()
  @Post('facebook')
  async loginWithFacebookToken(@Req() req: Request) {
    const user = await this.usersService.findByFacebookToken(
      req.body.facebookToken
    );
    return this.authService.login(user);
  }

  @Public()
  @Post('google')
  async loginWithGoogleToken(@Req() req: Request) {
    const user = await this.usersService.findByGoogleToken(
      req.body.googleToken
    );
    return this.authService.login(user);
  }

  @Public()
  @Post('register')
  async register(
    @Req() req: Request,
    @Param() params,
    @Body() createUserDto: CreateUserDto
  ) {
    const userFromDatabase = await this.usersService.findByEmail(
      createUserDto.email
    );

    if (userFromDatabase) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    return this.authService.register(createUserDto);
  }

  @Public()
  @Post('confirm')
  async confirmEmail(
    @Req() req: Request,
    @Body() body: { email: string; confirmCode: string }
  ) {
    if (!body.email || !body.confirmCode) return;

    const user = await this.usersService.findByEmail(body.email);
    if (!user) return;

    const rightConfirm = createHash('md5')
      .update(user.email + user.email.toUpperCase())
      .digest('hex');

    if (body.confirmCode !== rightConfirm) throw new UnauthorizedException();

    user.confirmed = true;
    await this.usersService.update(user);
  }
}
