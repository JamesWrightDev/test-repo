import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService, // readonly githubService: GithubStrategy,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('github2'))
  getHello(@Req() req): string {
    return this.appService.getHello();
  }

  @Get('/auth/github/callback')
  @UseGuards(AuthGuard('github2'))
  githubAuth(@Req() req) {
    return this.authService.githubLogin(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
