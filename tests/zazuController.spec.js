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
      this.create = jasmine.createSpy('create').and.callFake(function (zazu) {
        return zazu;
      });
      this.update = jasmine.createSpy('update').and.callFake(function (id, prop, value) {
        return [id, prop, value];
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
});
