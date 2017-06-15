class Cache {
  constructor(params) {
    const {
      size,
      blockSize,
      overwriteStrategy,
      writeStrategy,
      memory,
      victimCache,
      canAccessMemory,
      title,
    } = params;

    this.size = size;
    this.blockSize = blockSize;
    this.overwriteStrategy = overwriteStrategy;
    this.writeStrategy = writeStrategy;
    this.memory = memory;
    this.victimCache = victimCache;
    this.canAccessMemory = canAccessMemory;

    this.numberOfBlocks = size / blockSize;
    this.offsetSize = Math.log2(memory.blockLength);
    this.blockAddressLength = Math.log2(this.memory.size);
    this.dataSize = this.memory.blockLength * 8;
    this.title = title || "Cache";
  }
}

module.exports = Cache;
