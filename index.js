'use strict';

const clear = require('clear');
const FullyAssociativeCache = require('./models/fully_associative_cache');
const DirectMappedCache = require('./models/direct_mapped_cache');
const MemoryLocation = require('./models/memory_location');
const Memory = require('./models/memory');
const Utils = require('./lib/utils');
const { LEAST_RECENTLY_USED, FIFO, RANDOM } = require('./lib/constants');

const params = {
  size: 128,
  blockSize: 16,
  memoryLength: 1,
  overwriteStrategy: FIFO
};

clear();
let a = new FullyAssociativeCache(params);
a.outputBlocks();

setInterval(function(){
  clear();
  a.write(new MemoryLocation({
    address: Utils.generateRandomValue(8),
    value: Utils.generateRandomValue(8),
  }));
  a.outputBlocks();
}, 1000);

//a.write(new MemoryLocation({
  //address: "01100100",
  //value: "10101010",
//}));
//a.outputBlocks();
//a.write(new MemoryLocation({
  //address: "01100100",
  //value: "11111111",
//}));
//a.outputBlocks();

//a.write(new MemoryLocation({
  //address: "11111111",
  //value: "11111111",
//}));
//a.outputBlocks();

//a.write(new MemoryLocation({
  //address: "01100101",
  //offset: "0",
  //value: "11111110",
//}));
//a.outputBlocks();
//a.write(new MemoryLocation({
  //address: "00000001",
  //offset: "0",
  //value: "11111110",
//}));
//a.outputBlocks();

//let b = a.getCachedValue(new MemoryLocation({
  //address: "01100101",
  //offset: "0"
//}));
//let m = new Memory({ size: 256, blockLength: 1 });
//m.outputBlocks();
