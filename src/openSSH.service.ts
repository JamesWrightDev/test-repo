import { Injectable } from '@nestjs/common';
import { generateKeyPair } from 'crypto';
const sshpk = require('sshpk');

type KeyRes = {
  publicKey: string;
  privateKey: string;
};

const generateKeyPairPromise = (): Promise<KeyRes> => {
  return new Promise((resolve, reject) => {
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
          reject(err);
        } else {
          const pemKey = sshpk.parseKey(publicKey, 'pem');
          const sshRsa = pemKey.toString('ssh');
          resolve({
            privateKey: privateKey,
            publicKey: sshRsa,
          });
        }
      },
    );
  });
};

@Injectable()
export class OpenSSHService {
  async createKey() {
    return await generateKeyPairPromise();
  }
}
