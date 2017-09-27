var stream = require('stream');

class LineReader extends stream.Transform {

  constructor(streamOptions) {
    super(streamOptions || { encoding: 'utf8', decodeStrings: false });
    this.buffer = '';
  }

  _transform(chunk, encoding, callback) {

    // console.log('RECV: ' + chunk);

    var lines = chunk.toString('utf8').split('\r\n');

    lines[0] = this.buffer + lines[0];
    this.buffer = lines.pop();

    lines.forEach(function(currentValue, index, arr) {
      // console.log('PUSH: ' + currentValue + ' [' + currentValue.length + ']');
      this.push(currentValue);
    }, this);

    callback();

  }

  _flush(callback) {
    if (this.buffer.length) {
      // console.log('PUSH: ' + this.buffer + ' [' + this.buffer.length + ']');
      this.push(this.buffer); }
    callback();
  }

}

module.exports = LineReader;
