import { Module } from '@nestjs/common';
import { ReposService } from './repos.service';
import { ReposController } from './repos.controller';

@Module({
  controllers: [ReposController],
  providers: [ReposService]
})
export class ReposModule {}
