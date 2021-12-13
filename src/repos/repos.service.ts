import { Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { CreateRepoDto } from './dto/create-repo.dto';
import { UpdateRepoDto } from './dto/update-repo.dto';
import { generateKeyPair } from 'crypto';
const sshpk = require('sshpk');

@Injectable()
export class ReposService {
  octokit = new Octokit({ auth: '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' });

  async create(createRepoDto: CreateRepoDto) {
    return this.octokit.repos.createForAuthenticatedUser({
      name: createRepoDto.name,
    });
  }

  async createKey() {
    // TODO Abstract to a Service
    generateKeyPair(
      'rsa',
      {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'pkcs1',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
        },
      },
      (err, publicKey, privateKey) => {
        if (err) {
          // handle Error
        } else {
          const pemKey = sshpk.parseKey(publicKey, 'pem');
          const sshRsa = pemKey.toString('ssh');

          this.octokit.rest.repos
            .createDeployKey({
              owner: 'JamesWrightDev',
              repo: 'ACF-Fields',
              key: sshRsa,
              title: 'GIT CMS PROTOTYPE',
            })
            .then((data) => {
              return 'YAY!';
            })
            .catch((e) => {
              console.log(e);
              return e;
            });
        }
      },
    );
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
