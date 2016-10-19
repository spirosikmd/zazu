import {Component, OnInit} from '@angular/core';
import {ZazuService} from '../../services/zazu.service';
import {Zazu} from '../../models/zazu.model';
import {HotkeysService} from 'angular2-hotkeys';
import {Hotkey} from 'angular2-hotkeys';

const _clone = require('lodash/clone');

@Component({
  selector: 'zazu',
  templateUrl: './zazu.html'
})
export class ZazuComponent implements OnInit {
  defaultZazu: Zazu;
  zazus: Zazu[];
  zazu: Zazu;
  defaultModes: {
    create: boolean;
    createUnderCurrent: boolean;
  };
  modes: {
    create: boolean;
    createUnderCurrent: boolean;
  };
  scrollHandlers: {[handler: number]: Function};
  lastHotkey: number;

  constructor (
    private ZazuService: ZazuService,
    private hotkeysService: HotkeysService
  ) {
  }

  ngOnInit (): void {
    this.defaultZazu = new Zazu({
      label: '',
      checked: false
    });
    this.zazus = [];
    this.zazu = null;
    this.defaultModes = {
      create: false,
      createUnderCurrent: false
    };
    this.modes = Object.assign({}, this.defaultModes);
    this.scrollHandlers = {
      38: this.scrollTo.bind(this),
      40: this.scrollBy.bind(this)
    };

    this.refresh();
    this.reset();
    this.setupHotkeys();
    this.isFirstTime();
  }

  /**
   * Refresh the zazu list.
   */
  refresh () {
    this.zazus = this.ZazuService.get();
  };

  /**
   * Reset the new model zazu to default.
   */
  reset () {
    this.zazu = _clone(this.defaultZazu);
  };

  /**
   * Create new zazu.
   * @param {Zazu} zazu The zazu to create.
   */
  create (zazu: Zazu) {
    if (zazu.label.trim().length === 0) {
      return;
    }

    this.ZazuService.create(_clone(zazu), true, this.isInMode('createUnderCurrent'));
    this.resetModes();

    this.refresh();
    this.reset();
  };

  /**
   * Check if is in provided mode.
   * @param {string} mode
   * @returns {boolean}
   */
  isInMode (mode: string): boolean {
    return this.modes[mode];
  }

  /**
   * Reset the modes.
   */
  resetModes () {
    this.modes = Object.assign({}, this.defaultModes);
  }

  /**
   * Toggle the checked attribute of the selected zazu.
   */
  toggleChecked () {
    var selected = this.ZazuService.getSelected();
    if (!selected) {
      return;
    }
    this.ZazuService.update(selected.id, 'checked', !selected.checked);
    this.refresh();
  };

  /**
   * Update the label attribute of zazu with the specified id in case key press is "enter",
   * and set editing mode to false.
   */
  updateLabel ($event: {id: string, label: string, keyCode: number}) {
    if ($event.keyCode !== 13) {
      return;
    }
    this.ZazuService.update($event.id, 'label', $event.label);
    this.ZazuService.setEditing(false);
    this.refresh();
  }

  /**
   * Remove the specified zazu and refresh the list.
   * @param {Zazu} zazu The zazu to remove.
   */
  remove (zazu: Zazu) {
    if (!zazu) {
      return;
    }
    let isLastToDelete = this.ZazuService.isLastSelected();
    this.ZazuService.remove(zazu.id, true);
    this.refresh();
    // If the last one is selected select the previous one
    if (isLastToDelete) {
      this.ZazuService.previous();
    }
  }

  /**
   * Remove the selected zazu.
   */
  removeSelected () {
    var selected = this.ZazuService.getSelected();
    if (!selected) {
      return;
    }
    this.remove(selected);
  }

  /**
   * Determine if zazu with specified index is selected.
   * @param {number} index The index of zazu in the list.
   * @returns {boolean} True if zazu with specified index is selected.
   */
  isSelected (index: number): boolean {
    return this.ZazuService.isSelected(index);
  }

  /**
   * Create new hotkey handler.
   * Set create mode to true.
   * @param {boolean} current
   */
  createNew (current: boolean) {
    let mode = current ? 'createUnderCurrent' : 'create';

    // If we already creating a new zazu do not create another temp zazu
    if (this.isCreatingNew()) {
      return;
    }

    this.modes[mode] = true;

    this.zazu.id = 'temp';
    this.zazu.temp = true;

    this.ZazuService.create(Object.assign({}, this.zazu), false, current);

    this.refresh();
  }

