'use strict';
const { RANDOM } = require('../lib/constants');

class Cache {
  constructor(params) {
    let { size, blockSize, memoryLength, overwriteStrategy } = params;

    this.size = size;
    this.blockSize = blockSize;
    this.memoryLength = memoryLength;
    this.overwriteStrategy = overwriteStrategy;
    this.numberOfBlocks = size/blockSize;
    this.offsetSize = Math.log2(memoryLength);
    this.blockAddressLength = Math.log2(size);
  }
}

module.exports = Cache;
