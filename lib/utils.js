class Utils {
  static toBinary(number, length) {
    const binary = number.toString(2);
    const paddingSize = length - binary.length;
    let padding = '';
    if (paddingSize > 0) {
      padding = '0'.repeat(paddingSize);
    }

    return padding + binary;
  }

  static generateRandomValue(length) {
    const max = 2 ** length;
    const value = Math.floor(Math.random() * max);
    return Utils.toBinary(value, length);
  }
}

module.exports = Utils;
