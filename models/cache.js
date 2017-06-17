class Cache {
  constructor(params) {
    const {
      size,
      blockSize,
      overwriteStrategy,
      writeStrategy,
      memory,
      victimCache,
      writeBuffer,
      title,
      events,
    } = params;

    this.size = size;
    this.blockSize = blockSize;
    this.overwriteStrategy = overwriteStrategy;
    this.writeStrategy = writeStrategy;
    this.memory = memory;
    this.victimCache = victimCache;
    this.writeBuffer = writeBuffer;
    this.events = events;

    this.numberOfBlocks = size / blockSize;
    this.offsetSize = Math.log2(memory.blockLength);
    this.blockAddressLength = Math.log2(this.memory.getSize());
    this.dataSize = this.memory.blockLength * 8;
    this.title = title || 'Cache';
  }
}

module.exports = Cache;
