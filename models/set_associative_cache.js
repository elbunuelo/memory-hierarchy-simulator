'use strict';
const Cache = require('./cache');
const CacheBlock = require('./cache_block');
const AsciiTable = require('ascii-table');
const { LEAST_RECENTLY_USED } = require('../lib/constants');

class SetAssociativeCache extends Cache {
  constructor(params){
    let { size, blockSize, memoryLength, numberOfSets, overwriteStrategy } = params;

    super(params);

    this.numberOfSets = numberOfSets;
    this.setSize = this.numberOfBlocks/numberOfSets;
    this.indexSize = Math.log2(this.setSize);
    this.tagSize = this.blockAddressLength - this.indexSize;

    this.initBlocks = this.initBlocks.bind(this);
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

    this.initBlocks();
  }

  initBlocks() {
    this.blocks = {};
    for (let set = 0; set < this.numberOfSets; set++) {
      this.blocks[set] = [];
      for (let index = 0; index < this.setSize; index++) {
        this.blocks[set][index] = new CacheBlock({
          valid: "-",
          tag: "-".repeat(this.tagSize),
          data: "-".repeat(this.memoryLength * 8),
          recentlyUsed: "-"
        });
      }
    }
  }

  findBlock(memoryLocation) {
    const tag = this.getTag(memoryLocation);
    const set = this.selectSet(memoryLocation);

    let block = null;
    for (let i = 0; i < this.setSize; i++) {
      let candidate = set[i];
      if (candidate.valid === 0) {
        continue;
      }

      if (candidate.tag === tag) {
        block = candidate;
        break;
      }
    }

    this.updateRecentlyUsed(block, set);

    return block;
  }

  updateRecentlyUsed(block, set) {
    if (this.overwriteStrategy === LEAST_RECENTLY_USED) {
      block.recentlyUsed = 1;
      let recentlyUsedTotal = this.getNumberOfRecentlyUsedBlocks(set);

      if (recentlyUsedTotal == set.length) {
        this.resetRecentlyUsedBits(set, block);
      }
    }
  }

  getNumberOfRecentlyUsedBlocks(set) {
    let numberOfRecentlyUsedBlocks = 0;
    for (let i = 0; i < set.length; i++) {
      let block = set[i];
      if(block.recentlyUsed == 1) {
        numberOfRecentlyUsedBlocks++;
      }
    }
    return numberOfRecentlyUsedBlocks;
  }

  resetRecentlyUsedBits(set, block) {
    for(let i = 0; i < set.length; i++) {
      let candidateBlock = set[i];
      if(candidateBlock.tag !== block.tag) {
        candidateBlock.recentlyUsed = 0;
      }
    }
  }

  getCachedValue(memoryLocation) {
    const block = this.findBlock(memoryLocation);
    let value = null;
    if (block) {
      value = block.data;
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
    return this.blocks[setNumber];
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
        const block = this.blocks[set][index];
        let row = this.getTableRow(set, block);
        table.addRow.apply(table, row);
      }
    }

    console.log(table.toString());
  }

}

module.exports = SetAssociativeCache;
