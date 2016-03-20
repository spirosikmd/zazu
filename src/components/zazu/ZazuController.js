export class ZazuController {

  // @ngInject
  constructor ($scope, ZazuService, hotkeys) {
    this.$scope = $scope;
    this.ZazuService = ZazuService;
    this.hotkeys = hotkeys;

    this.defaultZazu = {
      label: '',
      checked: false
    };
    this.zazus = [];
    this.zazu = null;
    this.modes = {
      create: false
    };
    this.editing = null;

    this.refresh();
    this.reset();
    this.setupHotkeys();
  }

  /**
   * Set the app mode to the specified state.
   * @param {string} mode The mode.
   * @param {boolean} state The state.
   */
  setMode (mode, state) {
    this.modes[mode] = state;
  };

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
    this.ZazuService.create(angular.copy(zazu));
    this.setMode('create', false);
    this.refresh();
    this.reset();
  };

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
    this.ZazuService.remove(zazu.id);
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
  createNew () {
    this.setMode('create', true);
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
   * Setup the hotkeys.
   */
  setupHotkeys () {
    this.hotkeys.bindTo(this.$scope)
      .add({
        combo: 'mod+n',
        description: 'Create new zazu',
        callback: this.createNew.bind(this)
      })
      .add({
        combo: 'esc',
        description: 'Cancel edit or create new zazu',
        allowIn: ['INPUT'],
        callback: (event) => {
          event.preventDefault();
          this.setMode('create', false);
          if (this.ZazuService.isEditing()) {
            this.ZazuService.setEditing(false);
            this.refresh();
          }
        }
      })
      .add({
        combo: 'down',
        description: 'Select next zazu',
        callback: (event) => {
          event.preventDefault();
          this.ZazuService.next();
        }
      })
      .add({
        combo: 'up',
        description: 'Select previous zazu',
        callback: (event) => {
          event.preventDefault();
          this.ZazuService.previous();
        }
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
      });
  }
}
