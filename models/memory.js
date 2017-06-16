const Utils = require('../lib/utils');
const AsciiTable = require('ascii-table');
const MemoryLocation = require('./memory_location');

class Memory {
  constructor(params) {
    const { pageSize, blockLength, numberOfPages } = params;
    this.pageSize = pageSize;
    this.numberOfPages = numberOfPages;
    this.blockLength = blockLength;
    this.pages = [];
    this.currentPage = 0;

    this.initContents();
  }

  getSize() {
    return this.pageSize * this.numberOfPages;
  }

  initContents() {
    const numberOfBlocks = this.getSize() / this.blockLength;
    const addressSize = Math.log2(numberOfBlocks);
    for (let pageIndex = 0; pageIndex < this.numberOfPages; pageIndex++) {
      const page = [];
      for (let i = 0; i < numberOfBlocks; i++) {
        const address = Utils.toBinary(i, addressSize);
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

  outputBlocks() {
    const table = new AsciiTable(`Memory Page ${this.currentPage}`);
    table.setHeading('ADDRESS', 'VALUE');
    const page = this.pages[this.currentPage];
    page.forEach((location) => {
      table.addRow(location.address, location.value);
    });

    console.log(table.toString());
  }

  getLocation(memoryLocation) {
    const { physicalAddress, page } = this.getPhysicalAddress(memoryLocation);
    return page[physicalAddress];
  }

  write(memoryLocation) {
    const { physicalAddress, page } = this.getPhysicalAddress(memoryLocation);
    page[physicalAddress] = memoryLocation;
  }

  getPhysicalAddress(memoryLocation) {
    const virtualAddress = parseInt(memoryLocation.address, 2);
    const pageNumber = Math.floor(virtualAddress / this.pageSize);
    const physicalAddress = virtualAddress % this.pageSize;
    const page = this.pages[pageNumber];

    if (pageNumber !== this.currentPage) {
      this.swapPages(pageNumber);
    }

    return { physicalAddress, page };
  }

  swapPages(pageNumber) {
    console.log('SWAPPING PAGES');
    this.currentPage = pageNumber;
  }
}

module.exports = Memory;
