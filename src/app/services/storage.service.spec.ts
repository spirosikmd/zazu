import {StorageService} from './storage.service';
import {Zazu} from '../models/zazu.model';
import {ConfigService} from './config.service';
const randomstring = require('randomstring');

describe('service: StorageService', () => {
  let service: StorageService;
  let zazus: Zazu[];
  let configService: ConfigService;

  beforeEach(() => {
    zazus = [
      new Zazu({id: 'zazu-id', label: 'label', checked: true}),
      new Zazu({id: 'another-zazu-id', label: 'another-label', checked: false}),
      new Zazu({id: 'yet-another-zazu-id', label: 'yet-another-label', checked: true})
    ];
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(zazus));
    configService = new ConfigService();
    service = new StorageService(configService);
    service.refresh();
  });

  afterAll(() => {
    service = null;
    zazus = null;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('refresh', () => {
    it('should refresh zazus from local storage', () => {
      expect(service.zazus).toEqual(zazus);
    });
  });

  describe('get', () => {
    it('should return copy zazus', () => {
      expect(service.get()).toEqual(zazus);
    });

    it('should return empty array if zazu array is null', () => {
      service.zazus = null;
      expect(service.get()).toEqual([]);
    });
  });

  describe('save', () => {
    it('should save current zazus to local storage', () => {
      spyOn(localStorage, 'setItem');
      let otherZazus = [
        new Zazu({id: 'zazu-id-1', label: 'label-1', checked: true}),
        new Zazu({id: 'zazu-id-2', label: 'label-2', checked: false})
      ];
      service.zazus = otherZazus;
      service.save();
      expect(localStorage.setItem).toHaveBeenCalledWith('zazus.test', JSON.stringify(otherZazus));
    });

    it('should save empty array to local storage if zazus is null', () => {
      spyOn(localStorage, 'setItem');
      service.zazus = null;
      service.save();
      expect(localStorage.setItem).toHaveBeenCalledWith('zazus.test', JSON.stringify([]));
    });
  });

  describe('create', () => {
    it('should generate random id, push zazu to zazus and save', () => {
      spyOn(randomstring, 'generate').and.returnValue('random-zazu-id');
      spyOn(StorageService, 'getTime').and.returnValue(1111);
      spyOn(service, 'save');
      service.create({label: 'label', checked: true} as Zazu, 0);
      expect(randomstring.generate).toHaveBeenCalled();
      expect(StorageService.getTime).toHaveBeenCalled();
      expect(service.zazus.length).toEqual(4);
      expect(service.zazus[3]).toEqual({label: 'label', checked: true, id: 'random-zazu-id', createdAt: 1111});
      expect(service.save).toHaveBeenCalled();
    });

    it('should push zazu to position if specified', () => {
      spyOn(randomstring, 'generate').and.returnValue('random-zazu-id');
      spyOn(StorageService, 'getTime').and.returnValue(1111);
      spyOn(service, 'save');
      service.create(new Zazu({label: 'label', checked: true}), 2);
      expect(randomstring.generate).toHaveBeenCalled();
      expect(StorageService.getTime).toHaveBeenCalled();
      expect(service.zazus.length).toEqual(4);
      expect(service.zazus[2]).toEqual(new Zazu({
        label: 'label',
        checked: true,
        id: 'random-zazu-id',
        createdAt: 1111
      }));
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
      expect(service.zazus.length).toEqual(3);
      service.remove('zazu-id');
      expect(service.save).toHaveBeenCalled();
      expect(service.zazus.length).toEqual(2);
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
      expect(service.find('non-existing-zazu-id')).toEqual(-1);
    });

    it('should return index of zazu with existing id', () => {
      expect(service.find('zazu-id')).toEqual(0);
    });
  });

  describe('swap', () => {
    it('should not call save if zazu with firstId does not exist', () => {
      spyOn(service, 'save');
      service.swap('no-zazu-id', 'zazu-id');
      expect(service.save).not.toHaveBeenCalled();
    });

    it('should not call save if zazu with secondId does not exist', () => {
      spyOn(service, 'save');
      service.swap('zazu-id', 'no-zazu-id');
      expect(service.save).not.toHaveBeenCalled();
    });

    it('should swap zazu firstId with secondId and call save', () => {
      spyOn(service, 'save');
      expect(service.zazus[0]).toEqual(zazus[0]);
      expect(service.zazus[1]).toEqual(zazus[1]);
      service.swap('zazu-id', 'another-zazu-id');
      expect(service.zazus[0]).toEqual(zazus[1]);
      expect(service.zazus[1]).toEqual(zazus[0]);
      expect(service.save).toHaveBeenCalled();
    });
  });

  describe('unshift', () => {
    it('should not call remove if zazu does not exist', () => {
      spyOn(service, 'remove');
      service.unshift('no-zazu-id');
      expect(service.remove).not.toHaveBeenCalled();
    });

    it('should remove zazu from current position, unshift it, and save', () => {
      spyOn(service, 'remove').and.callThrough();
      spyOn(service, 'save').and.callThrough();
      service.unshift('yet-another-zazu-id');
      expect(service.remove).toHaveBeenCalledWith('yet-another-zazu-id');
      expect(service.save).toHaveBeenCalled();
      expect(service.zazus).toEqual([
        new Zazu({id: 'yet-another-zazu-id', label: 'yet-another-label', checked: true}),
        new Zazu({id: 'zazu-id', label: 'label', checked: true}),
        new Zazu({id: 'another-zazu-id', label: 'another-label', checked: false})
      ])
    });
  });

  describe('push', () => {
    it('should not call remove if zazu does not exist', () => {
      spyOn(service, 'remove');
      service.push('no-zazu-id');
      expect(service.remove).not.toHaveBeenCalled();
    });

    it('should remove zazu from current position, push it to the end, and save', () => {
      spyOn(service, 'remove').and.callThrough();
      spyOn(service, 'save').and.callThrough();
      service.push('zazu-id');
      expect(service.remove).toHaveBeenCalledWith('zazu-id');
      expect(service.save).toHaveBeenCalled();
      expect(service.zazus).toEqual([
        new Zazu({id: 'another-zazu-id', label: 'another-label', checked: false}),
        new Zazu({id: 'yet-another-zazu-id', label: 'yet-another-label', checked: true}),
        new Zazu({id: 'zazu-id', label: 'label', checked: true})
      ])
    });
  });
});
