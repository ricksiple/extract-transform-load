const stream = require('stream');

var quoteString = { format: function(s) {   return '"' + s + '"'; } };

class CsvTarget extends stream.Transform {

  constructor(options, fields, headers, format) {
    super(options);
    this.fields = fields;
    this.headers = headers || this.fields;
    this.formats = format;
    this._transform = this._transform_first
  }

  _transform_first(chunk, encoding, transform_complete) {

    this.push(this.headers.map(quoteString.format).join());

    this._transform = this._transform_next;
    this._transform(chunk, encoding, transform_complete);

  }

  _transform_next(chunk, encoding, transform_complete) {

    var out = [];
    for (var n = 0; n < this.fields.length; n++) {
      out[n] = this.formats[n].format(chunk[this.fields[n]]);
    }

    this.push(out.join());

    transform_complete();
  }

}

CsvTarget.quoteString = quoteString;

module.exports = CsvTarget;
