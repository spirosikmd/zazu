require('angular-mocks');

import zazuApp from '../../index';

describe('component: zazu', () => {
  let $componentController;
  let $scope;
  let component;
  let ZazuService;
  let hotkeys;
  let zazus = [{id: 'zazu-id', label: 'label', checked: true}];

  beforeEach(angular.mock.module(zazuApp));

  beforeEach(angular.mock.module(($provide) => {
    $provide.service('ZazuService', function () {
      this.editing = false;
      this.get = jasmine.createSpy('get').and.callFake(function () {
        return zazus;
      });
      this.getSelected = jasmine.createSpy('getSelected').and.callFake(function () {
        return zazus[0];
      });
      this.create = jasmine.createSpy('create').and.callThrough();
      this.update = jasmine.createSpy('update').and.callThrough();
      this.setEditing = jasmine.createSpy('setEditing').and.callThrough();
      this.remove = jasmine.createSpy('remove').and.callThrough();
      this.resetSelected = jasmine.createSpy('resetSelected').and.callThrough();
      this.isSelected = angular.noop;
      this.isFirstTime = angular.noop;
      this.setFirstTime = angular.noop;
      this.toggleOpen = jasmine.createSpy('toggleOpen').and.callThrough();
      this.isEditing = jasmine.createSpy('isEditing').and.callFake(() => {
        return this.editing;
      });
      this.previous = jasmine.createSpy('previous').and.callThrough();
      this.next = jasmine.createSpy('next').and.callThrough();
      this.moveUp = jasmine.createSpy('moveUp').and.callThrough();
      this.moveDown = jasmine.createSpy('moveDown').and.callThrough();
    });

    $provide.service('hotkeys', function () {
      this.toggleCheatSheet = angular.noop;
      this.add = () => {
        return this;
      };
      this.bindTo = () => {
        return this;
      };
    });
  }));

  beforeEach(inject((_$componentController_, _$rootScope_, _ZazuService_, _hotkeys_) => {
    $componentController = _$componentController_;
    $scope = _$rootScope_.$new();
    ZazuService = _ZazuService_;
    hotkeys = _hotkeys_;
  }));

  beforeEach(() => {
    component = $componentController('zazu', {
      $scope: $scope,
      ZazuService: ZazuService,
      hotkeys: hotkeys
    });
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
    expect(component.zazus).toEqual([{id: 'zazu-id', label: 'label', checked: true}]);
    expect(component.zazu).toEqual({label: '', checked: false});
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
      let zazu = {id: 'zazu-id', label: 'label', checked: true};
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

  describe('toggleChecked', () => {
    it('should toggle the checked property of the selected zazu', () => {
      spyOn(component, 'refresh');
      component.toggleChecked();
      expect(ZazuService.getSelected).toHaveBeenCalled();
      expect(ZazuService.update).toHaveBeenCalledWith('zazu-id', 'checked', false);
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
      spyOn(ZazuService, 'isSelected').and.returnValue(true);
      expect(component.isSelected(1)).toEqual(true);
      expect(ZazuService.isSelected).toHaveBeenCalledWith(1);
    });

    it('should call ZazuService isSelected with index 0 and return false', () => {
      spyOn(ZazuService, 'isSelected').and.returnValue(false);
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

  describe('edit', () => {
    it('should call setEditing of zazu service with true if it is not in edit mode and refresh', () => {
      spyOn(component, 'refresh');
      component.edit();
      expect(ZazuService.setEditing).toHaveBeenCalledWith(true);
      expect(component.refresh).toHaveBeenCalled();
    });

    it('should call setEditing of zazu service with false if is in edit mode and refresh', () => {
      ZazuService.editing = true;
      spyOn(component, 'refresh');
      component.edit();
      expect(ZazuService.setEditing).toHaveBeenCalledWith(false);
      expect(component.refresh).toHaveBeenCalled();
    });
  });

  describe('selectPrevious', () => {
    it('should prevent default event, call previous of zazu service, and set lastHotkey to 38', () => {
      let event = {
        preventDefault: function () {},
        which: 38
      };
      spyOn(event, 'preventDefault');
      component.selectPrevious(event);
      expect(ZazuService.previous).toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.lastHotkey).toEqual(38);
    });
  });

  describe('selectNext', () => {
    let event;

    beforeEach(() => {
      event = {
        preventDefault: function () {},
        which: 40
      };
    });

    afterEach(() => {
      event = null;
    });

    it('should prevent default event, call next of zazu service, and set lastHotkey to 40', () => {
      spyOn(event, 'preventDefault');
      component.selectNext(event);
      expect(ZazuService.next).toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.lastHotkey).toEqual(40);
    });

    it('should not call scrollTo if selected is not index 0', () => {
      spyOn(ZazuService, 'isSelected').and.returnValue(false);
      spyOn(component, 'scrollTo');
      component.selectNext(event);
      expect(ZazuService.isSelected).toHaveBeenCalledWith(0);
      expect(component.scrollTo).not.toHaveBeenCalled();
    });

    it('should call scrollTo with 0 if selected is index 0', () => {
      spyOn(ZazuService, 'isSelected').and.returnValue(true);
      spyOn(component, 'scrollTo');
      component.selectNext(event);
      expect(ZazuService.isSelected).toHaveBeenCalledWith(0);
      expect(component.scrollTo).toHaveBeenCalledWith(0);
    });
  });

  describe('isFirstTime', () => {
    beforeEach(() => {
      spyOn(ZazuService, 'setFirstTime');
      spyOn(hotkeys, 'toggleCheatSheet');
    });

    it('should not toggle cheatsheet if not first time', () => {
      spyOn(ZazuService, 'isFirstTime').and.returnValue(false);
      component.isFirstTime();
      expect(hotkeys.toggleCheatSheet).not.toHaveBeenCalled();
      expect(ZazuService.setFirstTime).not.toHaveBeenCalled();
    });

    it('should toggle the cheatsheet and call ZazuService setFirstTime if first time', () => {
      spyOn(ZazuService, 'isFirstTime').and.returnValue(true);
      component.isFirstTime();
      expect(hotkeys.toggleCheatSheet).toHaveBeenCalled();
      expect(ZazuService.setFirstTime).toHaveBeenCalled();
    });
  });

  describe('moveUp', () => {
    it('should call zazu service moveUp and refresh', () => {
      spyOn(component, 'refresh');
      component.moveUp();
      expect(ZazuService.moveUp).toHaveBeenCalled();
      expect(component.refresh).toHaveBeenCalled();
    });
  });

  describe('moveDown', () => {
    it('should call zazu service moveDown and refresh', () => {
      spyOn(component, 'refresh');
      component.moveDown();
      expect(ZazuService.moveDown).toHaveBeenCalled();
      expect(component.refresh).toHaveBeenCalled();
    });
  });
});