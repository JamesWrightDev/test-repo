import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    id: string,
    username: string,
    provider: 'github',
  ): Promise<any> {
    return this.usersService.user(id, username);
  }

  githubLogin(req) {
    if (!req.user) {
      return 'NO github user';
    }
    const payload = req.user;

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
