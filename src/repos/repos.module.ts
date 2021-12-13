import { Module } from '@nestjs/common';
import { ReposService } from './repos.service';
import { ReposController } from './repos.controller';
import { OpenSSHService } from 'src/openSsh.service';
import { PrismaClient } from '.prisma/client';

@Module({
  controllers: [ReposController],
  providers: [ReposService, OpenSSHService, PrismaClient],
})
export class ReposModule {}
