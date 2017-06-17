class MemoryLocation {
  constructor(params) {
    const { address, value } = params;

    this.address = address;
    this.value = value;
    this.highlight = '  ';
  }

  resetHighlight() {
    this.highlight = '  ';
  }
}

module.exports = MemoryLocation;
