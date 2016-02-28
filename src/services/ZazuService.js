export class ZazuService {

  constructor () {
    this.zazus = [{
      id: 1,
      checked: false,
      label: 'Use local storage to store zazus',
      editing: false
    }, {
      id: 2,
      checked: true,
      label: 'When enter on selected zazu then edit mode so user can update label',
      editing: false
    }, {
      id: 3,
      checked: true,
      label: 'Style the checkboxes!',
      editing: false
    }, {
      id: 4,
      checked: true,
      label: 'Style the checked zazu a bit differently',
      editing: false
    }, {
      id: 5,
      checked: false,
      label: 'Increase input width with text',
      editing: false
    }];
    this.selected = 0;
  }

  /**
   * Get the list of zazu.
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
    zazu.id = this.zazus.length + 1;
    this.zazus.push(zazu);
  }

  /**
   * Update the key of zazu with value using the specified id.
   * @param {number} id The id of zazu.
   * @param {string} key The key of zazu object to update.
   * @param {string|boolean} value The new value.
   */
  update (id, key, value) {
    var index = this.find(id);
    if (index === -1) {
      return;
    }
    var current = this.zazus[index];
    current[key] = value;
  }

  /**
   * Remove zazu with the specified id.
   * @param {number} id The zazu id.
   */
  remove (id) {
    var index = this.find(id);
    if (index === -1) {
      return;
    }
    this.zazus.splice(index, 1);
  }

  /**
   * Find zazu with id.
   * @param {number} id The zazu id.
   * @returns {number} The index of zazu in the list, -1 if it doesn't exist.
   */
  find (id) {
    for (var index = 0; index < this.zazus.length; index++) {
      var current = this.zazus[index];
      if (current.id === id) {
        return index;
      }
    }
    return -1;
  }

  /**
   * Set as selected the next zazu in list, if current is the last
   * then set as selected the first one.
   */
  next () {
    this.selected += 1;
    if (this.selected > this.zazus.length - 1) {
      this.selected = 0;
    }
  }

  /**
   * Set as selected the previous zazu, if current is the first
   * then set as selected the last one.
   */
  previous () {
    this.selected -= 1;
    if (this.selected < 0) {
      this.selected = this.zazus.length - 1;
    }
  }

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
    return selected.editing;
  }
}
