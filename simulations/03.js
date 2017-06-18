const {
  CacheTypes,
  WriteStrategies,
  WriteMissStrategies,
  OverwriteStrategies,
  OperationTypes } = require('../lib/constants');

module.exports = {
  title: 'Direct mapped cache with victim cache',
  description: 'Direct mapped cache with victim cache, ' +
    'write back + write allocate write strategies and single page memory.',
  details: [
    'Cache Type: Direct mapped',
    'Cache Size: 128 bytes',
    'Block Size: 16 bytes',
    'Total Memory: 512 bytes',
    'Memory Location size: 1 Byte',
    'Write Strategy: Write back and write allocate'],
  memory: {
    pageSize: 512,
    numberOfPages: 1,
    blockLength: 1,
  },
  cache: {
    size: 128,
    blockSize: 16,
    type: CacheTypes.DIRECT_MAPPED,
    overwriteStrategy: OverwriteStrategies.FIFO,
    writeStrategy: WriteStrategies.WRITE_BACK,
    writeMissStrategy: WriteMissStrategies.WRITE_ALLOCATE,
    title: 'Direct mapped cache',
  },
  victimCache: {
    size: 64,
    blockSize: 16,
    title: 'Victim Cache',
  },
  operations: [
    {
      type: OperationTypes.READ,
      address: '110000000',
    },
    {
      type: OperationTypes.READ,
      address: '110111111',
    },
    {
      type: OperationTypes.READ,
      address: '110000000',
    },
    {
      type: OperationTypes.READ,
      address: '000000000',
    },
    {
      type: OperationTypes.WRITE,
      address: '000000000',
      value: '10101010',
    },
    {
      type: OperationTypes.WRITE,
      address: '000100000',
      value: '11111111',
    },
  ],
};
