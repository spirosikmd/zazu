// import {ZazuService} from '../../services/zazu.service';
// import zazuApp from '../../app.component';
// import {Zazu} from '../../models/zazu.model';
//
// describe('component: zazu', () => {
//   let $componentController;
//   let $scope: angular.IScope;
//   let $window: angular.IWindowService;
//   let component;
//   let ZazuService: ZazuService;
//   let hotkeys: angular.hotkeys.HotkeysProvider;
//   let zazus: Zazu[];
//
//   beforeEach(angular.mock.module(zazuApp));
//
//   beforeEach(angular.mock.module(($provide) => {
//     const zazu = new Zazu();
//     zazu.id = 'zazu-id';
//     zazu.label = 'label';
//     zazu.checked = true;
//     zazus = [zazu];
//     $provide.service('ZazuService', function () {
//       this.get = jasmine.createSpy('get').and.callFake(function () {
//         return zazus;
//       });
//       this.getSelected = angular.noop;
//       this.create = jasmine.createSpy('create').and.callThrough();
//       this.update = jasmine.createSpy('update').and.callThrough();
//       this.setEditing = jasmine.createSpy('setEditing').and.callThrough();
//       this.remove = jasmine.createSpy('remove').and.callThrough();
//       this.resetSelected = jasmine.createSpy('resetSelected').and.callThrough();
//       this.isSelected = angular.noop;
//       this.isEditing = angular.noop;
//       this.isFirstTime = angular.noop;
//       this.setFirstTime = angular.noop;
//       this.toggleOpen = jasmine.createSpy('toggleOpen').and.callThrough();
//       this.previous = jasmine.createSpy('previous').and.callThrough();
//       this.next = jasmine.createSpy('next').and.callThrough();
//       this.moveUp = jasmine.createSpy('moveUp').and.callThrough();
//       this.moveDown = jasmine.createSpy('moveDown').and.callThrough();
//     });
//
//     $provide.service('hotkeys', function () {
//       this.toggleCheatSheet = angular.noop;
//       this.add = () => {
//         return this;
//       };
//       this.bindTo = () => {
//         return this;
//       };
//     });
//   }));
//
//   beforeEach(inject((_$componentController_, _$rootScope_, _ZazuService_, _hotkeys_, _$window_) => {
//     $componentController = _$componentController_;
//     $scope = _$rootScope_.$new();
//     $window = _$window_;
//     ZazuService = _ZazuService_;
//     hotkeys = _hotkeys_;
//   }));
//
//   beforeEach(() => {
//     component = $componentController('zazu', {
//       $scope: $scope,
//       $window: $window,
//       ZazuService: ZazuService,
//       hotkeys: hotkeys
//     });
//   });
//
//   afterAll(() => {
//     $componentController = null;
//     $scope = null;
//     $window = null;
//     component = null;
//     ZazuService = null;
//   });
//
//   it('should be defined', () => {
//     expect(component).toBeDefined();
//   });
//
//   describe('$onInit', () => {
//     it('should set the defaults', () => {
//       component.$onInit();
//       expect(component.defaultZazu).toEqual(new Zazu({
//         label: '',
//         checked: false
//       }));
//       expect(component.zazus).toEqual([new Zazu({id: 'zazu-id', label: 'label', checked: true})]);
//       expect(component.zazu).toEqual(new Zazu({label: '', checked: false}));
//       expect(component.defaultModes).toEqual({
//         create: false,
//         createUnderCurrent: false
//       });
//       expect(component.modes).toEqual({
//         create: false,
//         createUnderCurrent: false
//       });
//     });
//
//     it('should call the init methods', () => {
//       spyOn(component, 'refresh');
//       spyOn(component, 'reset');
//       spyOn(component, 'setupHotkeys');
//       spyOn(component, 'isFirstTime');
//       component.$onInit();
//       expect(component.refresh).toHaveBeenCalled();
//       expect(component.reset).toHaveBeenCalled();
//       expect(component.setupHotkeys).toHaveBeenCalled();
//       expect(component.isFirstTime).toHaveBeenCalled();
//     });
//   });
//
//   describe('refresh', () => {
//     it('should get ', () => {
//       component.$onInit();
//       let zazu = new Zazu({id: 'zazu-id', label: 'label', checked: true});
//       expect(component.zazus.length).toEqual(1);
//       component.refresh();
//       expect(ZazuService.get).toHaveBeenCalled();
//       expect(component.zazus.length).toEqual(1);
//       expect(component.zazus[0]).toEqual(zazu);
//     });
//   });
//
//   describe('reset', () => {
//     it('should copy the default zazu to current zazu', () => {
//       component.$onInit();
//       expect(component.zazu).toEqual(new Zazu({label: '', checked: false}));
//       component.zazu = new Zazu({label: 'label', checked: true});
//       component.reset();
//       expect(component.zazu).toEqual(new Zazu({label: '', checked: false}));
//     });
//   });
//
//   describe('create', () => {
//     it('should not create new zazu if label is length 0', () => {
//       component.create({label: '    ', checked: false});
//       expect(ZazuService.create).not.toHaveBeenCalled();
//     });
//
//     it('should create new zazu', () => {
//       let zazu = {label: 'label', checked: false};
//       spyOn(component, 'resetModes');
//       spyOn(component, 'refresh');
//       spyOn(component, 'reset');
//       spyOn(component, 'isInMode').and.returnValue(true);
//       component.create(zazu);
//       expect(component.isInMode).toHaveBeenCalledWith('createUnderCurrent');
//       expect(ZazuService.create).toHaveBeenCalledWith(zazu, true, true);
//       expect(component.refresh).toHaveBeenCalled();
//       expect(component.reset).toHaveBeenCalled();
//       expect(component.resetModes).toHaveBeenCalledWith();
//     });
//   });
//
//   describe('isInMode', () => {
//     beforeEach(() => {
//       component.$onInit();
//     });
//
//     it('should return false if it is not in mode "create" or "createUnderCurrent"', () => {
//       expect(component.isInMode('create')).toEqual(false);
//       expect(component.isInMode('createUnderCurrent')).toEqual(false);
//     });
//
//     it('should return true if it is in mode "create" or "createUnderCurrent"', () => {
//       component.modes.create = true;
//       expect(component.isInMode('create')).toEqual(true);
//
//       component.modes.createUnderCurrent = true;
//       expect(component.isInMode('createUnderCurrent')).toEqual(true);
//     });
//   });
//
//   describe('resetModes', () => {
//     beforeEach(() => {
//       component.$onInit();
//     });
//
//     it('should set modes to default', () => {
//       component.modes.create = true;
//       component.modes.createUnderCurrent = true;
//       component.resetModes();
//       expect(component.modes.create).toEqual(false);
//       expect(component.modes.createUnderCurrent).toEqual(false);
//     });
//   });
//
//   describe('toggleChecked', () => {
//     it('should toggle the checked property of the selected zazu', () => {
//       spyOn(component, 'refresh');
//       spyOn(ZazuService, 'getSelected').and.returnValue(zazus[0]);
//       component.toggleChecked();
//       expect(ZazuService.getSelected).toHaveBeenCalled();
//       expect(ZazuService.update).toHaveBeenCalledWith('zazu-id', 'checked', false);
//       expect(component.refresh).toHaveBeenCalled();
//     });
//
//     it('should not call update if selected is null', () => {
//       spyOn(ZazuService, 'getSelected').and.returnValue(null);
//       component.toggleChecked();
//       expect(ZazuService.update).not.toHaveBeenCalled();
//     });
//   });
//
//   describe('updateLabel', () => {
//     it('should not update label if key code is not 13', () => {
//       component.updateLabel({which: 15} as KeyboardEvent, 'zazu-id', 'label');
//       expect(ZazuService.update).not.toHaveBeenCalled();
//     });
//
//     it('should update label if key code is 13 and set editing mode to false', () => {
//       spyOn(component, 'refresh');
//       component.updateLabel({which: 13} as KeyboardEvent, 'zazu-id', 'zazu-label');
//       expect(ZazuService.update).toHaveBeenCalledWith('zazu-id', 'label', 'zazu-label');
//       expect(ZazuService.setEditing).toHaveBeenCalledWith(false);
//       expect(component.refresh).toHaveBeenCalled();
//     });
//   });
//
//   describe('remove', () => {
//     it('should not remove if zazu is undefined', () => {
//       component.remove();
//       expect(ZazuService.remove).not.toHaveBeenCalled();
//     });
//
//     it('should call remove from ZazuService, refresh, and reset selected', () => {
//       spyOn(component, 'refresh');
//       component.remove({id: 'zazu-id'});
//       expect(ZazuService.remove).toHaveBeenCalledWith('zazu-id', true);
//       expect(component.refresh).toHaveBeenCalled();
//       expect(ZazuService.resetSelected).toHaveBeenCalled();
//     });
//   });
//
//   describe('isSelected', () => {
//     it('should call ZazuService isSelected with index 1 and return true', () => {
//       spyOn(ZazuService, 'isSelected').and.returnValue(true);
//       expect(component.isSelected(1)).toEqual(true);
//       expect(ZazuService.isSelected).toHaveBeenCalledWith(1);
//     });
//
//     it('should call ZazuService isSelected with index 0 and return false', () => {
//       spyOn(ZazuService, 'isSelected').and.returnValue(false);
//       expect(component.isSelected(0)).toEqual(false);
//       expect(ZazuService.isSelected).toHaveBeenCalledWith(0);
//     });
//   });
//
//   describe('removeSelected', () => {
//     it('should get selected and call remove with it', () => {
//       spyOn(ZazuService, 'getSelected').and.returnValue(3);
//       spyOn(component, 'remove');
//       component.removeSelected();
//       expect(component.remove).toHaveBeenCalledWith(3);
//     });
//
//     it('should not call remove if selected does not exist', () => {
//       spyOn(ZazuService, 'getSelected').and.returnValue(null);
//       spyOn(component, 'remove');
//       component.removeSelected();
//       expect(component.remove).not.toHaveBeenCalled();
//     });
//   });
//
//   describe('createNew', () => {
//     it('should set createUnderCurrent to true and call ZazuService create with zazu, false and true, and refresh', () => {
//       spyOn(component, 'refresh');
//       component.$onInit();
//       component.createNew(true);
//       expect(component.modes.createUnderCurrent).toEqual(true);
//       expect(ZazuService.create).toHaveBeenCalledWith(new Zazu({
//         label: '',
//         checked: false,
//         id: 'temp',
//         temp: true
//       }), false, true);
//       expect(component.refresh).toHaveBeenCalled();
//     });
//
//     it('should set create to true and call ZazuService create with zazu, false and false, and refresh', () => {
//       spyOn(component, 'refresh');
//       component.$onInit();
//       component.createNew(false);
//       expect(component.modes.create).toEqual(true);
//       expect(ZazuService.create).toHaveBeenCalledWith(new Zazu({
//         label: '',
//         checked: false,
//         id: 'temp',
//         temp: true
//       }), false, false);
//       expect(component.refresh).toHaveBeenCalled();
//     });
//   });
//
//   describe('showOpen', () => {
//     it('should call toggleOpen of zazu service and refresh', () => {
//       spyOn(component, 'refresh');
//       component.showOpen();
//       expect(ZazuService.toggleOpen).toHaveBeenCalled();
//       expect(component.refresh).toHaveBeenCalled();
//     });
//   });
//
//   describe('edit', () => {
//     it('should call setEditing of zazu service with true if it is not in edit mode and refresh', () => {
//       spyOn(component, 'refresh');
//       component.edit();
//       expect(ZazuService.setEditing).toHaveBeenCalledWith(true);
//       expect(component.refresh).toHaveBeenCalled();
//     });
//
//     it('should call setEditing of zazu service with false if is in edit mode and refresh', () => {
//       spyOn(component, 'refresh');
//       spyOn(ZazuService, 'isEditing').and.returnValue(true);
//       component.edit();
//       expect(ZazuService.setEditing).toHaveBeenCalledWith(false);
//       expect(component.refresh).toHaveBeenCalled();
//     });
//   });
//
//   describe('selectPrevious', () => {
//     it('should prevent default event, call previous of zazu service, and set lastHotkey to 38', () => {
//       let event = {
//         preventDefault: angular.noop,
//         which: 38
//       } as KeyboardEvent;
//       spyOn(event, 'preventDefault');
//       component.selectPrevious(event);
//       expect(ZazuService.previous).toHaveBeenCalled();
//       expect(event.preventDefault).toHaveBeenCalled();
//       expect(component.lastHotkey).toEqual(38);
//     });
//   });
//
//   describe('selectNext', () => {
//     let event;
//
//     beforeEach(() => {
//       event = {
//         preventDefault: function () {
//         },
//         which: 40
//       };
//     });
//
//     afterAll(() => {
//       event = null;
//     });
//
//     it('should prevent default event, call next of zazu service, and set lastHotkey to 40', () => {
//       spyOn(event, 'preventDefault');
//       component.selectNext(event);
//       expect(ZazuService.next).toHaveBeenCalled();
//       expect(event.preventDefault).toHaveBeenCalled();
//       expect(component.lastHotkey).toEqual(40);
//     });
//
//     it('should not call scrollTo if selected is not index 0', () => {
//       spyOn(ZazuService, 'isSelected').and.returnValue(false);
//       spyOn(component, 'scrollTo');
//       component.selectNext(event);
//       expect(ZazuService.isSelected).toHaveBeenCalledWith(0);
//       expect(component.scrollTo).not.toHaveBeenCalled();
//     });
//
//     it('should call scrollTo with 0 if selected is index 0', () => {
//       spyOn(ZazuService, 'isSelected').and.returnValue(true);
//       spyOn(component, 'scrollTo');
//       component.selectNext(event);
//       expect(ZazuService.isSelected).toHaveBeenCalledWith(0);
//       expect(component.scrollTo).toHaveBeenCalledWith(0);
//     });
//   });
//
//   describe('isFirstTime', () => {
//     beforeEach(() => {
//       spyOn(ZazuService, 'setFirstTime');
//       spyOn(hotkeys, 'toggleCheatSheet');
//     });
//
//     it('should not toggle cheatsheet if not first time', () => {
//       spyOn(ZazuService, 'isFirstTime').and.returnValue(false);
//       component.isFirstTime();
//       // expect(hotkeys.toggleCheatSheet).not.toHaveBeenCalled();
//       expect(ZazuService.setFirstTime).not.toHaveBeenCalled();
//     });
//
//     it('should toggle the cheatsheet and call ZazuService setFirstTime if first time', () => {
//       spyOn(ZazuService, 'isFirstTime').and.returnValue(true);
//       component.isFirstTime();
//       // expect(hotkeys.toggleCheatSheet).toHaveBeenCalled();
//       expect(ZazuService.setFirstTime).toHaveBeenCalled();
//     });
//   });
//
//   describe('moveUp', () => {
//     it('should call zazu service moveUp and refresh', () => {
//       spyOn(component, 'refresh');
//       component.moveUp();
//       expect(ZazuService.moveUp).toHaveBeenCalled();
//       expect(component.refresh).toHaveBeenCalled();
//     });
//   });
//
//   describe('moveDown', () => {
//     it('should call zazu service moveDown and refresh', () => {
//       spyOn(component, 'refresh');
//       component.moveDown();
//       expect(ZazuService.moveDown).toHaveBeenCalled();
//       expect(component.refresh).toHaveBeenCalled();
//     });
//   });
//
//   describe('scroll', () => {
//     it('should get scroll handler using the last hotkey used and call it with offset', () => {
//       component.$onInit();
//       component.scrollTo = angular.noop;
//       spyOn(component, 'scrollTo');
//       component.scrollHandlers[38] = component.scrollTo;
//       component.lastHotkey = 38;
//       component.scroll(10);
//       expect(component.scrollTo).toHaveBeenCalledWith(10);
//     });
//   });
//
//   describe('scrollTo', () => {
//     it('should call $window scrollTo with 0 and offset - 5', () => {
//       spyOn($window, 'scrollTo');
//       component.scrollTo(20);
//       expect($window.scrollTo).toHaveBeenCalledWith(0, 15);
//     });
//   });
//
//   describe('scrollBy', () => {
//     it('should call $window scrollBy with 0 nad 25', () => {
//       spyOn($window, 'scrollBy');
//       component.scrollBy();
//       expect($window.scrollBy).toHaveBeenCalledWith(0, 25);
//     });
//   });
//
//   describe('cancel', () => {
//     let event;
//
//     beforeEach(() => {
//       component.$onInit();
//       event = {
//         preventDefault: angular.noop,
//         which: 38
//       };
//     });
//
//     afterAll(() => {
//       event = null;
//     });
//
//     it('should prevent default event', () => {
//       spyOn(event, 'preventDefault');
//       component.$onInit();
//       component.cancel(event);
//     });
//
//     it('should call ZazuService remove with "temp", false, true if in createUnderCurrent mode and reset modes', () => {
//       component.modes.createUnderCurrent = true;
//       spyOn(component, 'resetModes');
//       component.cancel(event);
//       expect(ZazuService.remove).toHaveBeenCalledWith('temp', false, true);
//       expect(component.resetModes).toHaveBeenCalled();
//     });
//
//     it('should call ZazuService remove with "temp", false, false if in create mode and reset modes', () => {
//       component.modes.create = true;
//       spyOn(component, 'resetModes');
//       component.cancel(event);
//       expect(ZazuService.remove).toHaveBeenCalledWith('temp', false, false);
//       expect(component.resetModes).toHaveBeenCalled();
//     });
//
//     it('should set ZazuService editing to false if editing and call refresh', () => {
//       spyOn(component, 'refresh');
//       spyOn(ZazuService, 'isEditing').and.returnValue(true);
//       component.cancel(event);
//       expect(ZazuService.setEditing).toHaveBeenCalledWith(false);
//       expect(component.refresh).toHaveBeenCalled();
//     });
//   });
// });
