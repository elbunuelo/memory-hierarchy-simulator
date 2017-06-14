'use strict';
const SetAssociativeCache = require('./set_associative_cache');
const CacheBlock = require('./cache_block');

class DirectMappedCache extends SetAssociativeCache {
  constructor(params) {
    let { size, blockSize } = params;

    const numberOfBlocks = size/blockSize;
    super(Object.assign(params, { numberOfSets: numberOfBlocks }));
  }

  write(memoryLocation) {
    const set = this.getSetNumber(memoryLocation);
    const tag = this.getTag(memoryLocation);
    this.blocks[set][0] = new CacheBlock({
      tag,
      data: memoryLocation.value
    });
  }
}

module.exports = DirectMappedCache;
