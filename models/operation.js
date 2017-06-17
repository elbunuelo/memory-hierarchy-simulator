const { OperationTypes } = require('../lib/constants');

class Operation {
  constructor(params) {
    const { type, address, value } = params;
    this.type = type;
    this.address = address;
    this.value = value;
  }

  toString() {
    let string = '';
    switch (this.type) {
      case OperationTypes.READ:
        string = `Read ${this.address}`;
        break;
      case OperationTypes.WRITE:
        string = `Write ${this.value} to ${this.address}`;
        break;
      case OperationTypes.NOOP:
      default:
        string = 'Idle';
        break;
    }
    return string;
  }
}

module.exports = Operation;
