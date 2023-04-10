import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';
import { User } from './user.entity';

@Entity()
export class ResetRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.resetRequests, {
    nullable: false,
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @Column({ unique: true })
  code: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date: Date;
}

export class ResetRequestDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  code: string;

  @IsOptional()
  @Matches('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$')
  password: string;
}
