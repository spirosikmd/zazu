import {ConfigService} from './config.service';

describe('service: ConfigService', () => {
  let configService: ConfigService;

  describe('development', () => {

    beforeEach(() => {
      process.env.ENV = 'development';
      configService = new ConfigService();
    });

    it('#get should return db \'zazus.test\'', () => {
      expect(configService.get('db')).toEqual('zazus.test');
    });

    it('#get should return flagsKey \'zazus.flags.test\'', () => {
      expect(configService.get('flagsKey')).toEqual('zazu.flags.test');
    });

  });

  describe('production', () => {

    beforeEach(() => {
      process.env.ENV = 'production';
      configService = new ConfigService();
    });

    it('#get should return db \'zazus\'', () => {
      expect(configService.get('db')).toEqual('zazus');
    });

    it('#get should return flagsKey \'zazus.flags\'', () => {
      expect(configService.get('flagsKey')).toEqual('zazu.flags');
    });

  });
});
