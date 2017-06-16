const Cache = require('./cache');
const MemoryLocation = require('./memory_location');
const AsciiTable = require('ascii-table');

class WriteBuffer extends Cache {
  constructor(params) {
    super(params);
    this.blocks = [];
    this.emptyBlocks = this.numberOfBlocks;
  }

  store(memoryLocation) {
    if (this.blocks.length === this.numberOfBlocks) {
      console.log('WRITE BUFFER FULL, STALLING');
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

  outputBlocks() {
    const table = new AsciiTable();
    table.setHeading('Address', 'Value');
    this.blocks.forEach(block => table.addRow(block.address, block.value));
    for (let i = 0; i < (this.numberOfBlocks - this.blocks.length); i++) {
      table.addRow('-'.repeat(this.blockAddressLength), '-'.repeat(this.dataSize));
    }
    console.log(table.toString());
  }
}

module.exports = WriteBuffer;
