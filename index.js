'use strict';

const clear = require('clear');
const FullyAssociativeCache = require('./models/fully_associative_cache');
const DirectMappedCache = require('./models/direct_mapped_cache');
const SetAssociativeCache = require('./models/set_associative_cache');
const VictimCache = require('./models/victim_cache');
const WriteBuffer = require('./models/write_buffer');
const MemoryLocation = require('./models/memory_location');
const Memory = require('./models/memory');
const Utils = require('./lib/utils');
const { OverwriteStrategies, WriteStrategies, WriteMissStrategies } = require('./lib/constants');

clear();
let m = new Memory({ pageSize: 128, numberOfPages: 2, blockLength: 1 });
let v = new VictimCache({
  size: 32,
  blockSize: 16,
  memory: m,
  title: 'Victim cache',
});

let wb = new WriteBuffer({
  size: 32,
  blockSize: 16,
  memory: m,
  title: 'Write Buffer'
});

const params = {
  size: 128,
  blockSize: 16,
  memory: m,
  numberOfSets: 4,
  canAccessMemory: true,
  overwriteStrategy: OverwriteStrategies.LEAST_RECENTLY_USED,
  writeStrategy: WriteStrategies.WRITE_THROUGH,
  writeMissStrategy: WriteMissStrategies.NO_WRITE_ALLOCATE,
  //victimCache: v,
  //writeBuffer: wb,
};

let a = new SetAssociativeCache(params);
a.outputBlocks();

setInterval(function(){
  clear();
  a.read(new MemoryLocation({
    address: Utils.generateRandomValue(8),
  }));
  a.outputBlocks();
}, 10);
