'use strict';

const SetAssociativeCache = require('./set_associative_cache');
const AsciiTable = require('ascii-table');
const CacheBlock = require('./cache_block');
const { RANDOM, LEAST_RECENTLY_USED, FIFO } = require('../lib/constants');

class FullyAssociativeCache extends SetAssociativeCache {
  constructor (params) {
    super(Object.assign(params, { numberOfSets: 1 }));
    this.emptyBlocks = this.initEmptyBlocks();
    this.writeOrder = [];

    this.outputBlocks = this.outputBlocks.bind(this);
    this.write = this.write.bind(this);
    this.findIndexToWrite = this.findIndexToWrite.bind(this);
    this.findEmptyBlockIndex = this.findEmptyBlockIndex.bind(this);
    this.initEmptyBlocks = this.initEmptyBlocks.bind(this);
    this.findOverwriteBlockIndex = this.findOverwriteBlockIndex.bind(this);
    this.findRandomBlockIndex = this.findRandomBlockIndex.bind(this);
    this.findLeastRecentlyUsedBlockIndex = this.findLeastRecentlyUsedBlockIndex.bind(this);
    this.findFirstInFirstOutBlockIndex = this.findFirstInFirstOutBlockIndex.bind(this);
  }

  initEmptyBlocks() {
    let emptyBlocks = [];
    for (let index = 0; index < this.setSize; index++) {
      emptyBlocks.unshift(index);
    }

    return emptyBlocks;
  }

  write(memoryLocation) {
    const tag = this.getTag(memoryLocation);

    let writeIndex = null;
    for ( let index = 0; index < this.setSize; index++) {
      const block = this.blocks[0][index];
      if (block.tag === tag) {
        writeIndex = index;
        break;
      }
    }

    if (writeIndex == null) {
      writeIndex = this.findIndexToWrite();
      this.writeOrder.push(writeIndex);
    } else {
      console.log('WRITE HIT');
    }

    let set = this.blocks[0];
    let block = new CacheBlock({
      tag,
      data: memoryLocation.value,
    });

    set[writeIndex] = block;

    this.updateRecentlyUsed(block, set);
  }

  findIndexToWrite() {
    let indexToWrite = this.findEmptyBlockIndex();
    if (indexToWrite === null) {
      indexToWrite = this.findOverwriteBlockIndex();
    } else {
      console.log('EMPTY BLOCK FOUND');
    }
    return indexToWrite;
  }

  findEmptyBlockIndex() {
    let emptyBlockIndex = null;
    if (this.emptyBlocks.length) {
      let randomIndex = Math.floor(Math.random() * this.emptyBlocks.length);
      emptyBlockIndex = this.emptyBlocks.splice(randomIndex, 1).pop();
    }
    return emptyBlockIndex;
  }

  findOverwriteBlockIndex() {
    let index = null;
    switch(this.overwriteStrategy) {
      case LEAST_RECENTLY_USED:
        console.log('OVERWRITING LEAST RECENTLY USED');
        index = this.findLeastRecentlyUsedBlockIndex();
        break;
      case FIFO:
        console.log('OVERWRITING OLDEST WRITTEN BLOCK');
        index = this.findFirstInFirstOutBlockIndex();
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

  findLeastRecentlyUsedBlockIndex() {
    const set = this.blocks[0];
    const blockIndexes = []
    for (let i = 0; i < set.length; i++) {
      let block = set[i];
      if (block.recentlyUsed === 0) {
        blockIndexes.push(i);
      }
    }

    let randomIndex = Math.floor(Math.random() * blockIndexes.length);
    return blockIndexes[randomIndex];
  }

  findFirstInFirstOutBlockIndex() {
    return this.writeOrder.shift();
  }

  getTableHeadings() {
    let headings = super.getTableHeadings();
    headings.shift();

    return headings;
  }

  getTableRow(set, block) {
    let row = super.getTableRow(set,block);
    row.shift();

    return row;
  }
}

module.exports = FullyAssociativeCache;
