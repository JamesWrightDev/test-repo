import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GithubStrategy } from './auth/github.strategy';
import { PagesModule } from './pages/pages.module';
import { ReposModule } from './repos/repos.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PagesModule, ReposModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, GithubStrategy],
})
export class AppModule {}
