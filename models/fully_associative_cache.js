'use strict';

const SetAssociativeCache = require('./set_associative_cache');
const AsciiTable = require('ascii-table');
const CacheBlock = require('./cache_block');

class FullyAssociativeCache extends SetAssociativeCache {
  constructor (params) {
    super(Object.assign(params, { numberOfSets: 1 }));

    this.outputBlocks = this.outputBlocks.bind(this);
    this.write = this.write.bind(this);
    this.findIndexToWrite = this.findIndexToWrite.bind(this);
    this.findEmptyBlockIndex = this.findEmptyBlockIndex.bind(this);
    this.findOverwriteBlockIndex = this.findOverwriteBlockIndex.bind(this);
    this.findRandomBlockIndex = this.findRandomBlockIndex.bind(this);
    this.findLeastRecentlyUsedBlockIndex = this.findLeastRecentlyUsedBlockIndex.bind(this);
    this.findFirstInFirstOutBlockIndex = this.findFirstInFirstOutBlockIndex.bind(this);
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
