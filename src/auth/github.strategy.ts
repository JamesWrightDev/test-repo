import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';

import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github2') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: 'http://localhost:3030/login',
      scope: ['repo', 'read:user'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const { username, id } = profile;
    const user = this.authService.validateUser(id, username, 'github');
    done(false, user);
  }
}
