const AsciiTable = require('ascii-table');

const Cache = require('./cache');
const CacheBlock = require('./cache_block');
const MemoryLocation = require('./memory_location');

const {
  OverwriteStrategies,
  WriteStrategies,
  WriteMissStrategies,
  Highlights,
} = require('../lib/constants');
const Utils = require('../lib/utils');
const Logger = require('../lib/log').getInstance();
const Display = require('../lib/display').getInstance();

class SetAssociativeCache extends Cache {
  constructor(params) {
    super(params);

    const { numberOfSets } = params;

    this.numberOfSets = numberOfSets;
    this.setSize = this.numberOfBlocks / numberOfSets;
    this.indexSize = Math.log2(this.numberOfSets);
    this.tagSize = this.blockAddressLength - this.indexSize;
    this.highlightedBlocks = [];

    this.initSets();
  }

  initSets() {
    this.sets = [];
    for (let setIndex = 0; setIndex < this.numberOfSets; setIndex++) {
      const set = {
        index: setIndex,
        blocks: [],
        emptyBlocks: [],
        writeOrder: [],
      };

      for (let index = 0; index < this.setSize; index++) {
        set.blocks[index] = new CacheBlock({
          valid: '-',
          tag: '-'.repeat(this.tagSize),
          data: '-'.repeat(this.dataSize),
          recentlyUsed: '-',
        });
        set.emptyBlocks.push(index);
      }

      this.sets[setIndex] = set;
    }
  }

  findBlock(memoryLocation) {
    const tag = this.getTag(memoryLocation);
    const set = this.selectSet(memoryLocation);

    let block = null;
    for (let i = 0; i < this.setSize; i++) {
      const candidate = set.blocks[i];
      if (candidate.valid === 0) {
        continue;
      }

      if (candidate.tag === tag) {
        block = candidate;
        break;
      }
    }

    if (block) {
      this.updateRecentlyUsed(block, set);
    }

    return block;
  }

  highlight(block, highlight) {
    block.highlight = highlight;
    this.highlightedBlocks.push(block);
  }

  clearHighlights() {
    this.highlightedBlocks.forEach(block => block.resetHighlight());
    this.highlightedBlocks = [];
  }

  updateRecentlyUsed(block, set) {
    if (this.overwriteStrategy === OverwriteStrategies.LEAST_RECENTLY_USED) {
      block.recentlyUsed = 1;
      const recentlyUsedTotal = this.getNumberOfRecentlyUsedBlocks(set);

      if (recentlyUsedTotal === set.blocks.length) {
        this.resetRecentlyUsedBits(set, block);
      }
    }
  }

  getNumberOfRecentlyUsedBlocks(set) {
    let numberOfRecentlyUsedBlocks = 0;
    for (let i = 0; i < set.blocks.length; i++) {
      const block = set.blocks[i];
      if (block.recentlyUsed === 1) {
        numberOfRecentlyUsedBlocks++;
      }
    }

    return numberOfRecentlyUsedBlocks;
  }

  resetRecentlyUsedBits(set, block) {
    for (let i = 0; i < set.blocks.length; i++) {
      const candidateBlock = set.blocks[i];
      if (candidateBlock.tag !== block.tag) {
        candidateBlock.recentlyUsed = 0;
      }
    }
  }

  read(memoryLocation) {
    Logger.info(this.title, `READING MEMORY LOCATION ${memoryLocation.address}`);

    const block = this.findBlock(memoryLocation);
    const readMiss = !block;

    let victimLocation = null;
    let readLocation = null;

    if (!block && this.victimCache) {
      Logger.info(this.title, 'ATTEMPT READ FROM VICTIM CACHE');
      victimLocation = this.victimCache.read(memoryLocation);
    }

    if (victimLocation) {
      readLocation = victimLocation;
      Logger.info(this.title, 'VICTIM CACHE HIT');
    }

    if (!readMiss) {
      readLocation = new MemoryLocation({
        address: memoryLocation.address,
        data: block.data,
      });

      Logger.info(this.title, 'CACHE HIT');
      this.highlight(block, Highlights.SELECT);
    } else if (!victimLocation) {
      Logger.info(this.title, 'Read miss');
      memoryLocation = this.memory.getLocation(memoryLocation);
    }

    if (readMiss) {
      this.saveToCache(memoryLocation);
    }

    this.refreshDisplay();
    return memoryLocation;
  }

  getTag(memoryLocation) {
    const tag = memoryLocation.address.substr(this.indexSize);
    return tag;
  }

  getSetNumber(memoryLocation) {
    const setBinary = memoryLocation.address.substr(0, this.indexSize);
    return parseInt(setBinary, 2);
  }

  selectSet(memoryLocation) {
    const setNumber = this.getSetNumber(memoryLocation);
    return this.sets[setNumber];
  }

  getTableHeadings() {
    const headings = [' ', ' ', 'TAG', 'VALID', 'VALUE'];
    if (this.overwriteStrategy === OverwriteStrategies.LEAST_RECENTLY_USED) {
      headings.push('RECENTLY USED');
    }
    return headings;
  }

  getTableRow(set, block) {
    const row = [block.highlight, set, block.tag, block.valid, block.data];
    if (this.overwriteStrategy === OverwriteStrategies.LEAST_RECENTLY_USED) {
      row.push(block.recentlyUsed);
    }

    return row;
  }

  toString() {
    const table = new AsciiTable(this.title);
    const headings = this.getTableHeadings();
    table.setHeading(...headings);

    for (let set = 0; set < this.numberOfSets; set++) {
      for (let index = 0; index < this.setSize; index++) {
        const block = this.sets[set].blocks[index];
        const row = this.getTableRow(set, block);
        table.addRow(...row);
      }

      if (set < (this.numberOfSets - 1)) {
        table.addRow(' ');
      }
    }

    return table.toString();
  }

