export class ZazuController {

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
    this.refresh();
    this.reset();
  };

  /**
   * Update the checked attribute of zazu with the specified id.
   * @param {number} id The id of the zazu.
   * @param {boolean} checked Either true or false.
   */
  updateChecked (id, checked) {
    this.ZazuService.update(id, 'checked', checked);
    this.refresh();
  };

  /**
   * Update the label attribute of zazu with the specified id in case key press is "enter",
   * and set editing mode to false.
   * @param $event The ng-keypress event
   * @param {number} id The zazu id.
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
   * Setup the hotkeys.
   */
  setupHotkeys () {
    this.hotkeys.bindTo(this.$scope)
      .add({
        combo: 'mod+n',
        description: 'Create new zazu',
        callback: () => {
          this.setMode('create', true);
        }
      })
      .add({
        combo: 'esc',
        description: 'Default state',
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
        combo: 'mod+down',
        description: 'Select next zazu',
        callback: () => {
          this.ZazuService.next();
        }
      })
      .add({
        combo: 'mod+up',
        description: 'Select previous zazu',
        callback: () => {
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
        combo: 'space',
        description: 'Change check status of zazu',
        callback: () => {
          var selected = this.ZazuService.getSelected();
          if (!selected) {
            return;
          }
          this.updateChecked(selected.id, !selected.checked);
        }
      })
      .add({
        combo: 'mod+enter',
        description: 'Edit mode',
        allowIn: ['INPUT'],
        callback: (event) => {
          event.preventDefault();
          if (this.ZazuService.isEditing()) {
            this.ZazuService.setEditing(false);
          } else {
            this.ZazuService.setEditing(true);
          }
          this.refresh();
        }
      });
  }
}
