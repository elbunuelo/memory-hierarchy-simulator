const FullyAssociativeCache = require('./fully_associative_cache');

class VictimCache extends FullyAssociativeCache {
  read() { }
  writeToMemory() { }
}

module.exports = VictimCache;
