import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { ResetRequest } from '../models/resetRequest.entity';

@Injectable()
export class ResetRequestsService {
  constructor(
    @InjectRepository(ResetRequest)
    private resetRequestsRepository: Repository<ResetRequest>
  ) {}

  async findByCode(code: string): Promise<ResetRequest> {
    const dayAgo = new Date();
    dayAgo.setHours(dayAgo.getHours() - 24);

    return this.resetRequestsRepository.findOne({
      where: { code: code, date: MoreThan(dayAgo) },
      relations: ['user']
    });
  }

  async create(resetRequest: ResetRequest) {
    const created = this.resetRequestsRepository.create(resetRequest);
    return this.resetRequestsRepository.save(created);
  }

  async update(resetRequest: ResetRequest) {
    return this.resetRequestsRepository.save(resetRequest);
  }

  async remove(id: number): Promise<void> {
    await this.resetRequestsRepository.delete(id);
  }
}
