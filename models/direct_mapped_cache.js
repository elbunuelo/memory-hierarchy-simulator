const SetAssociativeCache = require('./set_associative_cache');

class DirectMappedCache extends SetAssociativeCache {
  constructor(params) {
    const { size, blockSize } = params;
    params.overwrtieStrategy = null;

    const numberOfBlocks = size / blockSize;
    super(Object.assign(params, { numberOfSets: numberOfBlocks }));
  }

  findOverwriteBlockIndex() {
    return 0;
  }
}

module.exports = DirectMappedCache;
