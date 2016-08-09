import {Zazu} from '../models/Zazu';
const randomstring = require('randomstring');
const angular = require('angular');

export class StorageService {
  storage: Storage;
  zazus: any[];

  /**
   * Get the current date in milliseconds.
   * @returns {number} The current date in milliseconds.
   */
  static getTime (): number {
    return new Date().getTime();
  }

  // @ngInject
  constructor (private db: string) {
    this.storage = localStorage;

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
   * @returns {Zazu[]} The current list of zazus.
   */
  get (): Zazu[] {
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
   * @param {Zazu} zazu The zazu.
   * @param {number} position The position to create the new zazu.
   */
  create (zazu: Zazu, position: number) {
    zazu.id = randomstring.generate();
    zazu.createdAt = StorageService.getTime();

    if (position) {
      this.zazus.splice(position, 0, zazu);
    } else {
      this.zazus.push(zazu);
    }

    this.save();
  }

  /**
   * Remove zazu with the specified id.
   * @param {string} id The zazu id.
   */
  remove (id: string) {
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
  update (id: string, prop: string, value: string|boolean) {
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
  find (id: string): number {
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
  swap (firstId: string, secondId: string) {
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
  unshift (id: string) {
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
  push (id: string) {
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
