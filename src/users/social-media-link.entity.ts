import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {User} from './user.entity';

export enum LinkType {
  Facebook,
  Twitter,
  Github,
  Linkedin
}

@Entity()
export class SocialMediaLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  link: string;

  @Column('enum', {enum: LinkType})
  type: LinkType;

  @ManyToOne(() => User, (user) => user.socialMediaLinks, {
    nullable: false,
    onDelete: 'CASCADE'
  })
  @JoinColumn({name: 'userId'})
  user: User;

  @Column()
  userId: number;
}