  saveToCache(memoryLocation) {
    const set = this.selectSet(memoryLocation);
    const tag = this.getTag(memoryLocation);

    const block = new CacheBlock({
      tag,
      data: memoryLocation.value,
    });

    let index = this.findEmptyBlockIndex(set);
    if (index === null) {
      Logger.info(this.title, 'NO EMPTY BLOCK FOUND, EVICTING');
      index = this.findOverwriteBlockIndex(set);
      this.evictBlock(set, index);
      this.highlight(block, Highlights.EVICT);
    } else {
      Logger.info(this.title, 'EMPTY BLOCK FOUND');
      this.highlight(block, Highlights.NEW);
    }

    if (this.overwriteStrategy === OverwriteStrategies.FIFO) {
      set.writeOrder.push(index);
    }

    set.blocks[index] = block;
    this.updateRecentlyUsed(block, set);
  }

  write(memoryLocation) {
    Logger.info(this.title, `WRITING TO MEMORY LOCATION ${memoryLocation.address}`);
    const set = this.selectSet(memoryLocation);
    const tag = this.getTag(memoryLocation);

    let block = null;
    let writeHit = false;
    for (let index = 0; index < this.setSize; index++) {
      block = set.blocks[index];
      if (block.tag === tag) {
        writeHit = true;
        break;
      }
    }

    if (writeHit) {
      Logger.info(this.title, 'CACHE WRITE HIT');
      this.handleCacheWriteHit(block, memoryLocation);
      this.highlight(block, Highlights.CHANGED);
    } else {
      Logger.info(this.title, 'CACHE WRITE MISS');
      this.handleCacheWriteMiss(memoryLocation);
    }

    this.refreshDisplay();
  }

  handleCacheWriteHit(block, memoryLocation) {
    block.data = memoryLocation.value;
    if (this.writeStrategy === WriteStrategies.WRITE_BACK) {
      block.dirty = 1;
    } else if (this.writeStrategy === WriteStrategies.WRITE_THROUGH) {
      this.writeToMemory(memoryLocation);
    }
  }

  handleCacheWriteMiss(memoryLocation) {
    let willWriteToMemory = false;
    let dirty = 0;

    if (this.writeStrategy === WriteStrategies.WRITE_THROUGH) {
      willWriteToMemory = true;
    } else if (this.writeStrategy === WriteStrategies.WRITE_BACK) {
      dirty = 1;
    }

    if (this.writeMissStrategy === WriteMissStrategies.NO_WRITE_ALLOCATE) {
      willWriteToMemory = true;
    } else if (this.writeMissStrategy === WriteMissStrategies.WRITE_ALLOCATE) {
      this.saveToCache(memoryLocation);
      const block = this.findBlock(memoryLocation);
      block.dirty = dirty;
    }

    if (willWriteToMemory) {
      this.writeToMemory(memoryLocation);
    }
  }

  evictBlock(set, index) {
    const block = set.blocks[index];
    if (block.valid === 0) {
      return;
    }

    const indexBinary = Utils.toBinary(set.index, this.indexSize);
    const address = indexBinary + block.tag;
    Logger.info(this.title, `EVICTING BLOCK ${block.tag} FROM SET ${set.index}`);
    const memoryLocation = new MemoryLocation({
      address,
      value: block.data,
    });

    if (this.victimCache) {
      this.victimCache.write(memoryLocation);
    }

    if (block.dirty === 1) {
      this.writeToMemory(memoryLocation);
    }
  }

  writeToMemory(memoryLocation) {
    if (this.writeBuffer) {
      this.writeBuffer.store(memoryLocation);
    } else {
      this.memory.write(memoryLocation);
    }
  }

  findEmptyBlockIndex(set) {
    let emptyBlockIndex = null;
    if (set.emptyBlocks.length) {
      const randomIndex = Math.floor(Math.random() * set.emptyBlocks.length);
      emptyBlockIndex = set.emptyBlocks.splice(randomIndex, 1).pop();
    }
    return emptyBlockIndex;
  }

  findOverwriteBlockIndex(set) {
    let index = null;
    switch (this.overwriteStrategy) {
      case OverwriteStrategies.LEAST_RECENTLY_USED:
        Logger.info(this.title, 'OVERWRITING LEAST RECENTLY USED');
        index = this.findLeastRecentlyUsedBlockIndex(set);
        break;
      case OverwriteStrategies.FIFO:
        Logger.info(this.title, 'OVERWRITING OLDEST WRITTEN BLOCK');
        index = this.findFirstInFirstOutBlockIndex(set);
        break;
      case OverwriteStrategies.RANDOM:
      default:
        Logger.info(this.title, 'OVERWRITING BLOCK AT RANDOM');
        index = this.findRandomBlockIndex();
        break;
    }

    return index;
  }

  findRandomBlockIndex() {
    const index = Math.floor(Math.random() * this.setSize);
    return index;
  }

  findLeastRecentlyUsedBlockIndex(set) {
    const blockIndexes = [];
    for (let i = 0; i < set.blocks.length; i++) {
      const block = set.blocks[i];
      if (block.recentlyUsed === 0) {
        blockIndexes.push(i);
      }
    }

    const randomIndex = Math.floor(Math.random() * blockIndexes.length);
    return blockIndexes[randomIndex];
  }

  findFirstInFirstOutBlockIndex(set) {
    return set.writeOrder.shift();
  }

  refreshDisplay() {
    Display.refreshElement(this);
    this.clearHighlights();
  }
}

module.exports = SetAssociativeCache;
