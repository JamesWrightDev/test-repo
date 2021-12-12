import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  githubLogin(req) {
    if (!req.user) {
      return 'NO github user';
    } else {
      return {
        user: req.user,
      };
    }
  }
}
