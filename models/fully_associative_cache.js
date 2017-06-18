const SetAssociativeCache = require('./set_associative_cache');

class FullyAssociativeCache extends SetAssociativeCache {
  constructor(params) {
    super(Object.assign(params, { numberOfSets: 1 }));
  }

  selectSet() {
    return this.sets[0];
  }

  getSetNumber() {
    return 0;
  }
}

module.exports = FullyAssociativeCache;
