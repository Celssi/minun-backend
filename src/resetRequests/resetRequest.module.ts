import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetRequest } from '../models/resetRequest.entity';
import { ResetRequestsService } from './resetRequests.service';

@Module({
  imports: [TypeOrmModule.forFeature([ResetRequest])],
  providers: [ResetRequestsService],
  exports: [ResetRequestsService],
  controllers: []
})
export class ResetRequestModule {}
