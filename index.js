'use strict';

const clear = require('clear');
const FullyAssociativeCache = require('./models/fully_associative_cache');
const DirectMappedCache = require('./models/direct_mapped_cache');
const SetAssociativeCache = require('./models/set_associative_cache');
const MemoryLocation = require('./models/memory_location');
const Memory = require('./models/memory');
const Utils = require('./lib/utils');
const { OverwriteStrategies, WriteStrategies } = require('./lib/constants');

clear();
let m = new Memory({ size: 256, blockLength: 1 });
let v = new FullyAssociativeCache({
  size: 32,
  blockSize: 16,
  memory: m,
  canAccessMemory: false,
  title: 'Victim cache',
});

const params = {
  size: 128,
  blockSize: 16,
  memory: m,
  numberOfSets: 4,
  canAccessMemory: true,
  overwriteStrategy: OverwriteStrategies.LEAST_RECENTLY_USED,
  victimCache: v,
};

let a = new SetAssociativeCache(params);
a.outputBlocks();
a.victimCache.outputBlocks();

setInterval(function(){
  clear();
  a.read(new MemoryLocation({
    address: Utils.generateRandomValue(8),
  }));
  a.outputBlocks();
  a.victimCache.outputBlocks();
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
