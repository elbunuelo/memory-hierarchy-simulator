'use strict';
const { RANDOM } = require('../lib/constants');

class Cache {
  constructor(params) {
    let {
      size,
      blockSize,
      overwriteStrategy,
      memory
    } = params;

    this.size = size;
    this.blockSize = blockSize;
    this.overwriteStrategy = overwriteStrategy;
    this.memory = memory;

    this.numberOfBlocks = size/blockSize;
    this.offsetSize = Math.log2(memory.blockLength);
    this.blockAddressLength = Math.log2(size);
  }
}

module.exports = Cache;
