var Sqlite3 = require('sqlite3').verbose();
var stream = require('stream');

var Queue = require('../util/queue.js');

class Sqlite3Source extends stream.readable {

  constructor(options, db, table_name, stream_fields, table_fields, table_types) {
    super(options);

    this.queue = new Queue();
    this.EOD = false;

    // Create and execute statement.each().
    // row_callback handler should put things in this.queue.
    // complete_callback handler should set this.EOD.

  }

  _read(size) {

    // is there anything in the queue?
    if (this.queue.length) {
     this.push(this.queue.pop());
    } else {

      // queue is empty, EOD?
      if (this.EOD) {
        this.push(null);
      }

    }

  }

}

module.exports = Sqlite3Source;
