import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req
} from '@nestjs/common';
import { UsersService } from './users.service';
import { createHash, pbkdf2Sync, randomBytes } from 'crypto';
import { Public } from 'src/auth/public.decorator';
import { ChangePasswordDto, UpdateUserDto, User } from 'src/models/user.entity';
import { LinkType, SocialMediaLink } from '../models/social-media-link.entity';
import { WorkHistory } from '../models/work-history.entity';
import { Education } from '../models/education.entity';
import { BusinessHour } from '../models/business-hour.entity';
import { MailService } from '../mail/mail.service';
import { ResetRequest, ResetRequestDto } from '../models/resetRequest.entity';
import { ResetRequestsService } from '../resetRequests/resetRequests.service';

@Controller('api/users')
export class UsersController {
  notAllowedHandles = [
    'etusivu',
    'kirjaudu',
    'tutustu',
    'logout',
    'etsi',
    'vahvista'
  ];

  constructor(
    private readonly usersService: UsersService,
    private mailService: MailService,
    private resetRequestsService: ResetRequestsService
  ) {}

  @Public()
  @Get()
  async getAll(@Req() req): Promise<User[]> {
    return this.usersService.findAllPublic();
  }

  @Get('current')
  async getCurrent(@Req() req): Promise<User> {
    return this.usersService.findById(req.userFromDatabase.id);
  }

  @Public()
  @Get(':id')
  async get(@Req() req, @Param() params): Promise<User> {
    return this.usersService.findById(params.id);
  }

  @Public()
  @Get('with-handle/:id')
  async getWithHandle(@Req() req, @Param() params): Promise<User> {
    return this.usersService.findByHandle(params.id);
  }

  @Public()
  @Get('search/:searchPhrase/:offset')
  search(@Req() req): Promise<User[]> {
    return this.usersService.findWithSearchPhrase(
      req.params.searchPhrase,
      req.params.offset
    );
  }

  @Put()
  async update(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    const user = new User();
    user.id = req.userFromDatabase.id;
    user.firstName = updateUserDto.firstName;
    user.lastName = updateUserDto.lastName;
    user.phone = updateUserDto.phone;
    user.website = updateUserDto.website;
    user.description = updateUserDto.description;
    user.location = updateUserDto.location;
    user.image = updateUserDto.image;
    user.theme = updateUserDto.theme;
    user.languages = updateUserDto.languages;
    user.specialSkills = updateUserDto.specialSkills;
    user.handle = !this.notAllowedHandles.includes(
      updateUserDto.handle.toLowerCase()
    )
      ? updateUserDto.handle.toLowerCase()
      : (
          (user.lastName ?? user.companyName).replace(' ', '') +
          Math.floor(1000 + Math.random() * 9000)
        ).toLowerCase();
    user.public = updateUserDto.public;
    user.allowFacebookLogin = updateUserDto.allowFacebookLogin;
    user.allowGoogleLogin = updateUserDto.allowGoogleLogin;

    const emailChanged = req.userFromDatabase.email !== updateUserDto.email;
    user.confirmed = user.confirmed && !emailChanged;
    user.email = updateUserDto.email;

    const updatedUser = await this.usersService.update(user);

    if (emailChanged) {
      await this.mailService.sendConfirmation(
        updatedUser.email,
        createHash('md5')
          .update(updatedUser.email + updatedUser.email.toUpperCase())
          .digest('hex'),
        process.env.FRONTEND_URL
      );
    }

    await this.usersService.removeAllSocialMediaLinks(user.id);
    await this.saveSocialMediaLink(
      user.id,
      updateUserDto.facebook,
      LinkType.Facebook
    );
    await this.saveSocialMediaLink(
      user.id,
      updateUserDto.twitter,
      LinkType.Twitter
    );
    await this.saveSocialMediaLink(
      user.id,
      updateUserDto.github,
      LinkType.Github
    );
    await this.saveSocialMediaLink(
      user.id,
      updateUserDto.linkedin,
      LinkType.Linkedin
    );

    await this.usersService.removeAllWorkHistories(user.id);
    updateUserDto.workHistories?.forEach((workHistory: WorkHistory) => {
      workHistory.userId = user.id;
      this.usersService.saveWorkHistory(workHistory);
    });

    await this.usersService.removeAllEducations(user.id);
    updateUserDto.educations?.forEach((education: Education) => {
      education.userId = user.id;
      this.usersService.saveEducation(education);
    });

    await this.usersService.removeAllBusinessHours(user.id);
    updateUserDto.businessHours?.forEach((businessHour: BusinessHour) => {
      businessHour.userId = user.id;
      this.usersService.saveBusinessHour(businessHour);
    });

    return updatedUser;
  }

  @Put('change-password')
  async changePassword(
    @Req() req,
    @Body() changePasswordDto: ChangePasswordDto
  ): Promise<User> {
    const user = new User();
    user.id = req.userFromDatabase.id;
    user.salt = randomBytes(16).toString('hex');
    user.hash = pbkdf2Sync(
      changePasswordDto.password,
      user.salt,
      10000,
      512,
      'sha512'
    ).toString('hex');

    return this.usersService.update(user);
  }

  @Public()
  @Get('reset-password/:code')
  async getResetPassword(@Req() req, @Param() params) {
    return await this.resetRequestsService.findByCode(params.code);
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Req() req, @Body() body: ResetRequestDto) {
    if (body.email) {
      const user = await this.usersService.findByEmail(body.email);

      if (user) {
        const resetRequest = new ResetRequest();
        resetRequest.user = user;
        resetRequest.code = randomBytes(16).toString('hex');
        const created = await this.resetRequestsService.create(resetRequest);

        await this.mailService.sendResetPassword(
          body.email,
          created.code,
          process.env.FRONTEND_URL
        );
      }
    } else if (body.password && body.code) {
      const resetRequest = await this.resetRequestsService.findByCode(
        body.code
      );

      if (!resetRequest) {
        throw new HttpException('Code was invalid', HttpStatus.NOT_FOUND);
      }

      resetRequest.user.salt = randomBytes(16).toString('hex');
      resetRequest.user.hash = pbkdf2Sync(
        body.password,
        resetRequest.user.salt,
        10000,
        512,
        'sha512'
      ).toString('hex');

      await this.usersService.update(resetRequest.user);
      await this.resetRequestsService.remove(resetRequest.id);
    }
  }

  @Public()
  @Post('check-email')
  async checkEmail(@Body() body): Promise<boolean> {
    const email = body.email;
    const user = await this.usersService.findByEmail(email);
    return !!user && user.id !== body.userId;
  }

  @Public()
  @Post('check-handle')
  async checkHandle(@Body() body): Promise<boolean> {
    const handle = body.handle.toLowerCase();
    const user = await this.usersService.findByHandle(handle);

    return (
      (!!user && user.id !== body.userId) ||
      this.notAllowedHandles.includes(handle)
    );
  }

  @Delete()
  async deleteUser(@Req() req, @Param() params): Promise<void> {
    if (req.userFromDatabase?.id) {
      return await this.usersService.remove(req.userFromDatabase.id);
    }

    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  private async saveSocialMediaLink(
    userId: number,
    link: string,
    linkType: LinkType
  ) {
    if (link) {
      const socialMediaLink = new SocialMediaLink();
      socialMediaLink.userId = userId;
      socialMediaLink.link = link;
      socialMediaLink.type = linkType;

      await this.usersService.saveSocialMediaLink(socialMediaLink);
    }
  }
}
