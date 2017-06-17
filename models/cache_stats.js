const Display = require('../lib/display').getInstance();
const AsciiTable = require('ascii-table');

class CacheStats {
  constructor() {
    this.reads = 0;
    this.writes = 0;
    this.readHits = 0;
    this.writeHits = 0;
  }

  addRead() {
    this.reads++;
    Display.refreshElement(this);
  }

  addWrite() {
    this.writes++;
    Display.refreshElement(this);
  }

  addReadHit() {
    this.readHits++;
    Display.refreshElement(this);
  }

  addWriteHit() {
    this.writeHits++;
    Display.refreshElement(this);
  }

  toString() {
    const table = new AsciiTable('Statistics');
    const readHits = this.reads !== 0 ? (this.readHits / this.reads) * 100 : 0;
    const writeHits = this.writes !== 0 ? (this.writeHits / this.writes) * 100 : 0;

    let readHitsPercentage = `${readHits.toFixed(2)}%`;
    if (readHits < 10) {
      readHitsPercentage = `0${readHitsPercentage}`;
    }

    let writeHitsPercentage = `${writeHits.toFixed(2)}%`;
    if (writeHits < 10) {
      writeHitsPercentage = `0${writeHitsPercentage}`;
    }
    table.addRow(['Read Hits', readHitsPercentage])
      .addRow(['Write Hits', writeHitsPercentage]);

    return table.toString();
  }
}

module.exports = CacheStats;
