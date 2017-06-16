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

  selectSet() {
    let selectableSets = this.sets;

    const emptySets = this.sets.filter(set => set.emptyBlocks.length !== 0);

    if (emptySets.length !== 0) {
      selectableSets = emptySets;
    }

    const randomIndex = Math.floor(Math.random() * selectableSets.length);
    return selectableSets[randomIndex];
  }
}

module.exports = FullyAssociativeCache;
