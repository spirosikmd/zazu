require('angular-mocks');

import zazu from '../src/zazu';
import {ZazuController} from '../src/controllers/ZazuController';

describe('ZazuController', () => {
  let $controller;
  let $scope;
  let controller;
  let ZazuService;

  beforeEach(angular.mock.module(zazu));

  beforeEach(angular.mock.module(($provide) => {
    $provide.service('ZazuService', function () {
      this.get = jasmine.createSpy('get').and.callFake(function () {
        return [{label: 'label', checked: true}];
      });
      this.create = jasmine.createSpy('create').and.callThrough();
      this.update = jasmine.createSpy('update').and.callThrough();
      this.setEditing = jasmine.createSpy('setEditing').and.callThrough();
      this.remove = jasmine.createSpy('remove').and.callThrough();
      this.resetSelected = jasmine.createSpy('resetSelected').and.callThrough();
      this.isSelected = jasmine.createSpy('isSelected').and.callFake(function (index) {
        return index === 1;
      });
    });
  }));

  beforeEach(inject((_$controller_, _$rootScope_, _ZazuService_) => {
    $controller = _$controller_;
    $scope = _$rootScope_.$new();
    ZazuService = _ZazuService_;
  }));

  beforeEach(() => {
    controller = $controller(ZazuController, {$scope: $scope, ZazuService: ZazuService});
  });

  afterEach(() => {
    $controller = null;
    $scope = null;
    controller = null;
    ZazuService = null;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('setMode', () => {
    it('should set the app mode to specified state', () => {
      expect(controller.modes.create).toEqual(false);
      controller.setMode('create', true);
      expect(controller.modes.create).toEqual(true);
    });

    it('should set a new mode to specified state', () => {
      expect(controller.modes.new).toBeUndefined();
      controller.setMode('new', true);
      expect(controller.modes.new).toEqual(true);
    });
  });

  describe('refresh', () => {
    it('should get ', () => {
      let zazu = {label: 'label', checked: true};
      expect(controller.zazus.length).toEqual(1);
      controller.refresh();
      expect(ZazuService.get).toHaveBeenCalled();
      expect(controller.zazus.length).toEqual(1);
      expect(controller.zazus[0]).toEqual(zazu);
    });
  });

  describe('reset', () => {
    it('should copy the default zazu to current zazu', () => {
      expect(controller.zazu).toEqual({label: '', checked: false});
      controller.zazu = {label: 'label', checked: true};
      controller.reset();
      expect(controller.zazu).toEqual({label: '', checked: false});
    });
  });

  describe('create', () => {
    it('should not create new zazu if label is length 0', () => {
      controller.create({label: '', checked: false});
      expect(ZazuService.create).not.toHaveBeenCalled();
    });

    it('should create new zazu', () => {
      let zazu = {label: 'label', checked: false};
      spyOn(controller, 'refresh');
      spyOn(controller, 'reset');
      controller.create(zazu);
      expect(ZazuService.create).toHaveBeenCalledWith(zazu);
      expect(controller.refresh).toHaveBeenCalled();
      expect(controller.reset).toHaveBeenCalled();
    });
  });

  describe('updateChecked', () => {
    it('should update the checked property of zazu with the specified id', () => {
      spyOn(controller, 'refresh');
      controller.updateChecked('zazu-id', true);
      expect(ZazuService.update).toHaveBeenCalledWith('zazu-id', 'checked', true);
      expect(controller.refresh).toHaveBeenCalled();
    });
  });

  describe('updateLabel', () => {
    it('should not update label if key code is not 13', () => {
      controller.updateLabel({which: 15}, 'zazu-id', 'label');
      expect(ZazuService.update).not.toHaveBeenCalled();
    });

    it('should update label if key code is 13 and set editing mode to false', () => {
      spyOn(controller, 'refresh');
      controller.updateLabel({which: 13}, 'zazu-id', 'zazu-label');
      expect(ZazuService.update).toHaveBeenCalledWith('zazu-id', 'label', 'zazu-label');
      expect(ZazuService.setEditing).toHaveBeenCalledWith(false);
      expect(controller.refresh).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should not remove if zazu is undefined', () => {
      controller.remove();
      expect(ZazuService.remove).not.toHaveBeenCalled();
    });

    it('should call remove from ZazuService, refresh, and reset selected', () => {
      spyOn(controller, 'refresh');
      controller.remove({id: 'zazu-id'});
      expect(ZazuService.remove).toHaveBeenCalledWith('zazu-id');
      expect(controller.refresh).toHaveBeenCalled();
      expect(ZazuService.resetSelected).toHaveBeenCalled();
    });
  });

  describe('isSelected', () => {
    it('should call ZazuService isSelected with index 1 and return true', () => {
      expect(controller.isSelected(1)).toEqual(true);
      expect(ZazuService.isSelected).toHaveBeenCalledWith(1);
    });

    it('should call ZazuService isSelected with index 0 and return false', () => {
      expect(controller.isSelected(0)).toEqual(false);
      expect(ZazuService.isSelected).toHaveBeenCalledWith(0);
    });
  });
});
