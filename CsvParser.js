var stream = require('stream');

class CsvParser extends stream.Transform {

  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, chunk_complete) {
    
    chunk_complete();
  }

}

module.exports = CsvParser;
