'use strict';

const SetAssociativeCache = require('./set_associative_cache');
const AsciiTable = require('ascii-table');
const CacheBlock = require('./cache_block');

class FullyAssociativeCache extends SetAssociativeCache {
  constructor (params) {
    super(Object.assign(params, { numberOfSets: 1 }));
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
