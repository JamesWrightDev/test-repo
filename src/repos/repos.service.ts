import { Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { CreateRepoDto } from './dto/create-repo.dto';
import { UpdateRepoDto } from './dto/update-repo.dto';

@Injectable()
export class ReposService {
  octokit = new Octokit({ auth: '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' });

  async create(createRepoDto: CreateRepoDto) {
    return this.octokit.repos.createForAuthenticatedUser({
      name: createRepoDto.name,
    });
  }

  async findAll() {
    return (
      await this.octokit.repos.listForUser({ username: 'JamesWrightDev' })
    ).data;
  }

  async findOne(name: string) {
    return (
      await this.octokit.repos.getContent({
        owner: 'JamesWrightDev',
        repo: name,
        path: '',
      })
    ).data;
  }

  update(id: number, updateRepoDto: UpdateRepoDto) {
    return `This action updates a #${id} repo`;
  }

  remove(id: number) {
    return `This action removes a #${id} repo`;
  }
}
