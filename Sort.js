var stream = require('stream');
var orderBy = require('lodash.orderby');

class Sort extends stream.Transform {

  constructor(options, fields, order, verbose = false) {
    super(options);
    this.fields = fields;
    this.order = order;
    this.verbose = verbose;
    this.rows = [];
  }

  _transform(chunk, encoding, write_complete) {
    this.rows.push(chunk);
    write_complete();
  }

  _flush(flush_complete) {
    this.rows = orderBy(this.rows, this.fields, this.order);
    for (var n = 0; n < this.rows.length; n++) {
      this.push(this.rows[n]);
    }
    flush_complete();
  }

}

module.exports = Sort;
