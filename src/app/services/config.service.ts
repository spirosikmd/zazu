import {Injectable} from '@angular/core';

@Injectable()
export class ConfigService {
  private env: string;
  private config = {
    development: {
      db: 'zazus.test',
      flagsKey: 'zazu.flags.test'
    },
    production: {
      db: 'zazus',
      flagsKey: 'zazu.flags'
    }
  };

  constructor () {
    this.env = process.env.ENV;
  }

  get (key: string): string {
    return this.config[this.env][key];
  }
}
