require('angular-mocks');
const randomstring = require('randomstring');

import zazu from '../src/js/zazu';
import Storage from '../src/js/services/StorageService';

describe('StorageService', () => {
  let service;
  let storage;
  let zazus;

  beforeEach(angular.mock.module(zazu));

  beforeEach(inject((_StorageService_) => {
    zazus = [{id: 'zazu-id', label: 'label', checked: true}];
    storage = {
      zazus: zazus,
      getItem: function (key) {
        return angular.toJson(this[key]);
      },
      setItem: function (key, data) {
        this[key] = data;
      }
    };
    service = _StorageService_;
    service.storage = storage;
  }));

  afterEach(() => {
    service = null;
    storage = null;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('refresh', () => {
    it('should refresh zazus from local storage', () => {
      expect(service.zazus).toEqual([]);
      service.refresh();
      expect(service.zazus).toEqual(zazus);
    });
  });

  describe('get', () => {
    it('should return [] if there are no current zazus', () => {
      expect(service.get()).toEqual([]);
    });

    it('should return copy zazus', () => {
      service.zazus = zazus;
      expect(service.get()).toEqual(zazus);
    });
  });

  describe('save', () => {
    it('should save current zazus to local storage', () => {
      spyOn(storage, 'setItem');
      let otherZazus = [
        {id: 'zazu-id-1', label: 'label-1', checked: true},
        {id: 'zazu-id-2', label: 'label-2', checked: false}
      ];
      service.zazus = otherZazus;
      service.save();
      expect(storage.setItem).toHaveBeenCalledWith('zazus', angular.toJson(otherZazus));
    });
  });

  describe('create', () => {
    it('should generate random id, push zazu to zazus and save', () => {
      spyOn(randomstring, 'generate').and.callFake(() => {
        return 'random-zazu-id';
      });
      spyOn(service, 'save');
      service.create({label: 'label', checked: true});
      expect(randomstring.generate).toHaveBeenCalled();
      expect(service.zazus).toEqual([{label: 'label', checked: true, id: 'random-zazu-id'}]);
      expect(service.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should not remove any zazu if id does not exist', () => {
      service.zazus = zazus;
      spyOn(service, 'save');
      service.remove('zazu-id-not-existing');
      expect(service.save).not.toHaveBeenCalled();
      expect(service.zazus).toEqual(zazus);
    });

    it('should remove zazu with existing id and call save', () => {
      service.zazus = zazus;
      spyOn(service, 'save');
      service.remove('zazu-id');
      expect(service.save).toHaveBeenCalled();
      expect(service.zazus).toEqual([]);
    });
  });

  describe('update', () => {
    beforeEach(() => {
      service.zazus = zazus;
      spyOn(service, 'save');
    });

    afterEach(() => {
      service.zazus = [];
    });

    it('should not update any zazu if id does not exist', () => {
      service.update('zazu-id-not-existing', 'label', 'new label');
      expect(service.save).not.toHaveBeenCalled();
      expect(service.zazus[0].label).toEqual('label');
    });

    it('should update zazu with existing id and call save', () => {
      service.update('zazu-id', 'label', 'new label');
      expect(service.save).toHaveBeenCalled();
      expect(service.zazus[0].label).toEqual('new label');
    });
  });

  describe('find', () => {
    beforeEach(() => {
      service.zazus = zazus;
    });

    afterEach(() => {
      service.zazus = [];
    });

    it('should return -1 if id does not exist', () => {
      expect(service.find('another-zazu-id')).toEqual(-1);
    });

    it('should return index of zazu with existing id', () => {
      expect(service.find('zazu-id')).toEqual(0);
    });
  });
});
