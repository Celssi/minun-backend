import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from 'src/models/user.entity';
import {Repository} from 'typeorm';
import {SocialMediaLink} from '../models/social-media-link.entity';
import {WorkHistory} from '../models/work-history.entity';
import {Education} from '../models/education.entity';
import {BusinessHour} from '../models/business-hour.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(SocialMediaLink)
    private socialMediaLinksRepository: Repository<SocialMediaLink>,
    @InjectRepository(WorkHistory)
    private workHistoriesRepository: Repository<WorkHistory>,
    @InjectRepository(Education)
    private educationsRepository: Repository<Education>,
    @InjectRepository(BusinessHour)
    private businessHoursRepository: Repository<BusinessHour>
  ) {
  }

  async findById(userId: number): Promise<User> {
    return this.usersRepository.findOne({id: userId}, {relations: ['socialMediaLinks', 'workHistories', 'educations', 'businessHours']});
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find({relations: ['socialMediaLinks', 'workHistories', 'educations', 'businessHours']});
  }

  findAllPublic(): Promise<User[]> {
    return this.usersRepository.find({where: {public: true}, relations: ['socialMediaLinks', 'workHistories', 'educations', 'businessHours']});
  }

  async findWithEmailIncludeHashAndSalt(email: string): Promise<User> {
    return this.usersRepository
      .createQueryBuilder()
      .where({email})
      .addSelect('User.hash')
      .addSelect('User.salt')
      .leftJoinAndSelect('User.socialMediaLinks', 'socialMediaLinks')
      .getOne();
  }

  async create(user: User) {
    const created = this.usersRepository.create(user);
    return this.usersRepository.save(created);
  }

  async update(user: User) {
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({email: email}, {relations: ['socialMediaLinks', 'workHistories', 'educations', 'businessHours']});
  }

  async findByRefreshToken(token: string) {
    return this.usersRepository.findOne({refreshToken: token});
  }

  async findByFacebookToken(token: string) {
    return this.usersRepository.findOne({facebookToken: token});
  }

  async findByGoogleToken(token: string) {
    return this.usersRepository.findOne({googleToken: token});
  }

  async findByHandle(handle: string) {
    return this.usersRepository.findOne({handle: handle}, {relations: ['socialMediaLinks', 'workHistories', 'educations', 'businessHours']});
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete({id: id});
  }

  async removeAllSocialMediaLinks(userId: number): Promise<void> {
    await this.socialMediaLinksRepository.delete({userId: userId});
  }

  saveSocialMediaLink(socialMediaLink: SocialMediaLink) {
    const created = this.socialMediaLinksRepository.create(socialMediaLink);
    return this.socialMediaLinksRepository.save(created);
  }

  async removeAllWorkHistories(userId: number): Promise<void> {
    await this.workHistoriesRepository.delete({userId: userId});
  }

  saveWorkHistory(workHistory: WorkHistory) {
    const created = this.workHistoriesRepository.create(workHistory);
    return this.workHistoriesRepository.save(created);
  }

  async removeAllEducations(userId: number): Promise<void> {
    await this.educationsRepository.delete({userId: userId});
  }

  saveEducation(education: Education) {
    const created = this.educationsRepository.create(education);
    return this.educationsRepository.save(created);
  }

  async removeAllBusinessHours(userId: number): Promise<void> {
    await this.businessHoursRepository.delete({userId: userId});
  }

  saveBusinessHour(businessHour: BusinessHour) {
    const created = this.businessHoursRepository.create(businessHour);
    return this.businessHoursRepository.save(created);
  }

  findWithSearchPhrase(searchPhrase: string, offset: number) {
    return this.usersRepository.find({
      where: `(CONCAT(firstName, ' ', lastName) like '%${searchPhrase}%' 
      or companyName like '%${searchPhrase}%' or email like '%${searchPhrase}%'
      or handle like '%${searchPhrase}%')`,
      relations: [
        'socialMediaLinks',
        'workHistories',
        'educations',
        'businessHours'
      ],
      take: 20,
      skip: offset * 20
    });
  }
}
