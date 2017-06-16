const clear = require('clear');
const WindowSize = require('window-size');

const PADDING_CHAR = ' ';

class Display {
  constructor() {
    this.resetState();
  }

  resetState() {
    this.display = [];
    for (let i = 0; i < WindowSize.height; i++) {
      this.display[i] = [];
      for (let j = 0; j < WindowSize.width; j++) {
        this.display[i][j] = PADDING_CHAR;
      }
    }
    this.metadata = [];
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Display();
    }
    return this.instance;
  }

  add(lines, x, y) {
    let writeX = x;
    let writeY = y;

    lines.forEach((line, lineIndex) => {
      writeX = x + lineIndex;
      line.split('').forEach((c, charIndex) => {
        writeY = y + charIndex;
        if (writeX < WindowSize.height && writeY < WindowSize.width) {
          this.display[writeX][writeY] = c;
        }
      });
    });

    const id = this.metadata.length;

    this.metadata[id] = {
      startX: x,
      startY: y,
      endX: writeX,
      endY: writeY,
    };

    return id;
  }

  addElement(element) {
    let newId = -1;
    if (this.metadata.length === 0) {
      newId = this.add(this.getLines(element), 0, 0);
    }
    return newId;
  }

  addUnder(element, id) {
    const overElement = this.metadata[id];
    let newId = -1;
    if (overElement) {
      newId = this.add(
        this.getLines(element),
        overElement.endX + 1,
        overElement.startY,
      );
    }
    return newId;
  }

  addRightOf(element, id) {
    const leftElement = this.metadata[id];
    let newId = -1;
    if (leftElement) {
      newId = this.add(
        this.getLines(element),
        leftElement.startX,
        leftElement.endY + 2,
      );
    }
    return newId;
  }

  getLines(element) {
    return element.toString().split('\n');
  }

  flush() {
    clear();
    this.display.forEach((line, index) => {
      process.stdout.write(line.join(''));
      if (index < this.display.length - 1) {
        process.stdout.write('\n');
      }
    });
    this.resetState();
  }
}

module.exports = Display;
