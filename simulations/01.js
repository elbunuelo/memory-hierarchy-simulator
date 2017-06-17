const {
  CacheTypes,
  WriteStrategies,
  WriteMissStrategies,
  OperationTypes } = require('../lib/constants');

const DIRECT_MAPPED_CACHE = {
  memory: {
    pageSize: 32,
    numberOfPages: 2,
    blockLength: 1,
  },
  cache: {
    size: 128,
    blockSize: 16,
    type: CacheTypes.DIRECT_MAPPED,
    writeStrategy: WriteStrategies.WRITE_THROUGH,
    writeMissStrategy: WriteMissStrategies.WRITE_ALLOCATE,
  },
  operations: [
    {
      type: OperationTypes.READ,
      address: '110000',
    },
    {
      type: OperationTypes.READ,
      address: '001000',
    },
    {
      type: OperationTypes.READ,
      address: '111000',
    },
    {
      type: OperationTypes.READ,
      address: '010000',
    },
    {
      type: OperationTypes.WRITE,
      address: '100000',
      value: '11111111',
    },
    {
      type: OperationTypes.WRITE,
      address: '100001',
      value: '11110000',
    },
    {
      type: OperationTypes.READ,
      address: '000000',
    },
    {
      type: OperationTypes.READ,
      address: '100000',
    },
  ],
};

module.exports = DIRECT_MAPPED_CACHE;
