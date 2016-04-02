require('angular-mocks');

import zazuApp from '../index';

describe('service: ZazuService', () => {
  let service;
  let storage;
  let zazus;
  let flagService;

  beforeEach(angular.mock.module(zazuApp));

  beforeEach(angular.mock.module(($provide) => {
    $provide.service('StorageService', function () {
      this.get = jasmine.createSpy('get').and.callFake(() => {
        return zazus;
      });
      this.create = jasmine.createSpy('create').and.callThrough();
      this.update = jasmine.createSpy('update').and.callThrough();
      this.remove = jasmine.createSpy('remove').and.callThrough();
      this.swap = jasmine.createSpy('swap').and.callThrough();
    });

    $provide.service('FlagService', function () {
      this.getFlag = angular.noop;
      this.setFlag = angular.noop;
    });
  }));

  beforeEach(inject((_ZazuService_, _StorageService_, _FlagService_) => {
    service = _ZazuService_;
    storage = _StorageService_;
    flagService = _FlagService_;
    zazus = [
      {id: 'zazu-id', label: 'label', checked: true},
      {id: 'another-zazu-id', label: 'another label', checked: false},
      {id: 'yet-another-zazu-id', label: 'yet another label', checked: true}
    ];
  }));

  afterEach(() => {
    service = null;
    storage = null;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set the right defaults', () => {
    expect(service.open).toEqual(false);
    expect(service.selected).toEqual(0);
    expect(service.zazus).toEqual(zazus);
    expect(service.filtered).toEqual(zazus);
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
      expect(service.selected).toEqual(2);
    });
  });

  describe('previous', () => {
    it('should set selected to last one if current selected is the first', () => {
      expect(service.selected).toEqual(0);
      service.previous();
      expect(service.selected).toEqual(2);
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
      expect(service.isSelected(2)).toEqual(true);
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

  describe('isLastSelected', () => {
    it('should return false if selected is not the last zazu of array', () => {
      expect(service.isLastSelected()).toEqual(false);
    });

    it('should return true if selected is the last zazu of array', () => {
      service.next();
      service.next();
      expect(service.isLastSelected()).toEqual(true);
    });
  });

  describe('isFirstSelected', () => {
    it('should return true if selected is the first zazu of array', () => {
      expect(service.isFirstSelected()).toEqual(true);
    });

    it('should return false if selected is not the first zazu of array', () => {
      service.next();
      expect(service.isFirstSelected()).toEqual(false);
    });
  });

  describe('isOpen', () => {
    it('should return true if open flag is false', () => {
      expect(service.isOpen(zazus[0])).toEqual(true);
    });

    it('should return true if open flag is true and zazu checked is false', () => {
      service.open = true;
      expect(service.isOpen(zazus[1])).toEqual(true);
    });

    it('should return false if open flag is true and zazu checked is false', () => {
      service.open = true;
      expect(service.isOpen(zazus[0])).toEqual(false);
    });
  });

  describe('toggleOpen', () => {
    it('should toggle open flag and reset selected index', () => {
      spyOn(service, 'resetSelected');
      service.toggleOpen();
      expect(service.open).toEqual(true);
      expect(service.resetSelected).toHaveBeenCalled();
    });
  });

  describe('isFirstTime', () => {
    it('should return true if firstTime flag is undefined', () => {
      spyOn(flagService, 'getFlag').and.returnValue(undefined);
      expect(service.isFirstTime()).toEqual(true);
    });

    it('should return true if firstTime flag is false', () => {
      spyOn(flagService, 'getFlag').and.returnValue(false);
      expect(service.isFirstTime()).toEqual(true);
    });

    it('should return false if firstTime flag is true', () => {
      spyOn(flagService, 'getFlag').and.returnValue(true);
      expect(service.isFirstTime()).toEqual(false);
    });
  });

  describe('setFirstTime', () => {
    it('should call FlagService setFlag with "firstTime" and true', () => {
      spyOn(flagService, 'setFlag');
      service.setFirstTime();
      expect(flagService.setFlag).toHaveBeenCalledWith('firstTime', true);
    });
  });

  describe('moveDown', () => {
    it('should call swap with 0 and 1 if selected is 0 and call next', () => {
      spyOn(service, 'swap');
      spyOn(service, 'next');
      service.selected = 0;
      service.moveDown();
      expect(service.swap).toHaveBeenCalledWith(0, 1);
      expect(service.next).toHaveBeenCalled();
    });

    it('should call swap with 2 and 0 if selected is last one (2) and call next', () => {
      spyOn(service, 'swap');
      spyOn(service, 'next');
      service.selected = 2;
      service.moveDown();
      expect(service.swap).toHaveBeenCalledWith(2, 0);
      expect(service.next).toHaveBeenCalled();
    });
  });

  describe('moveUp', () => {
    it('should call swap with 2 and 1 if selected is 2 and call previous', () => {
      spyOn(service, 'swap');
      spyOn(service, 'previous');
      service.selected = 2;
      service.moveUp();
      expect(service.swap).toHaveBeenCalledWith(2, 1);
      expect(service.previous).toHaveBeenCalled();
    });

    it('should call swap with 0 and 2 if selected is first one (0) and call previous', () => {
      spyOn(service, 'swap');
      spyOn(service, 'previous');
      service.selected = 0;
      service.moveUp();
      expect(service.swap).toHaveBeenCalledWith(0, 2);
      expect(service.previous).toHaveBeenCalled();
    });
  });

  describe('swap', () => {
    it('should not call refresh or storage swap if firstIndex equals secondIndex', () => {
      spyOn(service, 'refresh');
      service.swap(0, 0);
      expect(storage.swap).not.toHaveBeenCalled();
      expect(service.refresh).not.toHaveBeenCalled();
    });

    it('should call storage swap with firstIndex and secondIndex and then call refresh', () => {
      spyOn(service, 'refresh');
      service.swap(0, 1);
      expect(storage.swap).toHaveBeenCalledWith(0, 1);
      expect(service.refresh).toHaveBeenCalled();
    });
  });
});
