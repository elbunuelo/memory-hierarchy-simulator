const clear = require('clear');
const WindowSize = require('window-size');

const PADDING_CHAR = ' ';

class Display {
  constructor() {
    this.resetState();
    this.elements = [];
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Display();
    }
    return this.instance;
  }

  resetState() {
    this.display = [];
    for (let i = 0; i < WindowSize.height; i++) {
      this.display[i] = [];
      for (let j = 0; j < WindowSize.width; j++) {
        this.display[i][j] = PADDING_CHAR;
      }
    }
  }

  add(element, x, y) {
    let writeX = x;
    let writeY = y;

    const lines = this.getLines(element);

    lines.forEach((line, lineIndex) => {
      writeX = x + lineIndex;
      line.split('').forEach((c, charIndex) => {
        writeY = y + charIndex;
        if (writeX < WindowSize.height && writeY < WindowSize.width) {
          this.display[writeX][writeY] = c;
        }
      });
    });

    element.displayData = {
      startX: x,
      startY: y,
      endX: writeX,
      endY: writeY,
    };

    this.elements.push(element);
  }

  addElement(element) {
    if (this.elements.length === 0) {
      this.add(element, 0, 0);
    }
  }

  addUnder(element, overElement) {
    const displayData = overElement.displayData;
    if (displayData) {
      this.add(
        element,
        displayData.endX + 1,
        displayData.startY,
      );
    }
  }

  addRightOf(element, leftElement) {
    const displayData = leftElement.displayData;
    if (displayData) {
      this.add(
        element,
        displayData.startX,
        displayData.endY + 2,
      );
    }
  }

  getLines(element) {
    return element.toString(WindowSize.height - 6).split('\n');
  }

  flush() {
    clear();
    this.display.forEach(line => process.stdout.write(line.join('')));
  }

  refreshElement(element) {
    const displayData = element.displayData;
    if (displayData) {
      this.add(element, displayData.startX, displayData.startY);
      this.flush();
    }
  }
}

module.exports = Display;
