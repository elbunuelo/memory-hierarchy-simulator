const {
  CacheTypes,
  WriteStrategies,
  WriteMissStrategies,
  OverwriteStrategies,
  OperationTypes } = require('../lib/constants');

module.exports = {
  title: '4 way set associative cache with write buffer',
  description: '4 way set associative cache with write buffer, ' +
    'least recently used overwrite strategy, write through + no write allocate ' +
    'write strategies and two page virtual memory.',
  details: [
    'Cache Type: 4 way set associative + write buffer',
    'Cache Size: 256 bytes',
    'Block Size: 16 bytes',
    'Total Memory: 512 bytes',
    'Number of pages: 2',
    'Memory Location size: 1 Byte',
    'Overwrite Strategy: Least recently used',
    'Write Strategy: Write through and no write allocate'],
  memory: {
    pageSize: 256,
    numberOfPages: 2,
    blockLength: 1,
  },
  cache: {
    size: 256,
    blockSize: 16,
    type: CacheTypes.SET_ASSOCIATIVE,
    numberOfSets: 4,
    writeStrategy: WriteStrategies.WRITE_THROUGH,
    writeMissStrategy: WriteMissStrategies.NO_WRITE_ALLOCATE,
    overwriteStrategy: OverwriteStrategies.LEAST_RECENTLY_USED,
    title: 'Direct mapped cache',
  },
  writeBuffer: {
    size: 64,
    blockSize: 16,
    title: 'Write buffer',
  },
  operations: [
    {
      type: OperationTypes.READ,
      address: '000000000',
    },
    {
      type: OperationTypes.READ,
      address: '000000001',
    },
    {
      type: OperationTypes.READ,
      address: '000000010',
    },
    {
      type: OperationTypes.READ,
      address: '000000110',
    },
    {
      type: OperationTypes.READ,
      address: '000000111',
    },
    {
      type: OperationTypes.READ,
      address: '000000110',
    },
    {
      type: OperationTypes.WRITE,
      address: '111100000',
      value: '00000000',
    },
    {
      type: OperationTypes.WRITE,
      address: '100000000',
      value: '01111111',
    },
    {
      type: OperationTypes.WRITE,
      address: '111100001',
      value: '00111100',
    },
    {
      type: OperationTypes.WRITE,
      address: '110111111',
      value: '00001000',
    },
    {
      type: OperationTypes.NOOP,
    },
    {
      type: OperationTypes.NOOP,
    },
    {
      type: OperationTypes.NOOP,
    },
    {
      type: OperationTypes.WRITE,
      address: '011100001',
      value: '00111101',
    },
    {
      type: OperationTypes.WRITE,
      address: '110111011',
      value: '00111001',
    },
    {
      type: OperationTypes.WRITE,
      address: '000111011',
      value: '10001001',
    },
    {
      type: OperationTypes.WRITE,
      address: '111111110',
      value: '00001111',
    },
    {
      type: OperationTypes.WRITE,
      address: '110001011',
      value: '01011001',
    },
    {
      type: OperationTypes.WRITE,
      address: '010101010',
      value: '00101001',
    },
  ],
};
