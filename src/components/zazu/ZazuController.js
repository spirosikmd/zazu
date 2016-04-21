const angular = require('angular');

export class ZazuController {

  // @ngInject
  constructor ($scope, $window, ZazuService, hotkeys) {
    this.$scope = $scope;
    this.$window = $window;
    this.ZazuService = ZazuService;
    this.hotkeys = hotkeys;
  }

  $onInit () {
    this.defaultZazu = {
      label: '',
      checked: false
    };
    this.zazus = [];
    this.zazu = null;
    this.defaultModes = {
      create: false,
      createUnderCurrent: false
    };
    this.modes = angular.copy(this.defaultModes);
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
    this.zazu = angular.copy(this.defaultZazu);
  };

  /**
   * Create new zazu.
   * @param zazu The zazu to create.
   */
  create (zazu) {
    if (zazu.label.trim().length === 0) {
      return;
    }

    this.ZazuService.create(angular.copy(zazu), true, this.isInMode('createUnderCurrent'));
    this.resetModes();

    this.refresh();
    this.reset();
  };

  /**
   * Check if is in provided mode.
   * @param {string} mode
   * @returns {boolean}
   */
  isInMode (mode) {
    return this.modes[mode];
  }

  /**
   * Reset the modes.
   */
  resetModes () {
    this.modes = angular.copy(this.defaultModes);
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
   * @param $event The ng-keypress event
   * @param {string} id The zazu id.
   * @param {string} label The zazu label.
   */
  updateLabel ($event, id, label) {
    if ($event.which !== 13) {
      return;
    }
    this.ZazuService.update(id, 'label', label);
    this.ZazuService.setEditing(false);
    this.refresh();
  }

  /**
   * Remove the specified zazu and refresh the list.
   * @param zazu The zazu to remove.
   */
  remove (zazu) {
    if (!zazu) {
      return;
    }
    this.ZazuService.remove(zazu.id, true);
    this.refresh();
    this.ZazuService.resetSelected();
  }

  /**
   * Determine if zazu with specified index is selected.
   * @param {number} index The index of zazu in the list.
   * @returns {boolean} True if zazu with specified index is selected.
   */
  isSelected (index) {
    return this.ZazuService.isSelected(index);
  }

  /**
   * Create new hotkey handler.
   * Set create mode to true.
   */
  createNew (current) {
    let mode = current ? 'createUnderCurrent' : 'create';
    this.modes[mode] = true;

    this.zazu.id = 'temp';
    this.zazu.temp = true;

    this.ZazuService.create(angular.copy(this.zazu), false, current);

    this.refresh();
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
  selectPrevious (event) {
    this.lastHotkey = event.which;
    event.preventDefault();
    this.ZazuService.previous();
  }

  /**
   * Select next zazu.
   * @param {KeyboardEvent} event
   */
  selectNext (event) {
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
  scroll (offset) {
    this.scrollHandlers[this.lastHotkey](offset);
  }

  /**
   * Scroll to offset with a 5 pixel margin as well.
   * @param {number} offset
   */
  scrollTo (offset) {
    this.$window.scrollTo(0, offset - 5);
  }

  /**
   * Scroll by 25 pixels.
   */
  scrollBy () {
    this.$window.scrollBy(0, 25);
  }

  /**
   * Determine if application opened for the first time and show the
   * hotkey cheatsheet. Set the firstTime flag to true so cheatsheet
   * won't be shown again.
   */
  isFirstTime () {
    const firstTime = this.ZazuService.isFirstTime();
    if (firstTime) {
      this.hotkeys.toggleCheatSheet();
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
  cancel (event) {
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
    this.hotkeys.bindTo(this.$scope)
      .add({
        combo: 'mod+n',
        description: 'Create new zazu',
        callback: this.createNew.bind(this, false)
      })
      .add({
        combo: 'mod+shift+n',
        description: 'Create new zazu under current position',
        callback: this.createNew.bind(this, true)
      })
      .add({
        combo: 'esc',
        description: 'Cancel edit or create new zazu',
        allowIn: ['INPUT'],
        callback: this.cancel.bind(this)
      })
      .add({
        combo: 'down',
        description: 'Select next zazu',
        callback: this.selectNext.bind(this)
      })
      .add({
        combo: 'up',
        description: 'Select previous zazu',
        callback: this.selectPrevious.bind(this)
      })
      .add({
        combo: 'mod+backspace',
        description: 'Remove zazu',
        callback: () => {
          var selected = this.ZazuService.getSelected();
          if (!selected) {
            return;
          }
          this.remove(selected);
        }
      })
      .add({
        combo: 'mod+enter',
        description: 'Toggle check status of zazu',
        callback: this.toggleChecked.bind(this)
      })
      .add({
        combo: 'mod+shift+enter',
        description: 'Edit zazu',
        allowIn: ['INPUT'],
        callback: this.edit.bind(this)
      })
      .add({
        combo: 'mod+o',
        description: 'Toggle show only open zazus',
        callback: this.showOpen.bind(this)
      })
      .add({
        combo: 'mod+shift+up',
        description: 'Move zazu one position up',
        callback: this.moveUp.bind(this)
      })
      .add({
        combo: 'mod+shift+down',
        description: 'Move zazu one position down',
        callback: this.moveDown.bind(this)
      });
  }
}
