import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {IsNotEmpty, IsNumber, IsString, MaxLength} from 'class-validator';
import {PartialType} from '@nestjs/swagger';
import {User} from './user.entity';

@Entity()
export class WorkHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 300})
  title: string;

  @Column({length: 300})
  workplace: string;

  @Column({length: 1000})
  description: string;

  @ManyToOne(() => User, (user) => user.socialMediaLinks, {
    nullable: false,
    onDelete: 'CASCADE'
  })
  @JoinColumn({name: 'userId'})
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
  @MaxLength(1000)
  description: string;
}

export class UpdateWorkHistoryDto extends PartialType(CreateWorkHistoryDto) {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
