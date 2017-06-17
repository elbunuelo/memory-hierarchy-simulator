const Utils = require('../lib/utils');
const AsciiTable = require('ascii-table');
const MemoryLocation = require('./memory_location');
const Logger = require('../lib/log').getInstance();
const { Highlights } = require('../lib/constants');
const Display = require('../lib/display').getInstance();

class Memory {
  constructor(params) {
    const { pageSize, blockLength, numberOfPages, events } = params;
    this.pageSize = pageSize;
    this.numberOfPages = numberOfPages;
    this.blockLength = blockLength;
    this.pages = [];
    this.currentPage = 0;
    this.mostRecentlyAccessedAddress = 0;
    this.highlightedBlocks = [];
    this.events = events;

    this.initContents();
  }

  getSize() {
    return this.pageSize * this.numberOfPages;
  }

  initContents() {
    const numberOfBlocks = this.pageSize / this.blockLength;
    const addressSize = Math.log2(this.getSize());
    for (let pageIndex = 0; pageIndex < this.numberOfPages; pageIndex++) {
      const page = [];
      for (let i = 0; i < numberOfBlocks; i++) {
        const virtualIndex = i + (pageIndex * this.pageSize);
        const address = Utils.toBinary(virtualIndex, addressSize);
        const value = this.generateRandomValue();
        page.push(new MemoryLocation({ address, value }));
      }
      this.pages.push(page);
    }
  }

  generateRandomValue() {
    const length = 8 * this.blockLength;
    return Utils.generateRandomValue(length);
  }

  toString(rows) {
    const start = rows * Math.floor(this.mostRecentlyAccessedAddress / rows);
    const end = Math.min(start + rows, this.pageSize / this.blockLength);


    const table = new AsciiTable(`Memory Page ${this.currentPage}`);
    table.setHeading(' ', 'ADDRESS', 'VALUE');
    const page = this.pages[this.currentPage];

    for (let i = start; i < end; i++) {
      const location = page[i];
      table.addRow(location.highlight, location.address, location.value);
    }

    return table.toString();
  }

  getLocation(memoryLocation) {
    const { physicalAddress, page } = this.getPhysicalAddress(memoryLocation);

    const physicalMemoryLocation = page[physicalAddress];
    this.highlight(physicalMemoryLocation, Highlights.SELECT);
    this.refreshDisplay();

    memoryLocation.value = physicalMemoryLocation.value;
    return memoryLocation;
  }

  write(memoryLocation) {
    const { physicalAddress, page } = this.getPhysicalAddress(memoryLocation);
    this.highlight(memoryLocation, Highlights.WRITE);
    page[physicalAddress] = memoryLocation;
    this.refreshDisplay();
  }

  getPhysicalAddress(memoryLocation) {
    const virtualAddress = parseInt(memoryLocation.address, 2);
    const pageNumber = Math.floor(virtualAddress / this.pageSize);
    const physicalAddress = virtualAddress % this.pageSize;
    const page = this.pages[pageNumber];

    if (pageNumber !== this.currentPage) {
      this.swapPages(pageNumber);
    }

    this.mostRecentlyAccessedAddress = physicalAddress;
    return { physicalAddress, page };
  }

  swapPages(pageNumber) {
    Logger.info('MEMORY', `SWAPPING PAGES ${pageNumber}`);
    this.currentPage = pageNumber;
  }

  highlight(memoryLocation, highlight) {
    memoryLocation.highlight = highlight;
    this.highlightedBlocks.push(memoryLocation);
  }

  refreshDisplay() {
    Display.refreshElement(this);
    this.clearHighlights();
  }

  clearHighlights() {
    this.highlightedBlocks.forEach(memoryLocation => memoryLocation.resetHighlight());
    this.highlightedBlocks = [];
  }
}

module.exports = Memory;
