const {
  CacheTypes,
  WriteStrategies,
  WriteMissStrategies,
  OverwriteStrategies,
  OperationTypes } = require('../lib/constants');

module.exports = {
  title: 'Fully associative cache',
  description: 'Fully associative cache with random overwrite strategy, ' +
    'write through + no write allocate write strategies and ' +
    'single page memory.',
  details: [
    'Cache Type: Fully associative',
    'Cache Size: 128 bytes',
    'Block Size: 16 bytes',
    'Total Memory: 512 bytes',
    'Memory Location size: 1 Byte',
    'Overwrite Strategy: Random',
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
    overwriteStrategy: OverwriteStrategies.RANDOM,
    writeStrategy: WriteStrategies.WRITE_THROUGH,
    writeMissStrategy: WriteMissStrategies.NO_WRITE_ALLOCATE,
  },
  operations: [
    {
      type: OperationTypes.READ,
      address: '000000000',
    },
    {
      type: OperationTypes.WRITE,
      address: '001001001',
      value: '11010000',
    },
    {
      type: OperationTypes.READ,
      address: '100100101',
    },
    {
      type: OperationTypes.WRITE,
      address: '001111001',
      value: '10100010',
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
      type: OperationTypes.WRITE,
      address: '001000000',
      value: '01100010',
    },
    {
      type: OperationTypes.READ,
      address: '010010110',
    },
    {
      type: OperationTypes.WRITE,
      address: '000010000',
      value: '11010010',
    },
    {
      type: OperationTypes.READ,
      address: '001110000',
    },
    {
      type: OperationTypes.WRITE,
      address: '000010000',
      value: '11111111',
    },
    {
      type: OperationTypes.READ,
      address: '000010000',
    },
    {
      type: OperationTypes.READ,
      address: '000100101',
    },
    {
      type: OperationTypes.READ,
      address: '000001001',
    },
    {
      type: OperationTypes.WRITE,
      address: '000101100',
      value: '10000111',
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
