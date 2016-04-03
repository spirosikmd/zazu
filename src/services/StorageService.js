const randomstring = require('randomstring');
const angular = require('angular');

export class StorageService {

  // @ngInject
  constructor (db) {
    this.storage = localStorage;
    this.db = db;

    this.refresh();
  }

  /**
   * Refresh the list of zazus from the storage.
   */
  refresh () {
    this.zazus = angular.fromJson(this.storage.getItem(this.db)) || [];
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
    this.storage.setItem(this.db, angular.toJson(this.zazus || []));
  }

  /**
   * Generate an id and created at timestamp, push new zazu to array
   * and save to local storage.
   * @param {object} zazu The zazu.
   */
  create (zazu) {
    zazu.id = randomstring.generate();
    zazu.createdAt = this.getTime();
    this.zazus.push(zazu);
    this.save();
  }

  /**
   * Get the current date in milliseconds.
   * @returns {number} The current date in milliseconds.
   */
  getTime () {
    return new Date().getTime();
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

  /**
   * Swap the places of two subsequent zazus either ways (up/down)
   * depending on the provided indexes, and persist the new array.
   * @param {string} firstId The id of first zazu.
   * @param {string} secondId The id of second zazu.
   */
  swap (firstId, secondId) {
    const firstIndex = this.find(firstId);
    if (firstIndex === -1) {
      return;
    }

    const secondIndex = this.find(secondId);
    if (secondIndex === -1) {
      return;
    }

    const first = this.zazus[firstIndex];
    this.zazus[firstIndex] = this.zazus[secondIndex];
    this.zazus[secondIndex] = first;

    this.save();
  }

  /**
   * Put zazu with id to the beginning of current zazu array and save.
   * @param {string} id The id of zazu.
   */
  unshift (id) {
    const index = this.find(id);

    if (index === -1) {
      return;
    }

    const zazu = this.zazus[index];

    this.remove(zazu.id);

    this.zazus.unshift(zazu);

    this.save();
  }

  /**
   * Remove zazu with id from current place, push it to the
   * end of current zazus array, and save.
   * @param {string} id The id of zazu.
   */
  push (id) {
    const index = this.find(id);

    if (index === -1) {
      return;
    }

    const zazu = this.zazus[index];

    this.remove(zazu.id);

    this.zazus.push(zazu);

    this.save();
  }
}
