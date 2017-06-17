const FullyAssociativeCache = require('./fully_associative_cache');
const { WriteMissStrategies } = require('../lib/constants');

class VictimCache extends FullyAssociativeCache {
  constructor(params) {
    super(params);
    this.writeMissStrategy = WriteMissStrategies.WRITE_ALLOCATE;
    this.isVictimCache = true;
  }
  writeToMemory() { }
}

module.exports = VictimCache;
