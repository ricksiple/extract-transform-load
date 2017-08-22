class Queue {

  constructor() {
    this._length = 0;
    this._head = null;
    this._last = null;
  }

  push(item) {
    var wrap = {next: null, payload: item};
    if (this._last) {
      this._last.next = wrap;
    }
    this._last = wrap;
    if (!(this._head)) {
      this._head = wrap;
    }
    this._length++;
  }

  pop() {
    if (this._head) {
      var wrap = this._head;
      this._head = wrap.next;
      if (!(this._head)) {
        this._last = null;
      }
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
