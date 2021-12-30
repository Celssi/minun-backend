import {Body, Controller, HttpException, HttpStatus, Param, Post, Req, UseGuards} from '@nestjs/common';
import {Request} from 'express';
import {LocalAuthGuard} from '../auth/local-auth.guard';
import {Public} from '../auth/public.decorator';
import {AuthService} from '../auth/auth.service';
import {UsersService} from '../users/users.service';
import {CreateUserDto} from '../users/user.entity';

@Controller('api/users')
export class LoginController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService) {
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('register')
  async register(@Req() req: Request, @Param() params, @Body() createUserDto: CreateUserDto) {
    const userFromDatabase = await this.usersService.findByEmail(createUserDto.email);

    if (userFromDatabase) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    return this.authService.register(createUserDto);
  }
}
