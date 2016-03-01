require('angular-mocks');

import zazu from '../src/zazu';
import ZazuService from '../src/services/ZazuService';

describe('ZazuService', () => {
  let service;
  let storage;
  let zazus;

  beforeEach(angular.mock.module(zazu));

  beforeEach(angular.mock.module(($provide) => {
    $provide.service('StorageService', function () {
      this.get = jasmine.createSpy('get').and.callFake(() => {
        return zazus;
      });
      this.create = jasmine.createSpy('create').and.callThrough();
      this.update = jasmine.createSpy('update').and.callThrough();
      this.remove = jasmine.createSpy('remove').and.callThrough();
    });
  }));

  beforeEach(inject((_ZazuService_, _StorageService_) => {
    service = _ZazuService_;
    storage = _StorageService_;
    zazus = [
      {id: 'zazu-id', label: 'label', checked: true},
      {id: 'another-zazu-id', label: 'another label', checked: false}
    ];
  }));

  afterEach(() => {
    service = null;
    storage = null;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('refresh', () => {
    it('should set zazus from storage', () => {
      expect(storage.get).toHaveBeenCalled();
      expect(service.zazus).toEqual(zazus);
    });
  });

  describe('get', () => {
    it('should return a copy of zazus', () => {
      expect(service.get()).toEqual(zazus);
    });
  });

  describe('create', () => {
    it('should create zazu in storage and refresh', () => {
      spyOn(service, 'refresh');
      let zazu = [{label: 'another-label', checked: false}];
      service.create(zazu);
      expect(storage.create).toHaveBeenCalledWith(zazu);
      expect(service.refresh).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update zazu with id in storage and refresh', () => {
      spyOn(service, 'refresh');
      service.update('zazu-id', 'checked', true);
      expect(storage.update).toHaveBeenCalledWith('zazu-id', 'checked', true);
      expect(service.refresh).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should call storage remove with id and refresh', () => {
      spyOn(service, 'refresh');
      service.remove('zazu-id');
      expect(storage.remove).toHaveBeenCalledWith('zazu-id');
      expect(service.refresh).toHaveBeenCalled();
    });
  });

  describe('next', () => {
    it('should increase selected by 1', () => {
      expect(service.selected).toEqual(0);
      service.next();
      expect(service.selected).toEqual(1);
    });

    it('should set selected to 0 if current selected is last one', () => {
      service.next();
      service.next();
      expect(service.selected).toEqual(0);
    });
  });

  describe('previous', () => {
    it('should set selected to last one if current selected is the first', () => {
      expect(service.selected).toEqual(0);
      service.previous();
      expect(service.selected).toEqual(1);
    });

    it('should decrease selected by 1', () => {
      service.next();
      expect(service.selected).toEqual(1);
      service.previous();
      expect(service.selected).toEqual(0);
    });
  });

  describe('getSelected', () => {
    it('should return the selected zazu', () => {
      expect(service.getSelected()).toEqual(zazus[0]);
      service.next();
      expect(service.getSelected()).toEqual(zazus[1]);
    });
  });

  describe('isSelected', () => {
    it('should return true if zazu in index is the selected', () => {
      expect(service.isSelected(0)).toEqual(true);
      service.previous();
      expect(service.isSelected(1)).toEqual(true);
    });

    it('should return false is zazu in index is not selected', () => {
      expect(service.isSelected(1)).toEqual(false);
    });
  });

  describe('resetSelected', () => {
    it('should reset selected to 0', () => {
      service.next();
      expect(service.selected).toEqual(1);
      service.resetSelected();
      expect(service.selected).toEqual(0);
    });
  });

  describe('setEditing', () => {
    it('should set editing mode of selected to true', () => {
      let zazu = zazus[0];
      spyOn(service, 'getSelected').and.callFake(() => {
        return zazu;
      });
      service.setEditing(true);
      expect(service.getSelected).toHaveBeenCalled();
      expect(zazu.editing).toEqual(true);
    });

    it('should set editing mode of selected to false', () => {
      let zazu = zazus[0];
      zazu.editing = true;
      spyOn(service, 'getSelected').and.callFake(() => {
        return zazu;
      });
      service.setEditing(false);
      expect(service.getSelected).toHaveBeenCalled();
      expect(zazu.editing).toEqual(false);
    });
  });

  describe('isEditing', () => {
    it('should return true if selected is in edit mode', () => {
      let zazu = zazus[0];
      zazu.editing = true;
      spyOn(service, 'getSelected').and.callFake(() => {
        return zazu;
      });
      expect(service.isEditing()).toEqual(true);
      expect(service.getSelected).toHaveBeenCalled();
    });

    it('should return false if selected editing is undefined', () => {
      let zazu = zazus[0];
      spyOn(service, 'getSelected').and.callFake(() => {
        return zazu;
      });
      expect(service.isEditing()).toEqual(false);
      expect(service.getSelected).toHaveBeenCalled();
    });

    it('should return false if selected is not in edit mode', () => {
      let zazu = zazus[0];
      zazu.editing = false;
      spyOn(service, 'getSelected').and.callFake(() => {
        return zazu;
      });
      expect(service.isEditing()).toEqual(false);
      expect(service.getSelected).toHaveBeenCalled();
    });
  });
});