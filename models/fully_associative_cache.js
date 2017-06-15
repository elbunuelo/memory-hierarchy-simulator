const SetAssociativeCache = require('./set_associative_cache');

class FullyAssociativeCache extends SetAssociativeCache {
  constructor(params) {
    const { size, blockSize } = params;
    const numberOfBlocks = size / blockSize;
    super(Object.assign(params, { numberOfSets: numberOfBlocks }));
  }

  getTableHeadings() {
    const headings = super.getTableHeadings();
    headings.shift();

    return headings;
  }

  getTableRow(set, block) {
    const row = super.getTableRow(set, block);
    row.shift();

    return row;
  }
}

module.exports = FullyAssociativeCache;
