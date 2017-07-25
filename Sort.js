var stream = require('stream');

class Sort extends stream.Transform {

  constructor(options, fields, verbose = false) {
    super(options);
    this.fields = fields;
    this.verbose = verbose;
    this.rows = [];
  }

  _transform(chunk, encoding, write_complete) {
    this.rows.push(chunk);
    write_complete();
  }

  _flush(flush_complete) {
    for (var n = 0; n < this.rows.length; n++) {
      this.push(this.rows[n]);
    }
    flush_complete();
  }

}

module.exports = Sort;
