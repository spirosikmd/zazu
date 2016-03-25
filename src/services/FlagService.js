export class FlagService {

  // @ngInject
  constructor (flagsKey) {
    this.storage = localStorage;
    this.flagsKey = flagsKey;

    this.refresh();
  }

  /**
   * Refresh the flags from local storage.
   */
  refresh () {
    this.flags = angular.fromJson(this.storage.getItem(this.flagsKey)) || {};
  }

  /**
   * Get the specified flag.
   * @param {string} flag The flag.
   * @returns {boolean} The flag state.
   */
  getFlag (flag) {
    return this.flags[flag];
  }

  /**
   * Set a new state for the specified flag.
   * @param {string} flag The flag to change the state of.
   * @param {boolean} state The new state of the flag. 
   */
  setFlag (flag, state) {
    this.flags[flag] = state;
    this.storage.setItem(this.flagsKey, angular.toJson(this.flags || {}));
  }
}
