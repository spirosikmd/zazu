import {FlagService} from './FlagService';
import {StorageService} from './StorageService';
import {Zazu} from '../models/Zazu';

const angular = require('angular');

export class ZazuService {
  open: boolean;
  selected: number;
  zazus: Zazu[];
  filtered: Zazu[];

  // @ngInject
  constructor (
    private StorageService: StorageService,
    private FlagService: FlagService
  ) {
    // By default show only open zazus
    this.open = true;

    this.selected = 0;
    this.zazus = this.StorageService.get();
    this.filtered = this.zazus;
    this.refresh();
  }

  /**
   * Determine whether a zazu is open.
   * In case open mode is false just return.
   * @param {Zazu} zazu The zazu.
   * @returns {boolean} True if open mode is false or zazu is
   */
  isOpen (zazu: Zazu): boolean {
    if (!this.open || zazu.temp) {
      return true;
    }
    return zazu.checked === false;
  }

  /**
   * Refresh the list of zazus.
   */
  refresh () {
    this.zazus = this.StorageService.get();
  }

  /**
   * Get the filtered zazus.
   * @returns {Zazu[]} The current list of filtered zazus.
   */
  get (): Zazu[] {
    this.filtered = this.zazus.filter(this.isOpen.bind(this));
    return angular.copy(this.filtered);
  }

  /**
   * Create a new zazu.
   * @param {Zazu} zazu The zazu.
   * @param {boolean} persist Whether to persist the changes to storage.
   * @param {boolean} current Whether we are in create under current mode.
   */
  create (zazu: Zazu, persist: boolean, current: boolean) {
    // need to find another way to find position as filtered could mess results
    let selectedIndex = this.getSelectedIndex();

    if (selectedIndex === -1) {
      return;
    }

    let position = current ? selectedIndex + 1 : this.zazus.length + 1;

    if (!persist) {
      this.zazus.splice(position, 0, zazu);
      return;
    }

    // When we want to persist, zazu is not considered temporary anymore.
    zazu.temp = false;

    this.StorageService.create(zazu, position);
    this.refresh();
  }

  /**
   * Update the key of zazu with value using the specified id.
   * @param {string} id The id of zazu.
   * @param {string} prop The property of zazu object to update.
   * @param {string|boolean} value The new value.
   */
  update (id: string, prop: string, value: string|boolean) {
    this.StorageService.update(id, prop, value);
    this.refresh();
  }

  /**
   * Remove zazu with the specified id.
   * @param {string} id The zazu id.
   * @param {boolean} persist Whether to persist the changes to storage.
   * @param {boolean} current Whether we are in create under current mode.
   */
  remove (id: string, persist: boolean, current?: boolean) {
    if (persist) {
      this.StorageService.remove(id);
      this.refresh();
      return;
    }

    let selectedIndex = this.getSelectedIndex();

    if (selectedIndex === -1) {
      return;
    }

    let position = current ? selectedIndex + 1 : this.zazus.length - 1;
    this.zazus.splice(position, 1);
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
   * @returns {Zazu} zazu The selected zazu.
   */
  getSelected (): Zazu {
    return this.filtered[this.selected];
  }

  /**
   * Determine if zazu with specified index is selected.
   * @param {number} index The index of zazu in the list.
   * @returns {boolean} True if zazu with specified index is selected.
   */
  isSelected (index: number): boolean {
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
  setEditing (flag: boolean) {
    var selected = this.getSelected();
    selected.editing = flag;
  }

  /**
   * Whether the selected zazu is in edit mode.
   * @returns {boolean} True in case selected zazu is in edit mode.
   */
  isEditing (): boolean {
    var selected = this.getSelected();
    return angular.isDefined(selected.editing) && selected.editing;
  }

  /**
   * Check whether the last zazu is currently selected.
   * @returns {boolean} True if selected index is the last zazu.
   */
  isLastSelected (): boolean {
    return this.selected === this.filtered.length - 1;
  }

  /**
   * Check whether the first zazu is currently selected.
   * @returns {boolean} True if selected index is the first zazu.
   */
  isFirstSelected (): boolean {
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
  isFirstTime (): boolean {
    const firstTimeFlag = this.FlagService.getFlag('firstTime');

    return firstTimeFlag === undefined || firstTimeFlag === false;
  }

  /**
   * Set the firstTime flag to true.
   */
  setFirstTime () {
    this.FlagService.setFlag('firstTime', true);
  }

  /**
   * Move selected zazu one position down and select next one.
   * If selected zazu is the last one, then put it at the beginning.
   */
  moveDown () {
    const firstIndex = this.selected;

    if (this.isLastSelected()) {
      this.unshift(firstIndex);
    } else {
      const secondIndex = firstIndex + 1;
      this.swap(firstIndex, secondIndex);
    }

    this.next();
  }

  /**
   * Move zazu one position up and select previous one.
   * If selected zazu is the first one, then push it to the end.
   */
  moveUp () {
    const firstIndex = this.selected;

    if (this.isFirstSelected()) {
      this.push(firstIndex);
    } else {
      const secondIndex = firstIndex - 1;
      this.swap(firstIndex, secondIndex);
    }

    this.previous();
  }

  /**
   * Use storage to swap the places of two subsequent zazus either ways (up/down)
   * depending on the provided indexes and refresh.
   * We need to find the zazus on the service level, as we need to use the filtered
   * zazus array, e.g. when only open are visible.
   * @param {number} firstIndex The index of first zazu.
   * @param {number} secondIndex The index of second zazu.
   */
  swap (firstIndex: number, secondIndex: number) {
    if (firstIndex === secondIndex) {
      return;
    }

    const first = this.filtered[firstIndex];

    if (!first) {
      return;
    }

    const second = this.filtered[secondIndex];

    if (!second) {
      return;
    }

    this.StorageService.swap(first.id, second.id);

    this.refresh();
  }

  /**
   * Put zazu found in index to the beginning of current zazu array and refresh.
   * @param {number} index The index of zazu.
   */
  unshift (index: number) {
    const zazu = this.filtered[index];

    if (!zazu) {
      return;
    }

    this.StorageService.unshift(zazu.id);

    this.refresh();
  }

  /**
   * Push zazu in index to the end of current zazus array and refresh.
   * @param {number} index The index of zazu.
   */
  push (index: number) {
    const zazu = this.filtered[index];

    if (!zazu) {
      return;
    }

    this.StorageService.push(zazu.id);

    this.refresh();
  }

  /**
   * Find zazu index with id.
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
   * Get index of selected zazu.
   * @returns {number} The index of selected zazu.
   */
  getSelectedIndex (): number {
    let selected = this.getSelected();
    return this.find(selected.id);
  }
}
