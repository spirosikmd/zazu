const assign = require('lodash.assign');

export class Zazu {
  id: string;
  label: string;
  createdAt: number;
  checked: boolean;
  // TODO: these two we don't want to persist them
  temp: boolean;
  editing: boolean;

  constructor (data = {}) {
    assign(this, data);
  }
}
