var Sqlite3 = require('sqlite3').verbose();
var stream = require('stream');

var Queue = require('./util/queue.js');

class Sqlite3Source extends stream.Readable {

  constructor(options, db, query) {
    super(options);

    this.queue = new Queue();
    this.isActive = false;
    this.isEOD = false;

    var me = this;

    db.serialize(() => {
      me.stmt = db.prepare(query);
      me.stmt.each((err, row) => me._rowCallback(err, row), (err, rowCount) => { me._completeCallback(err, rowCount); });
    });

  }

  _pushFromQueue() {

    // this.push() until push() returns false
    // or the queue is empty
    // console.log('_pushFromQueue:', 'isActive', this.isActive, 'queue.length()', this.queue.length());
    while (this.isActive && this.queue.length()) {
      this.isActive = this.push(this.queue.pop());
    }

    // console.log('_pushFromQueue:', 'isActive', this.isActive, 'isEOD', this.isEOD);
    if (this.isActive && this.isEOD) {
      this.push(null);
    }

  }

  _read(size) {

    // console.log('_read:');

    // OK to call this.push() until it returns false
    this.isActive = true;

    // push() whatever may be in the queue
    process.nextTick(() => { this._pushFromQueue(); });

  }

  _rowCallback(err, row) {

    // console.log("_rowCallback:", row);

    this.queue.push(row);

    // push() whatever may be in the queue
    process.nextTick(() => { this._pushFromQueue(); });

  }

  _completeCallback() {

    // console.log('_completeCallback:')

    this.isEOD = true;
    this.stmt.finalize();

    // push() whatever may be in the queue
    process.nextTick(() => { this._pushFromQueue(); });

  }

}

module.exports = Sqlite3Source;
