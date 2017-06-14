'use strict';

let Utils = {
  toBinary: function(number, length) {
    const binary = number.toString(2);
    const paddingSize = length - binary.length;
    let padding = "";
    if (paddingSize > 0) {
      padding = "0".repeat(paddingSize);
    }

    return padding + binary;
  },

  generateRandomValue(length) {
    const max = Math.pow(2, length);
    const value = Math.floor(Math.random() * max);
    return Utils.toBinary(value, length);
  }
}

module.exports = Utils;
