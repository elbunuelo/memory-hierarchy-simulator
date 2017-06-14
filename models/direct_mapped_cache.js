'use strict';

const SetAssociativeCache = require('./set_associative_cache');
const CacheBlock = require('./cache_block');

class DirectMappedCache extends SetAssociativeCache {
  constructor(params) {
    let { size, blockSize } = params;
    params['overwrtieStrategy'] = null;

    const numberOfBlocks = size/blockSize;
    super(Object.assign(params, { numberOfSets: numberOfBlocks }));
  }

  findOverwriteBlockIndex(set) {
    return 0;
  }
}

module.exports = DirectMappedCache;
