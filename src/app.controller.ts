import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { GithubStrategy } from './auth/github.strategy';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService, // readonly githubService: GithubStrategy,
  ) {}

  @Get()
  @UseGuards(AuthGuard('github2'))
  getHello(@Req() req): string {
    return this.appService.getHello();
  }

  @Get('/auth/github/callback')
  @UseGuards(AuthGuard('github2'))
  githubAuth(@Req() req) {
    return this.appService.githubLogin(req);
  }
}
