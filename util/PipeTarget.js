var stream = require('stream');

class PipeTarget extends stream.Writable {

  constructor(options, compare = null, verbose = false) {
    super(options);
    this.expected = [];
    this.compare = compare || function(actual, expected) { return (actual === expected); };
    this.verbose = verbose;
  }

  _write(chunk, encoding, write_complete) {
    this._spy(chunk);
    if (this.verbose) console.log('TARGET-WRITE: [' + chunk + '] is ' + typeof chunk + ' ' + (chunk ? chunk.length : ''));
    var expected = this.expected.shift();
    if (this.compare(chunk, expected)) {
      write_complete();
    } else {
      write_complete(new Error(chunk + ' !== ' + expected));
    }
  }

  _final(final_complete) {
    // not sure why this event isn't firing????
    final_complete();
  }

  _spy(chunk) {
  }

  arrange(expected) {
    if (this.verbose) console.log('TARGET-ARRANGE: [' + expected + '] is ' + typeof expected + ' ' + (expected ? expected.length : ''));
    this.expected.push(expected);
  }

  assert() {
    if (this.expected.length > 0) throw new Error('PipeTarget: ' + this.expected.length + ' unexpected items still in queue.');
  }

}

PipeTarget.compareArrays = function(chunk, value) {
    return value && chunk.length === value.length && chunk.every(function(v,i) { return v === value[i]; });
  }

module.exports = PipeTarget;
