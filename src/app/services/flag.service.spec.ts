import {FlagService} from './flag.service';
import {ConfigService} from './config.service';

describe('service: FlagService', () => {
  let service: FlagService;
  let flags: {
    firstTime: boolean;
  };
  let configService: ConfigService;

  beforeEach(() => {
    flags = {
      firstTime: false
    };
    process.env.ENV = 'development';
    configService = new ConfigService();
    service = new FlagService(configService);
  });

  afterAll(() => {
    service = null;
    flags = null;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('refresh', () => {
    it('should refresh flags from storage', () => {
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(flags));
      expect(service.flags).toEqual({});
      service.refresh();
      expect(service.flags).toEqual(flags);
    });
  });

  describe('getFlag', () => {
    beforeEach(() => {
      service.flags = flags;
    });

    afterEach(() => {
      service.flags = null;
    });

    it('should return the value of flag if it exists', () => {
      expect(service.getFlag('firstTime')).toEqual(false);
    });

    it('should return undefined if flag does not exist', () => {
      expect(service.getFlag('flag')).toEqual(undefined);
    });
  });

  describe('setFlag', () => {
    it('should set the specified flag with value and call storage setItem with flagsKey and flags data', () => {
      service.flags = flags;
      expect(service.flags.firstTime).toEqual(false);
      spyOn(localStorage, 'setItem');
      service.setFlag('firstTime', true);
      expect(service.flags.firstTime).toEqual(true);
      expect(localStorage.setItem).toHaveBeenCalledWith('zazu.flags.test', JSON.stringify(service.flags));
    });
  });
});
