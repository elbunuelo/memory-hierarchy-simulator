class CacheBlock {
  constructor(params) {
    const { tag, data, valid, recentlyUsed, dirty } = params;

    this.tag = tag;
    this.data = data;
    this.valid = valid || 1;
    this.recentlyUsed = recentlyUsed || 1;
    this.dirty = dirty || 0;
  }
}

module.exports = CacheBlock;
