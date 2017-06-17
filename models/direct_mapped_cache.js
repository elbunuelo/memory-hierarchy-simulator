const SetAssociativeCache = require('./set_associative_cache');

class DirectMappedCache extends SetAssociativeCache {
  constructor(params) {
    const { size, blockSize } = params;
    const numberOfBlocks = size / blockSize;
    super(Object.assign(params, { numberOfSets: numberOfBlocks }));
  }
}

module.exports = DirectMappedCache;
