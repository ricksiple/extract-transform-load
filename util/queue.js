class Queue {

  constructor() {
    this._length = 0;
    this._top = null;
  }

  push(item) {
    var wrap = {previous: this._top, payload: item};
    this._top = wrap;
    this._length++;
  }

  pop() {
    if (this._top) {
      var wrap = this._top;
      this._top = wrap.previous;
      this._length--;
      return wrap.payload;
    } else {
      throw new Error('Called pop() on empty queue.');
    }
  }

  length() {
    return this._length;
  }

}

module.exports = Queue;
