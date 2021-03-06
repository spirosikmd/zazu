import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';

@Injectable()
export class FlagService {
  storage: Storage;
  flagsKey: string;
  flags: {
    firstTime: boolean
  };

  // @ngInject
  constructor (ConfigService: ConfigService) {
    this.flagsKey = ConfigService.get('flagsKey');
    this.storage = localStorage;

    this.refresh();
  }

  /**
   * Refresh the flags from local storage.
   */
  refresh () {
    this.flags = JSON.parse(this.storage.getItem(this.flagsKey)) || {};
  }

  /**
   * Get the specified flag.
   * @param {string} flag The flag.
   * @returns {boolean} The flag state.
   */
  getFlag (flag: string): boolean {
    return this.flags[flag];
  }

  /**
   * Set a new state for the specified flag.
   * @param {string} flag The flag to change the state of.
   * @param {boolean} state The new state of the flag.
   */
  setFlag (flag: string, state: boolean) {
    this.flags[flag] = state;
    this.storage.setItem(this.flagsKey, JSON.stringify(this.flags || {}));
  }
}
