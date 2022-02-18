import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { User } from './user.entity';

@Entity()
export class WorkHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 300 })
  title: string;

  @Column({ length: 300 })
  workplace: string;

  @Column({ length: 300 })
  period: string;

  @Column({ length: 1000, nullable: true })
  description: string;

  @Column({ default: 0 })
  order: number;

  @ManyToOne(() => User, (user) => user.socialMediaLinks, {
    nullable: false,
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;
}

export class CreateWorkHistoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  workplace: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  period: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description: string;

  @IsNumber()
  @IsNotEmpty()
  order: number;
}

export class UpdateWorkHistoryDto extends PartialType(CreateWorkHistoryDto) {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
