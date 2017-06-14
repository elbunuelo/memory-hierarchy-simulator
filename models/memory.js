'use strict';
const Utils = require('../lib/utils');
const AsciiTable = require('ascii-table');
const MemoryLocation = require('./memory_location');

class Memory {
  constructor(params){
    let { size, blockLength } = params;
    this.size = size;
    this.blockLength = blockLength;
    this.contents = [];

    this.initContents = this.initContents.bind(this);
    this.generateRandomValue = this.generateRandomValue.bind(this);
    this.getLocation = this.getLocation.bind(this);

    this.initContents();
  }

  initContents() {
    const numberOfBlocks = this.size/this.blockLength;
    const addressSize = Math.log2(numberOfBlocks);
    for (let i = 0; i < numberOfBlocks; i++) {
      let address = Utils.toBinary(i, addressSize);
      let value = this.generateRandomValue();
      this.contents.push(new MemoryLocation({ address, value }));
    }
  }

  generateRandomValue() {
    const length = 8 * this.blockLength;
    return Utils.generateRandomValue(length);
  }

  outputBlocks() {
    let table = new AsciiTable('Memory Status');
    table.setHeading('ADDRESS', 'VALUE');
    for (let location of this.contents) {
      table.addRow(location.address, location.value);
    }
    console.log(table.toString());
  }

  getLocation(memoryLocation) {
    let index = parseInt(memoryLocation.address, 2);
    return this.contents[index];
  }
}

module.exports = Memory;
