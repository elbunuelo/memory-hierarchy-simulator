'use strict';

const Cache = require('./cache');
const CacheBlock = require('./cache_block');
const AsciiTable = require('ascii-table');
const { RANDOM, LEAST_RECENTLY_USED, FIFO } = require('../lib/constants');

class SetAssociativeCache extends Cache {
  constructor(params){
    let { size, blockSize, numberOfSets, overwriteStrategy } = params;

    super(params);

    this.numberOfSets = numberOfSets;
    this.setSize = this.numberOfBlocks/numberOfSets;
    this.indexSize = Math.log2(this.setSize);
    this.tagSize = this.blockAddressLength - this.indexSize;

    this.initSets = this.initSets.bind(this);
    this.findBlock = this.findBlock.bind(this);
    this.selectSet = this.selectSet.bind(this);
    this.getTag = this.getTag.bind(this);
    this.outputBlocks = this.outputBlocks.bind(this);
    this.getSetnumber = this.getSetNumber.bind(this);
    this.updateRecentlyUsed = this.updateRecentlyUsed.bind(this);
    this.getNumberOfRecentlyUsedBlocks = this.getNumberOfRecentlyUsedBlocks.bind(this);
    this.resetRecentlyUsedBits = this.resetRecentlyUsedBits.bind(this);
    this.getTableHeadings = this.getTableHeadings.bind(this);
    this.getTableRow = this.getTableRow.bind(this);

    this.initSets();
  }

  initSets() {
    this.sets = {};
    for (let setIndex = 0; setIndex < this.numberOfSets; setIndex++) {
      let set = {
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
    if (this.overwriteStrategy === LEAST_RECENTLY_USED) {
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
      this.write(memoryLocation);
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
    if (this.overwriteStrategy === LEAST_RECENTLY_USED) {
      headings.push('RECENTLY USED');
    }
    return headings;
  }

  getTableRow(set, block) {
    let row = [set, block.tag, block.valid, block.data];
    if (this.overwriteStrategy === LEAST_RECENTLY_USED) {
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

  write(memoryLocation) {
    const set = this.selectSet(memoryLocation);
    const tag = this.getTag(memoryLocation);

    let writeIndex = null;
    for ( let index = 0; index < this.setSize; index++) {
      const block = set.blocks[index];
      if (block.tag === tag) {
        writeIndex = index;
        break;
      }
    }

    if (writeIndex == null) {
      writeIndex = this.findIndexToWrite(set);
      set.writeOrder.push(writeIndex)
    } else {
      console.log('WRITE HIT');
    }

    let block = new CacheBlock({
      tag,
      data: memoryLocation.value,
    });

    set.blocks[writeIndex] = block;

    this.updateRecentlyUsed(block, set);
  }

  findIndexToWrite(set) {
    let indexToWrite = this.findEmptyBlockIndex(set);
    if (indexToWrite === null) {
      indexToWrite = this.findOverwriteBlockIndex(set);
    } else {
      console.log('EMPTY BLOCK FOUND');
    }
    return indexToWrite;
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
      case LEAST_RECENTLY_USED:
        console.log('OVERWRITING LEAST RECENTLY USED');
        index = this.findLeastRecentlyUsedBlockIndex(set);
        break;
      case FIFO:
        console.log('OVERWRITING OLDEST WRITTEN BLOCK');
        index = this.findFirstInFirstOutBlockIndex(set);
        break
      case RANDOM:
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
