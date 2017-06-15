class MemoryLocation {
  constructor(params) {
    const { address, offset, value } = params;

    this.address = address;
    this.offset = offset;
    this.value = value;
  }
}

module.exports = MemoryLocation;
