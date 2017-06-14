'use strict';

class CacheBlock {
  constructor(params) {
    let { tag, data, valid, recentlyUsed } = params;

    this.tag = tag;
    this.data = data;
    this.valid = valid || 1;
    this.recentlyUsed = recentlyUsed || 1;
  }
}

module.exports = CacheBlock;
