var stream = require('stream');

class PipeSource extends stream.Readable {

  constructor(options) {
    super(options);
    this.values = [];
  }

  _read(size) {
    var value = this.values.shift() || null;
    // console.log('SOURCE-_READ: [' + value + '] is ' + typeof value);
    this.push(value);
  }

  arrange(value) {
    // console.log('SOURCE-ARRANGE: [' + value + '] is ' + typeof value);
    this.values.push(value);
  }

}

module.exports = PipeSource;
