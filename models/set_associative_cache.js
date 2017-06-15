'use strict';

const Cache = require('./cache');
const CacheBlock = require('./cache_block');
const AsciiTable = require('ascii-table');
const {
  OverwriteStrategies,
  WriteHitStrategies,
  WriteMissStrategies
} = require('../lib/constants');

class SetAssociativeCache extends Cache {
  constructor(params){
    super(params);

    let { size, blockSize, numberOfSets } = params;

    this.numberOfSets = numberOfSets;
    this.setSize = this.numberOfBlocks/numberOfSets;
    this.indexSize = Math.log2(this.setSize);
    this.tagSize = this.blockAddressLength - this.indexSize;

    this.initSets();
  }

  initSets() {
    this.sets = {};
    for (let setIndex = 0; setIndex < this.numberOfSets; setIndex++) {
      let set = {
        index: setIndex,
        blocks: [],
        emptyBlocks: [],
        writeOrder: []
      };

      for (let index = 0; index < this.setSize; index++) {
        set.blocks[index] = new CacheBlock({
          valid: "-",
          tag: "-".repeat(this.tagSize),
          data: "-".repeat(this.memory.blockLength * 8),
          recentlyUsed: "-"
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
      let candidate = set.blocks[i];
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

  updateRecentlyUsed(block, set) {
    if (this.overwriteStrategy === OverwriteStrategies.LEAST_RECENTLY_USED) {
      block.recentlyUsed = 1;
      let recentlyUsedTotal = this.getNumberOfRecentlyUsedBlocks(set);

      if (recentlyUsedTotal == set.blocks.length) {
        this.resetRecentlyUsedBits(set, block);
      }
    }
  }

  getNumberOfRecentlyUsedBlocks(set) {
    let numberOfRecentlyUsedBlocks = 0;
    for (let i = 0; i < set.blocks.length; i++) {
      let block = set.blocks[i];
      if(block.recentlyUsed == 1) {
        numberOfRecentlyUsedBlocks++;
      }
    }
    return numberOfRecentlyUsedBlocks;
  }

  resetRecentlyUsedBits(set, block) {
    for(let i = 0; i < set.blocks.length; i++) {
      let candidateBlock = set.blocks[i];
      if(candidateBlock.tag !== block.tag) {
        candidateBlock.recentlyUsed = 0;
      }
    }
  }

  read(memoryLocation) {
    const block = this.findBlock(memoryLocation);
    let value = null;
    if (block) {
      value = block.data;
      console.log('CACHE READ HIT')
    } else {
      console.log('CACHE READ MISS');
      memoryLocation = this.memory.getLocation(memoryLocation);
      value = memoryLocation.value;
      this.saveToCache(memoryLocation);
    }

    return value;
  }

  getTag(memoryLocation) {
    const tag = memoryLocation.address.substr(0, this.tagSize);
    return tag;
  }

  getSetNumber(memoryLocation) {
    const integerValue = parseInt(memoryLocation.address, 2);
    const setNumber = integerValue % this.numberOfSets;
    return setNumber;
  }

  selectSet(memoryLocation) {
    const setNumber = this.getSetNumber(memoryLocation);
    return this.sets[setNumber];
  }

  getTableHeadings() {
    let headings = [' ', 'TAG', 'VALID', 'VALUE'];
    if (this.overwriteStrategy === OverwriteStrategies.LEAST_RECENTLY_USED) {
      headings.push('RECENTLY USED');
    }
    return headings;
  }

  getTableRow(set, block) {
    let row = [set, block.tag, block.valid, block.data];
    if (this.overwriteStrategy === OverwriteStrategies.LEAST_RECENTLY_USED) {
      row.push(block.recentlyUsed);
    }
    return row;
  }

  outputBlocks() {
    let table = new AsciiTable('Cache status')
    let headings = this.getTableHeadings();
    table.setHeading.apply(table, headings);
    for (let set = 0; set < this.numberOfSets; set++) {
      for (let index = 0; index < this.setSize; index++) {
        const block = this.sets[set].blocks[index];
        let row = this.getTableRow(set, block);
        table.addRow.apply(table, row);
      }
      if(set < (this.numberOfSets - 1)) {
        table.addRow(' ');
      }
    }

    console.log(table.toString());
  }

  saveToCache(memoryLocation) {
    const set = this.selectSet(memoryLocation);
    const tag = this.getTag(memoryLocation);

    let block = new CacheBlock({
      tag,
      data: memoryLocation.value,
    });

    let index = this.findEmptyBlockIndex(set);
    if (index === null) {
      index = this.findOverwriteBlockIndex(set);
      console.log('EVICT BLOCK');
      this.evictBlock(set, index);
    }

    set.writeOrder.push(index)
    set.blocks[index] = block;

    this.updateRecentlyUsed(block, set);
  }

  write(memoryLocation) {
    const set = this.selectSet(memoryLocation);
    const tag = this.getTag(memoryLocation);

    let writeIndex = null;
    let block = null;
    for (let index = 0; index < this.setSize; index++) {
      block = set.blocks[index];
      if (block.tag === tag) {
        writeIndex = index;
        break;
      }
    }

    if (block) {
      this.handleCacheWriteHit(block, memoryLocation);
    } else {
      this.handleCacheWriteMiss(memoryLocation);
    }
  }

  handleCachWriteHit(block, memoryLocation) {
    block.data = memoryLocation.value;
    if (this.writeHitStrategy = WriteHitStrategies.WRITE_BACK) {
      block.dirty = 1;
    } else {
     this.memory.write(memoryLocation);
    }
  }

  handleCachWriteMiss(memoryLocation) {
    if (this.writeMissStrategy = WriteHitStrategies.WRITE_ALLOCATE) {
      this.memory.write(memoryLocation);
    }
  }

  evictBlock(set, index) {
    let block = set.blocks[index];
    if (this.writeStrategy = WriteHitStrategies.WRITEBACK && block.dirty === 1) {
      let indexBinary = Utils.toBinary(set.index, indexSize);
      let address = indexBinary + block.tag;
      this.memory.write(
        new MemoryLocation({ address, value: block.data })
      );
    }
  }

  findEmptyBlockIndex(set) {
    let emptyBlockIndex = null;
    if (set.emptyBlocks.length) {
      let randomIndex = Math.floor(Math.random() * set.emptyBlocks.length);
      emptyBlockIndex = set.emptyBlocks.splice(randomIndex, 1).pop();
    }
    return emptyBlockIndex;
  }

  findOverwriteBlockIndex(set) {
    let index = null;
    switch(this.overwriteStrategy) {
      case OverwriteStrategies.LEAST_RECENTLY_USED:
        console.log('OVERWRITING LEAST RECENTLY USED');
        index = this.findLeastRecentlyUsedBlockIndex(set);
        break;
      case OverwriteStrategies.FIFO:
        console.log('OVERWRITING OLDEST WRITTEN BLOCK');
        index = this.findFirstInFirstOutBlockIndex(set);
        break
      case OverwriteStrategies.RANDOM:
      default:
        console.log('OVERWRITING BLOCK AT RANDOM');
        index = this.findRandomBlockIndex();
        break;
    }

    return index;
  }

  findRandomBlockIndex() {
    let index = Math.floor(Math.random() * this.setSize);
    return index;
  }

  findLeastRecentlyUsedBlockIndex(set) {
    const blockIndexes = []
    for (let i = 0; i < set.blocks.length; i++) {
      let block = set.blocks[i];
      if (block.recentlyUsed === 0) {
        blockIndexes.push(i);
      }
    }

    let randomIndex = Math.floor(Math.random() * blockIndexes.length);
    return blockIndexes[randomIndex];
  }

  findFirstInFirstOutBlockIndex(set) {
    return set.writeOrder.shift();
  }

}

module.exports = SetAssociativeCache;
