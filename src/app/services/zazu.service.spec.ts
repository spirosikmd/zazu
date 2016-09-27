import {ZazuService} from './zazu.service';
import {Zazu} from '../models/Zazu';
import {FlagService} from './flag.service';
import {StorageService} from './storage.service';
import {ConfigService} from './config.service';
require('angular-mocks');
const angular = require('angular');

describe('service: ZazuService', () => {
  let service: ZazuService;
  let storageService: StorageService;
  let zazus: Zazu[];
  let configService: ConfigService;
  let flagService: FlagService;

  beforeEach(() => {
    configService = new ConfigService();
    storageService = new StorageService(configService);
    spyOn(storageService, 'get').and.callFake(() => {
      return zazus;
    });
    spyOn(storageService, 'create');
    spyOn(storageService, 'update');
    spyOn(storageService, 'remove');
    spyOn(storageService, 'swap');

    flagService = new FlagService(configService);

    service = new ZazuService(storageService, flagService);
    zazus = [
      new Zazu({id: 'zazu-id', label: 'label', checked: true}),
      new Zazu({id: 'another-zazu-id', label: 'another label', checked: false}),
      new Zazu({id: 'yet-another-zazu-id', label: 'yet another label', checked: true})
    ];
  });

  afterEach(() => {
    service = null;
    storageService = null;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set the right defaults', () => {
    expect(service.open).toEqual(true);
    expect(service.selected).toEqual(0);
    expect(service.zazus).toEqual(zazus);
    expect(service.filtered).toEqual(zazus);
  });

  describe('refresh', () => {
    it('should set zazus from storage', () => {
      expect(storageService.get).toHaveBeenCalled();
      expect(service.zazus).toEqual(zazus);
    });
  });

  describe('get', () => {
    it('should return a copy of filtered zazus with checked false', () => {
      const filteredZazus = service.get();
      expect(filteredZazus[0].id).toEqual('another-zazu-id');
      expect(filteredZazus[0].checked).toEqual(false);
    });
  });

  describe('create', () => {
    it('should temporary add the zazu to array under current and not call storage create', () => {
      let zazu = new Zazu({label: 'another-label', checked: false});
      service.create(zazu, false, true);
      expect(service.selected).toEqual(0);
      expect(service.zazus[1]).toEqual(zazu);
      expect(storageService.create).not.toHaveBeenCalledWith();
    });

    it('should temporary add the zazu at the end of the array and not call storage create', () => {
      let zazu = new Zazu({label: 'another-label', checked: false});
      service.create(zazu, false, false);
      expect(service.selected).toEqual(0);
      expect(service.zazus[3]).toEqual(zazu);
      expect(storageService.create).not.toHaveBeenCalledWith();
    });

    it('should persist zazu in storage in position under current and refresh', () => {
      let zazu = new Zazu({label: 'another-label', checked: false, id: 'temp', temp: true});
      spyOn(service, 'refresh');
      service.create(zazu, true, true);
      expect(storageService.create).toHaveBeenCalledWith(new Zazu({
        label: 'another-label',
        checked: false,
        id: 'temp',
        temp: false
      }), 1);
      expect(service.refresh).toHaveBeenCalled();
    });

    it('should persist zazu in storage in last position and refresh', () => {
      let zazu = new Zazu({label: 'another-label', checked: false, id: 'temp', temp: true});
      spyOn(service, 'refresh');
      service.create(zazu, true, false);
      expect(storageService.create).toHaveBeenCalledWith(new Zazu({
        label: 'another-label',
        checked: false,
        id: 'temp',
        temp: false
      }), 4);
      expect(service.refresh).toHaveBeenCalled();
    });

    it('should leave zazus array as is if selected is not found', () => {
      spyOn(service, 'getSelectedIndex').and.returnValue(-1);
      service.create(new Zazu(), true, false);
      expect(service.zazus).toEqual(zazus);
    });
  });

  describe('update', () => {
    it('should update zazu with id in storage and refresh', () => {
      spyOn(service, 'refresh');
      service.update('zazu-id', 'checked', true);
      expect(storageService.update).toHaveBeenCalledWith('zazu-id', 'checked', true);
      expect(service.refresh).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should call storage remove with id and refresh', () => {
      spyOn(service, 'refresh');
      service.remove('zazu-id', true);
      expect(storageService.remove).toHaveBeenCalledWith('zazu-id');
      expect(service.refresh).toHaveBeenCalled();
    });

    it('should remove from temp array under current and not call storage remove', () => {
      service.remove('zazu-id', false, true);
      expect(service.zazus).toEqual([
        new Zazu({id: 'zazu-id', label: 'label', checked: true}),
        new Zazu({id: 'yet-another-zazu-id', label: 'yet another label', checked: true})
      ]);
      expect(storageService.remove).not.toHaveBeenCalled();
    });

    it('should remove from temp array at the end and not call storage remove', () => {
      service.remove('zazu-id', false, false);
      expect(service.zazus).toEqual([
        new Zazu({id: 'zazu-id', label: 'label', checked: true}),
        new Zazu({id: 'another-zazu-id', label: 'another label', checked: false})
      ]);
      expect(storageService.remove).not.toHaveBeenCalled();
    });

    it('should leave zazus array as is if selected is not found', () => {
      spyOn(service, 'getSelectedIndex').and.returnValue(-1);
      service.remove('temp', false, false);
      expect(service.zazus).toEqual(zazus);
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
      service.next();
      expect(service.selected).toEqual(0);
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
      service.open = false;
      expect(service.isOpen(zazus[0])).toEqual(true);
    });

    it('should return true if open flag is true and zazu checked is false', () => {
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
      expect(service.open).toEqual(false);
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

    it('should call unshift with 2 if selected is last one and call next', () => {
      spyOn(service, 'unshift');
      spyOn(service, 'next');
      service.selected = 2;
      service.moveDown();
      expect(service.unshift).toHaveBeenCalledWith(2);
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

    it('should call push with 0 if selected is first one and call previous', () => {
      spyOn(service, 'push');
      spyOn(service, 'previous');
      service.selected = 0;
      service.moveUp();
      expect(service.push).toHaveBeenCalledWith(0);
      expect(service.previous).toHaveBeenCalled();
    });
  });

  describe('swap', () => {
    it('should not call refresh or storage swap if firstIndex equals secondIndex', () => {
      spyOn(service, 'refresh');
      service.swap(0, 0);
      expect(storageService.swap).not.toHaveBeenCalled();
      expect(service.refresh).not.toHaveBeenCalled();
    });

    it('should not call refresh or storage swap if zazu with firstIndex does not exist', () => {
      spyOn(service, 'refresh');
      service.swap(100, 1);
      expect(storageService.swap).not.toHaveBeenCalled();
      expect(service.refresh).not.toHaveBeenCalled();
    });

    it('should not call refresh or storage swap if zazu with secondIndex does not exist', () => {
      spyOn(service, 'refresh');
      service.swap(0, 100);
      expect(storageService.swap).not.toHaveBeenCalled();
      expect(service.refresh).not.toHaveBeenCalled();
    });

    it('should call storage swap with firstId and secondId and then refresh', () => {
      spyOn(service, 'refresh');
      service.swap(0, 1);
      expect(storageService.swap).toHaveBeenCalledWith('zazu-id', 'another-zazu-id');
      expect(service.refresh).toHaveBeenCalled();
    });
  });

  describe('unshift', () => {
    it('should not call storage unshift if zazu does not exist', () => {
      spyOn(storageService, 'unshift');
      service.unshift(5);
      expect(storageService.unshift).not.toHaveBeenCalled();
    });

    it('should call storage unshift with "yet-another-zazu-id" and refresh', () => {
      spyOn(storageService, 'unshift');
      spyOn(service, 'refresh');
      service.unshift(2);
      expect(storageService.unshift).toHaveBeenCalledWith('yet-another-zazu-id');
      expect(service.refresh).toHaveBeenCalled();
    });
  });

  describe('push', () => {
    it('should not call storage push if zazu does not exist', () => {
      spyOn(storageService, 'push');
      service.push(5);
      expect(storageService.push).not.toHaveBeenCalled();
    });

    it('should call storage push with "zazu-id" and refresh', () => {
      spyOn(storageService, 'push');
      spyOn(service, 'refresh');
      service.push(0);
      expect(storageService.push).toHaveBeenCalledWith('zazu-id');
      expect(service.refresh).toHaveBeenCalled();
    });
  });

  describe('getSelectedIndex', () => {
    it('should call find with selected id', () => {
      service.selected = 1;
      spyOn(service, 'find');
      service.getSelectedIndex();
      expect(service.find).toHaveBeenCalledWith('another-zazu-id');
    });
  });

  describe('find', () => {
    it('should return -1 if zazu with id does not exist', () => {
      expect(service.find('non-existing-zazu-id')).toEqual(-1);
    });

    it('should return index of zazu with existing id', () => {
      expect(service.find('yet-another-zazu-id')).toEqual(2);
    });
  });
});
