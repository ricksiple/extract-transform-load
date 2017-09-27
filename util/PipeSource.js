var stream = require('stream');

class PipeSource extends stream.Readable {

  constructor(StreamOptions, verbose = false) {
    super(StreamOptions || { objectMode: true });
    this.values = [];
    this.verbose = verbose;
  }

  _read(size) {
    var value = this.values.shift() || null;
    if (this.verbose) console.log('SOURCE-READ: [' + value + '] is ' + typeof value + ' ' + value ? value.length : '');
    this.push(value);
  }

  arrange(value) {
    if (this.verbose) console.log('SOURCE-ARRANGE: [' + value + '] is ' + typeof value + ' ' + value ? value.length : '');
    this.values.push(value);
  }

}

module.exports = PipeSource;
