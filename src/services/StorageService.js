const randomstring = require('randomstring');

export default class StorageService {

  constructor () {
    this.storage = localStorage;

    this.refresh();
  }

  /**
   * Refresh the list of zazus from the storage.
   */
  refresh () {
    this.zazus = angular.fromJson(this.storage.getItem('zazus')) || [];
  }

  /**
   * Get the list of zazus.
   * @returns {object[]} The current list of zazus.
   */
  get () {
    return angular.copy(this.zazus) || [];
  }

  /**
   * Save zazus in the storage as JSON string.
   */
  save () {
    this.storage.setItem('zazus', angular.toJson(this.zazus || []));
  }

  /**
   * Create a new zazu.
   * @param {object} zazu The zazu.
   */
  create (zazu) {
    zazu.id = randomstring.generate();
    this.zazus.push(zazu);
    this.save();
  }

  /**
   * Remove zazu with the specified id.
   * @param {string} id The zazu id.
   */
  remove (id) {
    var index = this.find(id);
    if (index === -1) {
      return;
    }
    this.zazus.splice(index, 1);
    this.save();
  }

  /**
   * Update the key of zazu with value using the specified id.
   * @param {string} id The id of zazu.
   * @param {string} prop The property of zazu object to update.
   * @param {string|boolean} value The new value.
   */
  update (id, prop, value) {
    var index = this.find(id);
    if (index === -1) {
      return;
    }
    this.zazus[index][prop] = value;
    this.save();
  }

  /**
   * Find zazu with id.
   * @param {string} id The zazu id.
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
}
