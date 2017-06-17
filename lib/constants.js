module.exports = {
  CacheTypes: {
    FULLY_ASSOCIATIVE: 1,
    SET_ASSOCIATIVE: 2,
    DIRECT_MAPED: 3,
  },

  OverwriteStrategies: {
    RANDOM: 1,
    LEAST_RECENTLY_USED: 2,
    FIFO: 3,
  },

  WriteStrategies: {
    WRITE_THROUGH: 1,
    WRITE_BACK: 2,
  },

  WriteMissStrategies: {
    WRITE_ALLOCATE: 1,
    NO_WRITE_ALLOCATE: 2,
  },

  Highlights: {
    SELECT: '>',
    EVICT: 'x',
    NEW: '+',
    CHANGED: '~',
  },

  OperationTypes: {
    READ: 1,
    WRITE: 2,
    NOOP: 3,
  },
};
