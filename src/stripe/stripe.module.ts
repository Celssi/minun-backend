import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { UsersService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../models/user.entity';
import { SocialMediaLink } from '../models/social-media-link.entity';
import { WorkHistory } from '../models/work-history.entity';
import { Education } from '../models/education.entity';
import { BusinessHour } from '../models/business-hour.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      User,
      SocialMediaLink,
      WorkHistory,
      Education,
      BusinessHour
    ])
  ],
  providers: [StripeService, UsersService],
  exports: [StripeService],
  controllers: [StripeController]
})
export class StripeModule {}
