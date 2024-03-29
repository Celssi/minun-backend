import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, pbkdf2Sync, randomBytes } from 'crypto';
import { UsersService } from '../users/users.service';
import { User } from '../models/user.entity';
import { jwtConstants } from './constants';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findWithEmailIncludeHashAndSalt(email);
    if (user) {
      const hash = pbkdf2Sync(
        password,
        user.salt,
        10000,
        512,
        'sha512'
      ).toString('hex');

      return user.hash === hash ? user : null;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const refreshToken = await this.handleRefreshToken(payload, user);

    delete user.hash;
    delete user.salt;
    delete user.refreshToken;

    return {
      user: user,
      token: this.jwtService.sign(payload),
      refreshToken: refreshToken
    };
  }

  async register(user: any) {
    const userToRegister = new User();
    userToRegister.email = user.email;
    userToRegister.firstName = user.firstName;
    userToRegister.lastName = user.lastName;
    userToRegister.accountType = user.accountType;
    userToRegister.companyName = user.companyName;
    userToRegister.image = user.image;
    userToRegister.handle = (
      (user.lastName ?? user.companyName).replace(' ', '') +
      Math.floor(1000 + Math.random() * 9000)
    ).toLowerCase();
    userToRegister.refreshToken = randomBytes(16).toString('hex');

    userToRegister.salt = randomBytes(16).toString('hex');
    userToRegister.hash = pbkdf2Sync(
      user.password,
      userToRegister.salt,
      10000,
      512,
      'sha512'
    ).toString('hex');

    const createdUser = await this.usersService.create(userToRegister);
    const payload = { email: user.email, sub: createdUser.id };
    const refreshToken = await this.handleRefreshToken(payload, createdUser);

    delete createdUser.salt;
    delete createdUser.hash;
    delete createdUser.refreshToken;

    await this.mailService.sendConfirmation(
      user.email,
      createHash('md5')
        .update(user.email + user.email.toUpperCase())
        .digest('hex'),
      process.env.FRONTEND_URL
    );

    return {
      user: createdUser,
      token: this.jwtService.sign(payload),
      refreshToken: refreshToken
    };
  }

  isRefreshTokenValid(refreshToken) {
    try {
      this.jwtService.verify(refreshToken, {
        secret: jwtConstants.refreshSecret
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  isTokenValid(token) {
    try {
      this.jwtService.verify(token);
      return true;
    } catch (e) {
      return e.message === 'jwt expired';
    }
  }

  private async handleRefreshToken(
    payload: { sub: number; email: any },
    user: User
  ) {
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '1d',
      secret: jwtConstants.refreshSecret
    });
    user.refreshToken = refreshToken;

    await this.usersService.update(user);
    return refreshToken;
  }
}
