class Cache {
  constructor(params) {
    const {
      size,
      blockSize,
      overwriteStrategy,
      writeStrategy,
      memory,
    } = params;

    this.size = size;
    this.blockSize = blockSize;
    this.overwriteStrategy = overwriteStrategy;
    this.writeStrategy = writeStrategy;
    this.memory = memory;

    this.numberOfBlocks = size / blockSize;
    this.offsetSize = Math.log2(memory.blockLength);
    this.blockAddressLength = Math.log2(size);
  }
}

module.exports = Cache;