  isCreatingNew (): boolean {
    return this.modes.createUnderCurrent || this.modes.create;
  }

  /**
   * Toggle the open mode of zazu service and refresh the list of zazus.
   */
  showOpen () {
    this.ZazuService.toggleOpen();
    this.refresh();
  }

  /**
   * Change the edit mode of selected zazu and refresh.
   */
  edit () {
    if (this.ZazuService.isEditing()) {
      this.ZazuService.setEditing(false);
    } else {
      this.ZazuService.setEditing(true);
    }
    this.refresh();
  }

  /**
   * Select previous zazu.
   * @param {KeyboardEvent} event
   */
  selectPrevious (event: KeyboardEvent) {
    this.lastHotkey = event.which;
    event.preventDefault();
    this.ZazuService.previous();
  }

  /**
   * Select next zazu.
   * @param {KeyboardEvent} event
   */
  selectNext (event: KeyboardEvent) {
    this.lastHotkey = event.which;
    event.preventDefault();
    this.ZazuService.next();
    if (this.ZazuService.isSelected(0)) {
      this.scrollTo(0);
    }
  }

  /**
   * Determine scroll handler and execute it with offset.
   * @param {number} offset
   */
  scroll (offset: number) {
    this.scrollHandlers[this.lastHotkey](offset);
  }

  /**
   * Scroll to offset with a 5 pixel margin as well.
   * @param {number} offset
   */
  scrollTo (offset: number) {
    window.scrollTo(0, offset - 5);
  }

  /**
   * Scroll by 25 pixels.
   */
  scrollBy () {
    window.scrollBy(0, 25);
  }

  /**
   * Determine if application opened for the first time and show the
   * hotkey cheatsheet. Set the firstTime flag to true so cheatsheet
   * won't be shown again.
   */
  isFirstTime () {
    const firstTime = this.ZazuService.isFirstTime();
    if (firstTime) {
      // this.hotkeys.toggleCheatSheet();
      this.ZazuService.setFirstTime();
    }
  }

  /**
   * Move selected zazu one position up.
   */
  moveUp () {
    this.ZazuService.moveUp();
    this.refresh();
  }

  /**
   * Move selected zazu one position down.
   */
  moveDown () {
    this.ZazuService.moveDown();
    this.refresh();
  }

  /**
   * Cancel either editing or creating new zazu.
   * @param {KeyboardEvent} event
   */
  cancel (event: KeyboardEvent) {
    event.preventDefault();

    // In create new mode
    let underCurrentMode = this.isInMode('createUnderCurrent');
    if (this.isInMode('create') || underCurrentMode) {
      this.ZazuService.remove('temp', false, underCurrentMode);
      this.resetModes();
    }

    // In edit mode
    if (this.ZazuService.isEditing()) {
      this.ZazuService.setEditing(false);
    }

    this.refresh();
  }

  /**
   * Setup the hotkeys.
   */
  setupHotkeys () {
    this.hotkeysService.add(new Hotkey('mod+n', this.createNew.bind(this, false)));
    this.hotkeysService.add(new Hotkey('mod+shift+n', this.createNew.bind(this, true)));
    this.hotkeysService.add(new Hotkey('esc', this.cancel.bind(this), ['INPUT']));
    this.hotkeysService.add(new Hotkey('down', this.selectNext.bind(this)));
    this.hotkeysService.add(new Hotkey('up', this.selectPrevious.bind(this)));
    this.hotkeysService.add(new Hotkey('mod+backspace', this.removeSelected.bind(this)));
    this.hotkeysService.add(new Hotkey('mod+enter', this.toggleChecked.bind(this)));
    this.hotkeysService.add(new Hotkey('mod+shift+enter', this.edit.bind(this)));
    this.hotkeysService.add(new Hotkey('mod+o', this.showOpen.bind(this)));
    this.hotkeysService.add(new Hotkey('mod+shift+up', this.moveUp.bind(this)));
    this.hotkeysService.add(new Hotkey('mod+shift+down', this.moveDown.bind(this)));
  }
}
