import { Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { OpenSSHService } from 'src/openSsh.service';
import { CreateRepoDto } from './dto/create-repo.dto';
import { UpdateRepoDto } from './dto/update-repo.dto';
import * as path from 'path';
import * as fs from 'fs';
import { Repository, Cred, Clone } from 'nodegit';
import { PrismaClient } from '.prisma/client';

var Git = require('nodegit');

@Injectable()
export class ReposService {
  constructor(private openSSH: OpenSSHService, private prisma: PrismaClient) {}
  octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_CODE });

  async create(createRepoDto: CreateRepoDto) {
    return this.octokit.repos.createForAuthenticatedUser({
      name: createRepoDto.name,
    });
  }

  async createKey() {
    const keys = await this.openSSH.createKey();

    await this.octokit.rest.repos.createDeployKey({
      owner: 'JamesWrightDev',
      repo: 'test-repo',
      key: keys.publicKey,
      title: 'GIT CMS PROTOTYPE',
    });

    return this.prisma.repo.create({
      data: {
        name: 'test-repo',
        private_key: keys.privateKey,
        public_key: keys.publicKey,
      },
    });
  }

  async findAll() {
    return (
      await this.octokit.repos.listForUser({ username: 'JamesWrightDev' })
    ).data;
  }

  getCharCodes(s: string) {
    let charCodeArr = [];

    for (let i = 0; i < s.length; i++) {
      let code = s.charCodeAt(i);
      charCodeArr.push(code);
    }

    return charCodeArr;
  }

  async clone(name: string) {
    const keys = await this.prisma.repo.findFirst({
      where: { name: 'test-repo' },
    });
    try {
      const cred = Git.Credential.sshKeyMemoryNew(
        'git',
        keys.public_key,
        keys.private_key,
        'secret password',
      );

      const cloneOpts = {
        fetchOpts: {
          callbacks: {
            certificateCheck: function () {
              return 0;
            },
            credentials: (url, username) => {
              return cred;
            },
          },
        },
      };

      const repo = await Git.Clone.clone(
        'git@github.com:JamesWrightDev/test-repo.git',
        `./tmp`,
        cloneOpts,
      );
      return 'OK';
    } catch (e) {
      console.log('error');
      console.log(e);
    }

    return 'hello';
  }

  async findOne(name: string) {
    const keys = await this.prisma.repo.findFirst({
      where: { name: 'test-repo' },
    });

    const cred = Git.Credential.sshKeyMemoryNew(
      'git',
      keys.public_key,
      keys.private_key,
      'secret password',
    );

    const directoryName = '';
    const fileName = 'testfile.txt';
    const fileContent = 'this is just a demo!';

    try {
      const repo = await Git.Repository.open('./tmp');
      await fs.promises.writeFile(
        path.join(repo.workdir(), fileName),
        fileContent,
      );

      await fs.promises.writeFile(
        path.join(repo.workdir(), directoryName, fileName),
        fileContent,
      );

      const index = await repo.refreshIndex();
      // this file is in the root of the directory and doesn't need a full path
      await index.addByPath(fileName);
      // this file is in a subdirectory and can use a relative path
      // this will write both files to the index
      await index.write();

      const oid = await index.writeTree();

      const parent = await repo.getHeadCommit();
      const author = Git.Signature.now(
        'James Wright',
        'jameswrightdev@gmail.com',
      );
      const committer = Git.Signature.now(
        'GIT CMS',
        'gitcms@jameswrightdev.com',
      );

      const commitId = await repo.createCommit(
        'HEAD',
        author,
        committer,
        'message',
        oid,
        [parent],
      );

      const remote = await repo.getRemote('origin');

      await remote.push(['refs/heads/main:refs/heads/main'], {
        callbacks: {
          credentials: (url, user) => cred,
        },
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  update(id: number, updateRepoDto: UpdateRepoDto) {
    return `This action updates a #${id} repo`;
  }

  remove(id: number) {
    return `This action removes a #${id} repo`;
  }
}
