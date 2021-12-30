import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './user.entity';
import {UsersService} from './users.service';
import {UsersController} from './users.controller';
import {SocialMediaLink} from './social-media-link.entity';
import {WorkHistory} from './work-history.entity';
import {Education} from './education.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, SocialMediaLink, WorkHistory, Education])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {
}
