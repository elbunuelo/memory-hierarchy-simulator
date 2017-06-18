const {
  CacheTypes,
  WriteStrategies,
  WriteMissStrategies,
  OverwriteStrategies,
  OperationTypes } = require('../lib/constants');

module.exports = {
  tickInterval: 1000,
  title: 'Fully associative cache',
  description: 'Fully associative cache with random overwrite strategy, ' +
    'write through + no write allocate write strategies and ' +
    'single page memory.',
  details: [
    'Cache Type: Fully associative',
    'Cache Size: 64 bytes',
    'Block Size: 16 bytes',
    'Total Memory: 512 bytes',
    'Memory Location size: 1 Byte',
    'Overwrite Strategy: First in first out',
    'Write Strategy: Write through and no write allocate'],
  memory: {
    pageSize: 512,
    numberOfPages: 1,
    blockLength: 1,
  },
  cache: {
    size: 128,
    blockSize: 16,
    type: CacheTypes.FULLY_ASSOCIATIVE,
    overwriteStrategy: OverwriteStrategies.FIFO,
    writeStrategy: WriteStrategies.WRITE_THROUGH,
    writeMissStrategy: WriteMissStrategies.NO_WRITE_ALLOCATE,
  },
  operations: [
    {
      type: OperationTypes.READ,
      address: '000000000',
    },
    {
      type: OperationTypes.READ,
      address: '100100101',
    },
    {
      type: OperationTypes.READ,
      address: '010010110',
    },
    {
      type: OperationTypes.READ,
      address: '111110100',
    },
    {
      type: OperationTypes.READ,
      address: '010010110',
    },
    {
      type: OperationTypes.READ,
      address: '001110000',
    },
    {
      type: OperationTypes.READ,
      address: '000010000',
    },
    {
      type: OperationTypes.READ,
      address: '000001001',
    },
    {
      type: OperationTypes.READ,
      address: '000100111',
    },
    {
      type: OperationTypes.READ,
      address: '111111111',
    },
    {
      type: OperationTypes.READ,
      address: '100000010',
    },
    {
      type: OperationTypes.READ,
      address: '100000000',
    },
  ],
};
