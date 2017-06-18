const Operation = require('./operation');
const Memory = require('./memory');
const MemoryLocation = require('./memory_location');
const VictimCache = require('./victim_cache');
const WriteBuffer = require('./write_buffer');
const { CacheTypes, Highlights, OperationTypes } = require('../lib/constants');
const FullyAssociativeCache = require('./fully_associative_cache');
const SetAssociativeCache = require('./set_associative_cache');
const DirectMappedCache = require('./direct_mapped_cache');
const Display = require('../lib/display').getInstance();
const AsciiTable = require('ascii-table');

class Simulation {
  constructor(params) {
    const {
      memory,
      victimCache,
      writeBuffer,
      cache,
      operations,
      tickInterval,
    } = params;

    this.memory = new Memory(memory);
    cache.memory = this.memory;

    if (victimCache) {
      victimCache.memory = this.memory;
      this.victimCache = new VictimCache(victimCache);
      cache.victimCache = this.victimCache;
    }

    if (writeBuffer) {
      writeBuffer.memory = this.memory;
      this.writeBuffer = new WriteBuffer(writeBuffer);
      cache.writeBuffer = this.writeBuffer;
    }

    this.cache = this.initCache(cache);
    this.operations = operations.map(operation => new Operation(operation));
    this.currentOperationIndex = 0;
    this.tickInterval = tickInterval || 2000;

    this.initDisplay(params);
  }

  initDisplay(params) {
    const title = this.getTitleDisplayElement();
    const conventions = this.getConventionsDisplayElement();
    const details = this.getDetailsDisplayElement(params);

    Display.addElement(title);
    Display.addUnder(conventions, title);
    Display.addRightOf(details, title);
    Display.addUnder(this.cache, details);
    Display.addUnder(this, conventions);
    Display.addUnder(this.cache.stats, this);

    if (this.writeBuffer && this.victimCache) {
      Display.addRightOf(this.victimCache, this.cache);
      Display.addUnder(this.writeBuffer, this.victimCache);
      Display.addRightOf(this.memory, this.victimCache);
    } else if (this.writeBuffer) {
      Display.addUnder(this.writeBuffer, this.cache);
      Display.addRightOf(this.memory, details);
    } else if (this.victimCache) {
      Display.addRightOf(this.victimCache, details);
      Display.addRightOf(this.memory, this.victimCache);
    } else {
      Display.addRightOf(this.memory, details);
    }

    Display.flush();
  }

  getTitleDisplayElement() {
    const title = new AsciiTable();
    title.removeBorder()
      .addRow()
      .addRow('Memory hierarchy simulator')
      .addRow('Nicolas Arias')
      .addRow(' '.repeat(30));
    return title;
  }

  getDetailsDisplayElement(params) {
    const details = new AsciiTable(params.title);
    params.details.forEach((line) => { details.addRow(line); });

    return details;
  }

  getConventionsDisplayElement() {
    const conventions = new AsciiTable();
    conventions.addRow([Highlights.SELECT, 'Read hit / Memory read'])
      .addRow([Highlights.EVICT, 'Read miss / Block Evicted'])
      .addRow([Highlights.NEW, 'New Block'])
      .addRow([Highlights.CHANGED, 'Write hit / Memory Write']);
    return conventions;
  }

  toString() {
    const operations = new AsciiTable('Operations');
    this.operations.forEach((operation, index) => {
      let text = '';
      if (index === this.currentOperationIndex) {
        text += '> ';
      } else {
        text += '  ';
      }

      text += operation.toString();
      operations.addRow([text]);
    });
    return operations.toString();
  }

  initCache(params) {
    let cache = null;
    switch (params.type) {
      case CacheTypes.FULLY_ASSOCIATIVE:
        cache = new FullyAssociativeCache(params);
        break;
      case CacheTypes.SET_ASSOCIATIVE:
        cache = new SetAssociativeCache(params);
        break;
      case CacheTypes.DIRECT_MAPPED:
        cache = new DirectMappedCache(params);
        break;
      default:
        throw Error('INVALID CACHE TYPE');
    }

    return cache;
  }

  executeOperation(operation) {
    switch (operation.type) {
      case OperationTypes.READ:
        this.cache.read(new MemoryLocation({
          address: operation.address,
        }));
        break;
      case OperationTypes.WRITE:
        this.cache.write(new MemoryLocation({
          address: operation.address,
          value: operation.value,
        }));
        break;
      case OperationTypes.NOOP:
      default:
        if (this.writeBuffer) {
          this.writeBuffer.writeBack();
        }
        break;
    }
  }

  tick() {
    Display.refreshElement(this);
    Display.refreshElement(this.memory);
    const currentOperation = this.operations[this.currentOperationIndex];
    this.executeOperation(currentOperation);

    if (this.currentOperationIndex === this.operations.length - 1) {
      clearInterval(this.interval);
    } else {
      this.currentOperationIndex++;
    }
  }

  run() {
    this.interval = setInterval(() => this.tick(), this.tickInterval);
    this.tick();
  }
}

module.exports = Simulation;
