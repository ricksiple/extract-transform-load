var stream = require('stream');
var csv = require('comma-separated-values');

class CsvParser extends stream.Transform {

  constructor(csvOptions, streamOptions) {
    super(streamOptions || { objectMode: true} );
    this.useHeaders = (csvOptions || {}).useHeaders || false;
    if (this.useHeaders) {
      this._transform = this._transform_header;
    } else {
      this._transform = this._transform_array;
    }
  }

  _transform_object(chunk, encoding, chunk_complete) {
    var fields = csv.parse(chunk)[0];
    var o = {};
    this.headers.forEach(function(v,i) { o[v] = fields[i]; });
    this.push(o);
    chunk_complete();
  }

  _transform_header(chunk, encoding, chunk_complete) {
    this.headers = csv.parse(chunk)[0];
    this._transform = this._transform_object;
    chunk_complete();
  }

  _transform_array(chunk, encoding, chunk_complete) {
    this.push(csv.parse(chunk)[0]);
    chunk_complete();
  }

}

module.exports = CsvParser;
