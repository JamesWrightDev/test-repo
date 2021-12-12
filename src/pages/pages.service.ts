import { Injectable } from '@nestjs/common';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { Octokit } from '@octokit/rest';

@Injectable()
export class PagesService {
  octokit = new Octokit({ auth: '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' });

  create(createPageDto: CreatePageDto) {
    return 'This action adds a new page';
  }

  async findAll() {
    return this.octokit.repos
      .getContent({
        owner: 'JamesWrightDev',
        repo: 'Meal-Planner',
        path: '',
      })
      .then((data) => data);
  }

  async findOne(repo: string, path?: string) {
    try {
      const repoRes = await this.octokit.repos.getContent({
        owner: 'JamesWrightDev',
        repo: repo,
        path: path.replace(/['"]+/g, '') ?? '',
      });
      return repoRes.data;
    } catch (e) {
      console.log(e);
    }
  }

  async update(repo: string, page: UpdatePageDto) {
    return await this.octokit.repos.createOrUpdateFileContents({
      owner: 'JamesWrightDev',
      repo: repo,
      path: page.path,
      sha: page.sha,
      message: page.message,
      content: Buffer.from(page.content).toString('base64'),
    });
  }

  remove(id: number) {
    return `This action removes a #${id} page`;
  }
}
