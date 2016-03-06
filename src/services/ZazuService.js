export class ZazuService {

  constructor (StorageService) {
    this.storage = StorageService;

    this.refresh();
    this.selected = 0;
  }

  /**
   * Refresh the list of zazus.
   */
  refresh () {
    this.zazus = this.storage.get();
  }

  /**
   * Get the list of zazus.
   * @returns {object[]} The current list of zazus.
   */
  get () {
    return angular.copy(this.zazus);
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
      this.selected = this.zazus.length - 1;
      return;
    }
    this.selected -= 1;
  }

  /**
   * Get the selected zazu.
   * @returns {object} zazu The selected zazu.
   */
  getSelected () {
    return this.zazus[this.selected];
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
    return this.selected === this.zazus.length - 1;
  }

  /**
   * Check whether the first zazu is currently selected.
   * @returns {boolean} True if selected index is the first zazu.
   */
  isFirstSelected () {
    return this.selected === 0;
  }
}
