import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {UsersService} from '../users/users.service';
import {IS_PUBLIC_KEY} from './public.decorator';

@Injectable()
export class CurrentUserGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userFromDatabase = await this.usersService.findById(request.user.userId);

    if (!userFromDatabase?.active) {
      return false;
    }

    request.userFromDatabase = userFromDatabase;

    return true;
  }
}
