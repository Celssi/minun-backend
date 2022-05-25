import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '../models/user.entity';
import { Education } from '../models/education.entity';
import { BusinessHour } from '../models/business-hour.entity';
import { SocialMediaLink } from '../models/social-media-link.entity';
import { WorkHistory } from '../models/work-history.entity';
import { MailService } from '../mail/mail.service';
import { ResetRequestModule } from '../resetRequests/resetRequest.module';
import { StripeService } from '../stripe/stripe.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      SocialMediaLink,
      WorkHistory,
      Education,
      BusinessHour
    ]),
    ResetRequestModule
  ],
  providers: [UsersService, MailService, StripeService],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
