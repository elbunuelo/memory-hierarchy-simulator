const Cache = require('./cache');
const AsciiTable = require('ascii-table');
const Logger = require('../lib/log').getInstance();

class WriteBuffer extends Cache {
  constructor(params) {
    super(params);
    this.blocks = [];
    this.emptyBlocks = this.numberOfBlocks;
  }

  store(memoryLocation) {
    if (this.blocks.length === this.numberOfBlocks) {
      Logger.info('WRITE BUFFER', 'WRITE BUFFER FULL, STALLING');
      this.writeBack();
    }
    this.blocks.push(memoryLocation);
  }

  writeBack() {
    const block = this.blocks.shift();
    if (block) {
      this.memory.write(block);
    }
  }

  toString() {
    const table = new AsciiTable('Write Buffer');
    table.setHeading('Address', 'Value');
    this.blocks.forEach(block => table.addRow(block.address, block.data));
    for (let i = 0; i < (this.numberOfBlocks - this.blocks.length); i++) {
      table.addRow('-'.repeat(this.blockAddressLength), '-'.repeat(this.dataSize));
    }

    return table.toString();
  }
}

module.exports = WriteBuffer;
