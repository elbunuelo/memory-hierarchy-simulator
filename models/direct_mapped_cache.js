const SetAssociativeCache = require('./set_associative_cache');

class DirectMappedCache extends SetAssociativeCache {
  constructor(params) {
    super(Object.assign(params, { numberOfSets: 1, overwriteStrategy: null }));
  }

  findOverwriteBlockIndex() {
    return 0;
  }
}

module.exports = DirectMappedCache;
