const assign = require('lodash.assign');

export class Zazu {
  id: string;
  label: string;
  createdAt: number;
  checked: boolean;
  temp: boolean;
  editing: boolean;

  constructor (data = {}) {
    assign(this, data);
  }

  toJSON () {
    return {
      id: this.id,
      label: this.label,
      createdAt: this.createdAt,
      checked: this.checked
    };
  }
}
