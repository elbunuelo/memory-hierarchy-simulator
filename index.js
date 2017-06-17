const FullyAssociativeCache = require('./models/fully_associative_cache');
const DirectMappedCache = require('./models/direct_mapped_cache');
const SetAssociativeCache = require('./models/set_associative_cache');
const VictimCache = require('./models/victim_cache');
const WriteBuffer = require('./models/write_buffer');
const MemoryLocation = require('./models/memory_location');
const Memory = require('./models/memory');
const Utils = require('./lib/utils');
const Display = require('./lib/display').getInstance();
const AsciiTable = require('ascii-table');

const { Highlights } = require('./lib/constants');

const { OverwriteStrategies, WriteStrategies, WriteMissStrategies } = require('./lib/constants');

let m = new Memory({
  pageSize: 32,
  numberOfPages: 2,
  blockLength: 1,
});

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
  title: 'Write Buffer',
});

const params = {
  size: 128,
  blockSize: 16,
  memory: m,
  canAccessMemory: true,
  overwriteStrategy: OverwriteStrategies.RANDOM,
  writeStrategy: WriteStrategies.WRITE_THROUGH,
  writeMissStrategy: WriteMissStrategies.NO_WRITE_ALLOCATE,
  victimCache: v,
  writeBuffer: wb,
};

const title = new AsciiTable();
title.removeBorder()
  .addRow()
  .addRow('Memory hierarchy simulator')
  .addRow('Nicolas Arias')
  .addRow();

const conventions = new AsciiTable();
conventions.addRow([Highlights.SELECT, 'Read hit/Memory read'])
  .addRow([Highlights.EVICT, 'Block Evicted'])
  .addRow([Highlights.NEW, 'New Block'])
  .addRow([Highlights.CHANGED, 'Write hit/Memory Write']);

const currentOperation = new AsciiTable('Current Operation');
currentOperation.addRow('Starting Simulation');

const simulationParameters = new AsciiTable('Parameters');
simulationParameters.addRow()


let a = new DirectMappedCache(params);
Display.addElement(title);
Display.addUnder(conventions, title);
Display.addUnder(currentOperation, conventions);
Display.addRightOf(a, title);
Display.addRightOf(a.victimCache, a);
Display.addUnder(a.writeBuffer, a.victimCache);
Display.addRightOf(m, a.victimCache);

setInterval(() => {
  const address = Utils.generateRandomValue(6);
  a.read(new MemoryLocation({ address }));
  currentOperation.clearRows();
  currentOperation.addRow([`Read location ${address}`]);
  Display.refreshElement(currentOperation);
}, 1000);
