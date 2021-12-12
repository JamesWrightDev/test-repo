import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';

import { Injectable } from '@nestjs/common';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github2') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: 'http://localhost:3000/auth/github/callback',
      scope: ['repo', 'read:user'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const { username, id } = profile;
    const user = {
      id,
      username,
    };

    done(false, user);
  }
}
