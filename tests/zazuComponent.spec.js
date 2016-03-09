require('angular-mocks');

import zazuApp from '../src/index';

describe('component: zazu', () => {
  let $componentController;
  let $scope;
  let component;
  let ZazuService;

  beforeEach(angular.mock.module(zazuApp));

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
      this.toggleOpen = jasmine.createSpy('toggleOpen').and.callThrough();
    });
  }));

  beforeEach(inject((_$componentController_, _$rootScope_, _ZazuService_) => {
    $componentController = _$componentController_;
    $scope = _$rootScope_.$new();
    ZazuService = _ZazuService_;
  }));

  beforeEach(() => {
    component = $componentController('zazu', {$scope: $scope, ZazuService: ZazuService});
  });

  afterEach(() => {
    $componentController = null;
    $scope = null;
    component = null;
    ZazuService = null;
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should set the defaults', () => {
    expect(component.defaultZazu).toEqual({
      label: '',
      checked: false
    });
    expect(component.zazus).toEqual([{ label: 'label', checked: true }]);
    expect(component.zazu).toEqual({ label: '', checked: false });
    expect(component.modes.create).toEqual(false);
    expect(component.editing).toEqual(null);
  });

  describe('setMode', () => {
    it('should set the create mode to specified state', () => {
      expect(component.modes.create).toEqual(false);
      component.setMode('create', true);
      expect(component.modes.create).toEqual(true);
    });
  });

  describe('refresh', () => {
    it('should get ', () => {
      let zazu = {label: 'label', checked: true};
      expect(component.zazus.length).toEqual(1);
      component.refresh();
      expect(ZazuService.get).toHaveBeenCalled();
      expect(component.zazus.length).toEqual(1);
      expect(component.zazus[0]).toEqual(zazu);
    });
  });

  describe('reset', () => {
    it('should copy the default zazu to current zazu', () => {
      expect(component.zazu).toEqual({label: '', checked: false});
      component.zazu = {label: 'label', checked: true};
      component.reset();
      expect(component.zazu).toEqual({label: '', checked: false});
    });
  });

  describe('create', () => {
    it('should not create new zazu if label is length 0', () => {
      component.create({label: '', checked: false});
      expect(ZazuService.create).not.toHaveBeenCalled();
    });

    it('should create new zazu', () => {
      let zazu = {label: 'label', checked: false};
      spyOn(component, 'refresh');
      spyOn(component, 'reset');
      spyOn(component, 'setMode');
      component.create(zazu);
      expect(ZazuService.create).toHaveBeenCalledWith(zazu);
      expect(component.refresh).toHaveBeenCalled();
      expect(component.reset).toHaveBeenCalled();
      expect(component.setMode).toHaveBeenCalledWith('create', false);
    });
  });

  describe('updateChecked', () => {
    it('should update the checked property of zazu with the specified id', () => {
      spyOn(component, 'refresh');
      component.updateChecked('zazu-id', true);
      expect(ZazuService.update).toHaveBeenCalledWith('zazu-id', 'checked', true);
      expect(component.refresh).toHaveBeenCalled();
    });
  });

  describe('updateLabel', () => {
    it('should not update label if key code is not 13', () => {
      component.updateLabel({which: 15}, 'zazu-id', 'label');
      expect(ZazuService.update).not.toHaveBeenCalled();
    });

    it('should update label if key code is 13 and set editing mode to false', () => {
      spyOn(component, 'refresh');
      component.updateLabel({which: 13}, 'zazu-id', 'zazu-label');
      expect(ZazuService.update).toHaveBeenCalledWith('zazu-id', 'label', 'zazu-label');
      expect(ZazuService.setEditing).toHaveBeenCalledWith(false);
      expect(component.refresh).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should not remove if zazu is undefined', () => {
      component.remove();
      expect(ZazuService.remove).not.toHaveBeenCalled();
    });

    it('should call remove from ZazuService, refresh, and reset selected', () => {
      spyOn(component, 'refresh');
      component.remove({id: 'zazu-id'});
      expect(ZazuService.remove).toHaveBeenCalledWith('zazu-id');
      expect(component.refresh).toHaveBeenCalled();
      expect(ZazuService.resetSelected).toHaveBeenCalled();
    });
  });

  describe('isSelected', () => {
    it('should call ZazuService isSelected with index 1 and return true', () => {
      expect(component.isSelected(1)).toEqual(true);
      expect(ZazuService.isSelected).toHaveBeenCalledWith(1);
    });

    it('should call ZazuService isSelected with index 0 and return false', () => {
      expect(component.isSelected(0)).toEqual(false);
      expect(ZazuService.isSelected).toHaveBeenCalledWith(0);
    });
  });

  describe('createNew', () => {
    it('should call setMode with "create" and true', () => {
      spyOn(component, 'setMode');
      component.createNew();
      expect(component.setMode).toHaveBeenCalledWith('create', true);
    });
  });

  describe('showOpen', () => {
    it('should call toggleOpen of zazu service and refresh', () => {
      spyOn(component, 'refresh');
      component.showOpen();
      expect(ZazuService.toggleOpen).toHaveBeenCalled();
      expect(component.refresh).toHaveBeenCalled();
    });
  });
});
