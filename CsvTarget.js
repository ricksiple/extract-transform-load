const stream = require('stream');

var quoteString = { format: function(s) {   return '"' + s + '"'; } };

class CsvTarget extends stream.Transform {

  constructor(options, fields, formats, headers) {
    super(options);

    this.fields = fields;
    this.headers = headers || this.fields;
    this.formats = formats;

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
