'use strict';

class MemoryLocation {
  constructor(params) {
    let {address, offset, value} = params;

    this.address = address;
    this.offset = offset;
    this.value = value;
  }
}

module.exports =  MemoryLocation;
