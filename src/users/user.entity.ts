import {AfterLoad, Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, ValidateNested} from 'class-validator';
import {SocialMediaLink} from './social-media-link.entity';
import {CreateWorkHistoryDto, WorkHistory} from './work-history.entity';
import {Type} from 'class-transformer';
import {CreateEducationDto, Education} from './education.entity';
import {PartialType} from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 300, unique: true})
  email: string;

  @Column({length: 300, nullable: true})
  firstName: string;

  @Column({length: 300, nullable: true})
  lastName: string;

  @Column({length: 300, nullable: true, unique: true})
  handle: string;

  @Column({length: 300, nullable: true})
  title: string;

  @Column({length: 300, nullable: true})
  phone: string;

  @Column({length: 300})
  accountType: string;

  @Column({nullable: true, length: 300})
  companyName: string;

  @Column({default: 'light', length: 300})
  theme: string;

  @Column({nullable: true, type: 'longtext'})
  image: string;

  @Column({length: 1000, nullable: true})
  description: string;

  @Column({nullable: true, length: 300})
  website: string;

  @Column({nullable: true, length: 300})
  location: string;

  @Column({nullable: true, length: 1000})
  languages: string;

  @Column({nullable: true, length: 1000})
  specialSkills: string;

  @Column({default: true})
  active: boolean;

  @Column({length: 1024, select: false})
  hash: string;

  @Column({select: false})
  salt: string;

  @OneToMany(() => SocialMediaLink, (socialMediaLink) => socialMediaLink.user)
  socialMediaLinks: SocialMediaLink[];

  @OneToMany(() => WorkHistory, (workHistory) => workHistory.user)
  workHistories: WorkHistory[];

  @OneToMany(() => Education, (education) => education.user)
  educations: Education[];

  @AfterLoad()
  sortEducations() {
    if (this?.educations?.length) {
      this.educations.sort((a, b) => a.order - b.order);
    }
  }

  @AfterLoad()
  sortWorkHistories() {
    if (this?.workHistories?.length) {
      this.workHistories.sort((a, b) => a.order - b.order);
    }
  }
}

export class UserDto {
  @IsString()
  @MaxLength(300)
  @IsOptional()
  firstName: string;

  @IsString()
  @MaxLength(300)
  @IsOptional()
  lastName: string;

  @IsString()
  @MaxLength(300)
  @IsOptional()
  companyName: string;

  @IsString()
  @IsOptional()
  image: string;
}

export class CreateUserDto extends PartialType(UserDto) {
  @IsEmail()
  @MaxLength(300)
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  accountType: string;

  @IsString()
  @IsNotEmpty()
  @Matches('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$')
  password: string;
}

export class UpdateUserDto extends PartialType(UserDto) {
  @IsString()
  @MaxLength(300)
  handle: string;

  @IsString()
  @MaxLength(300)
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  theme: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description: string;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  website: string;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  location: string;

  @IsString()
  @MaxLength(1000)
  @IsOptional()
  languages: string;

  @IsString()
  @MaxLength(1000)
  @IsOptional()
  specialSkills: string;

  @IsString()
  @MaxLength(300)
  @IsOptional()
  facebook: string;

  @IsString()
  @MaxLength(300)
  @IsOptional()
  twitter: string;

  @IsString()
  @MaxLength(300)
  @IsOptional()
  github: string;

  @IsString()
  @MaxLength(300)
  @IsOptional()
  linkedin: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWorkHistoryDto)
  workHistories: CreateWorkHistoryDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEducationDto)
  educations: CreateEducationDto[];
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @Matches('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$')
  password: string;
}
