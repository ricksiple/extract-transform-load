var stream = require('stream');

class Broadcast extends stream.Transform {

  constructor(options, duplicator, targetStreams) {
    super(options);
    this.duplicator = duplicator;
    this.targetStreams = targetStreams;
  }

  _transform(chunk, encoding, chunk_complete) {
    this.targetStreams.forEach(function(value, index) { value.write(this.duplicator(chunk)); }, this);
    chunk_complete();
  }

  _flush(flush_complete) {
    this.targetStreams.forEach(function(value, index) { value.end(); });
    flush_complete();
  }
}

module.exports = Broadcast;
