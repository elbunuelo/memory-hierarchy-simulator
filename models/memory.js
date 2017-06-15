const Utils = require('../lib/utils');
const AsciiTable = require('ascii-table');
const MemoryLocation = require('./memory_location');

class Memory {
  constructor(params) {
    const { size, blockLength } = params;
    this.size = size;
    this.blockLength = blockLength;
    this.contents = [];

    this.initContents();
  }

  initContents() {
    const numberOfBlocks = this.size / this.blockLength;
    const addressSize = Math.log2(numberOfBlocks);
    for (let i = 0; i < numberOfBlocks; i++) {
      const address = Utils.toBinary(i, addressSize);
      const value = this.generateRandomValue();
      this.contents.push(new MemoryLocation({ address, value }));
    }
  }

  generateRandomValue() {
    const length = 8 * this.blockLength;
    return Utils.generateRandomValue(length);
  }

  outputBlocks() {
    const table = new AsciiTable('Memory Status');
    table.setHeading('ADDRESS', 'VALUE');
    this.contents.forEach((location) => {
      table.addRow(location.address, location.value);
    });

    console.log(table.toString());
  }

  getLocation(memoryLocation) {
    const index = parseInt(memoryLocation.address, 2);
    return this.contents[index];
  }

  write(memoryLocation) {
    const index = parseInt(memoryLocation.address, 2);
    this.contents[index] = memoryLocation;
  }
}

module.exports = Memory;
