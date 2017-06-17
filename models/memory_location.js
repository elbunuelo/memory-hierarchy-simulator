class MemoryLocation {
  constructor(params) {
    const { address, offset, value } = params;

    this.address = address;
    this.offset = offset;
    this.value = value;
    this.highlight = '  ';
  }

  resetHighlight() {
    this.highlight = '  ';
  }
}

module.exports = MemoryLocation;
