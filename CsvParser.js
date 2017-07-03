var stream = require('stream');
var csv = require('comma-separated-values');

class CsvParser extends stream.Transform {

  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, chunk_complete) {
    this.push(csv.parse(chunk)[0]);
    chunk_complete();
  }

}

module.exports = CsvParser;
