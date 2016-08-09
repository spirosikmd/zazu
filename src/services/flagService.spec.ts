import {FlagService} from './FlagService';
import zazuApp from '../index';
require('angular-mocks');

describe('service: FlagService', () => {
  let service: FlagService;
  let storage: Storage;
  let flags: {
    firstTime: boolean;
  };

  beforeEach(angular.mock.module(zazuApp));

  beforeEach(inject((_FlagService_) => {
    flags = {
      firstTime: false
    };
    storage = {
      'zazu.flags.test': flags,
      getItem: function (key) {
        return angular.toJson(this[key]);
      },
      setItem: function (key, data) {
        this[key] = data;
      }
    } as Storage;
    service = _FlagService_;
    service.storage = storage;
  }));

  afterAll(() => {
    service = null;
    storage = null;
    flags = null;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('refresh', () => {
    it('should refresh flags from storage', () => {
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
      spyOn(storage, 'setItem');
      service.setFlag('firstTime', true);
      expect(service.flags.firstTime).toEqual(true);
      expect(storage.setItem).toHaveBeenCalledWith('zazu.flags.test', angular.toJson(service.flags));
    });
  });
});