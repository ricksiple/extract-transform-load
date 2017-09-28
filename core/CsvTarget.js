const stream = require('stream');

var quoteString = { format: function(s) {   return '"' + s + '"'; } };
var noFormat = { format: function(s) { return s; } };

class CsvTarget extends stream.Transform {

  constructor(fields, formats, headers, csvOptions, streamOptions) {
    super(streamOptions || { objectMode: true });

    this.fields = fields;
    this.headers = headers || this.fields;
    this.formats = formats;
    this.EOL = (csvOptions || {}).EOL || '\r\n'
    if (!this.formats) {
      this.formats = [];
      for (var n = 0; n < this.fields.length; n++) {
        this.formats.push(quoteString);
      }
    }

    if (this.fields.length !== this.headers.length) { throw new Error('Header count (' + this.headers.length + ') must match field count (' + this.fields.length + ').'); }
    if (this.fields.length !== this.formats.length) { throw new Error('Formatter count (' + this.formats.length + ') must match field count (' + this.fields.length + ').'); }

    this._transform = this._transform_first

  }

  _transform_first(chunk, encoding, transform_complete) {

    var out = [];

    out = this.headers.map(quoteString.format);
    this.push(out.join() + this.EOL);

    this._transform = this._transform_next;
    this._transform(chunk, encoding, transform_complete);

  }

  _transform_next(chunk, encoding, transform_complete) {

    var out = [];
    for (var n = 0; n < this.fields.length; n++) {
      if (chunk[this.fields[n]] === null) {
        out[n] = this.formats[n].format('');
      } else {
        out[n] = this.formats[n].format(chunk[this.fields[n]]);
      }
    }
    this.push(out.join() + this.EOL);

    transform_complete();
  }

}

CsvTarget.quoteString = quoteString;
CsvTarget.noFormat = noFormat;

module.exports = CsvTarget;
