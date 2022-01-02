import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UsersService} from './users.service';
import {UsersController} from './users.controller';
import {User} from '../models/user.entity';
import {Education} from '../models/education.entity';
import {BusinessHour} from '../models/business-hour.entity';
import {SocialMediaLink} from '../models/social-media-link.entity';
import {WorkHistory} from '../models/work-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, SocialMediaLink, WorkHistory, Education, BusinessHour])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {
}
