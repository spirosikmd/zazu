const angular = require('angular');

export class ZazuService {

  // @ngInject
  constructor (StorageService, FlagService) {
    this.storage = StorageService;
    this.flagService = FlagService;

    this.open = false;
    this.selected = 0;
    this.zazus = this.storage.get();
    this.filtered = this.zazus;
    this.refresh();
  }

  /**
   * Determine whether a zazu is open.
   * In case open mode is false just return.
   * @param {object} zazu The zazu.
   * @returns {boolean} True if open mode is false or zazu is
   */
  isOpen (zazu) {
    if (!this.open) {
      return true;
    }
    return zazu.checked === false;
  }

  /**
   * Refresh the list of zazus.
   */
  refresh () {
    this.zazus = this.storage.get();
  }

  /**
   * Get the filtered zazus.
   * @returns {object[]} The current list of filtered zazus.
   */
  get () {
    this.filtered = this.zazus.filter(this.isOpen.bind(this));
    return angular.copy(this.filtered);
  }

  /**
   * Create a new zazu.
   * @param {object} zazu The zazu.
   */
  create (zazu) {
    this.storage.create(zazu);
    this.refresh();
  }

  /**
   * Update the key of zazu with value using the specified id.
   * @param {string} id The id of zazu.
   * @param {string} prop The property of zazu object to update.
   * @param {string|boolean} value The new value.
   */
  update (id, prop, value) {
    this.storage.update(id, prop, value);
    this.refresh();
  }

  /**
   * Remove zazu with the specified id.
   * @param {string} id The zazu id.
   */
  remove (id) {
    this.storage.remove(id);
    this.refresh();
  }

  /**
   * Set as selected the next zazu in list, if current is the last
   * then set as selected the first one.
   */
  next () {
    if (this.isLastSelected()) {
      this.selected = 0;
      return;
    }
    this.selected += 1;
  }

  /**
   * Set as selected the previous zazu, if current is the first
   * then set as selected the last one.
   */
  previous () {
    if (this.isFirstSelected()) {
      this.selected = this.filtered.length - 1;
      return;
    }
    this.selected -= 1;
  }

  /**
   * Get the selected zazu.
   * @returns {object} zazu The selected zazu.
   */
  getSelected () {
    return this.filtered[this.selected];
  }

  /**
   * Determine if zazu with specified index is selected.
   * @param {number} index The index of zazu in the list.
   * @returns {boolean} True if zazu with specified index is selected.
   */
  isSelected (index) {
    return this.selected === index;
  }

  /**
   * Reset the selected zazu to first in the list.
   */
  resetSelected () {
    this.selected = 0;
  }

  /**
   * Set editing mode of selected zazu to the specified flag.
   * @param {boolean} flag
   */
  setEditing (flag) {
    var selected = this.getSelected();
    selected.editing = flag;
  }

  /**
   * Whether the selected zazu is in edit mode.
   * @returns {boolean} True in case selected zazu is in edit mode.
   */
  isEditing () {
    var selected = this.getSelected();
    return angular.isDefined(selected.editing) && selected.editing;
  }

  /**
   * Check whether the last zazu is currently selected.
   * @returns {boolean} True if selected index is the last zazu.
   */
  isLastSelected () {
    return this.selected === this.filtered.length - 1;
  }

  /**
   * Check whether the first zazu is currently selected.
   * @returns {boolean} True if selected index is the first zazu.
   */
  isFirstSelected () {
    return this.selected === 0;
  }

  /**
   * Toggle the open mode and reset selected.
   */
  toggleOpen () {
    this.open = !this.open;
    this.resetSelected();
  }

  /**
   * If firstTime flag is undefined or false, then the application
   * is opened for first time.
   * @returns {boolean} True if firstTime is undefined or false.
   */
  isFirstTime () {
    const firstTimeFlag = this.flagService.getFlag('firstTime');

    return firstTimeFlag === undefined || firstTimeFlag === false;
  }

  /**
   * Set the firstTime flag to true.
   */
  setFirstTime () {
    this.flagService.setFlag('firstTime', true);
  }

  /**
   * Move selected zazu one position down.
   * If selected zazu is the last one, then swap with the first zazu.
   */
  moveDown () {
    const firstIndex = this.selected;
    let secondIndex;

    if (this.isLastSelected()) {
      secondIndex = 0;
    } else {
      secondIndex = firstIndex + 1;
    }

    this.swap(firstIndex, secondIndex);
    this.next();
  }

  /**
   * Move zazu one position up.
   * If selected zazu is the first one, then swap with last zazu.
   */
  moveUp () {
    const firstIndex = this.selected;
    let secondIndex;

    if (this.isFirstSelected()) {
      secondIndex = this.filtered.length - 1;
    } else {
      secondIndex = firstIndex - 1;
    }

    this.swap(firstIndex, secondIndex);
    this.previous();
  }

  /**
   * Swap the places of two subsequent zazus either ways (up/down)
   * depending on the provided indexes.
   * @param {number} firstIndex The index of first zazu.
   * @param {number} secondIndex The index of second zazu.
   */
  swap (firstIndex, secondIndex) {
    if (firstIndex === secondIndex) {
      return;
    }

    this.storage.swap(firstIndex, secondIndex);

    this.refresh();
  }
}
