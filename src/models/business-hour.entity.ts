import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {IsBoolean, IsNotEmpty, IsNumber, IsString, MaxLength} from 'class-validator';
import {PartialType} from '@nestjs/swagger';
import {User} from './user.entity';

@Entity()
export class BusinessHour {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: false})
  open: boolean;

  @Column({length: 5, default: '00:00'})
  from: string;

  @Column({length: 5, default: '00:00'})
  to: string;

  @Column({default: 0})
  order: number;

  @ManyToOne(() => User, (user) => user.socialMediaLinks, {
    nullable: false,
    onDelete: 'CASCADE'
  })
  @JoinColumn({name: 'userId'})
  user: User;

  @Column()
  userId: number;
}

export class CreateBusinessHourDto {
  @IsBoolean()
  @IsNotEmpty()
  open: boolean;

  @IsString()
  @MaxLength(5)
  from: string;

  @IsString()
  @MaxLength(5)
  to: string;

  @IsNumber()
  @IsNotEmpty()
  order: number;
}

export class UpdateBusinessHourDto extends PartialType(CreateBusinessHourDto) {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
