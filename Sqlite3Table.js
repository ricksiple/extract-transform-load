var stream = require('stream');
var Mkd = require('./util/MultiKeyDictionary');

class Sqlite3Table extends stream.Transform {

  constructor(db, tableName, rowMatch, tableMatch, rowLookup, tableLookup, streamOptions) {
    super(streamOptions || { objectMode: true });

    this.rowMatch = rowMatch;
    this.tableMatch = tableMatch;
    this.rowLookup = rowLookup;
    this.tableLookup = tableLookup;

    this.initError = null;

    if (rowMatch.length !== tableMatch.length) {
      this._initError = new Error('Number of table key fields (' + tableMatch.length + ') does not match number of row key fields(' +  rowMatch.length + ').');
    }
    if (rowLookup.length !== tableLookup.length) {
      this._initError = new Error('Number of table lookup fields (' + tableLookup.length + ') does not match number of row lookup fields(' +  rowLookup.length + ').');
    }

    this.keyCount = tableMatch.length;
    this.fieldCount = tableLookup.length;
    this.dictionary = new Mkd(this.keyCount);

    var me = this;

    var keys;
    var value;

    var sql = 'select ' + tableMatch.join(',') + ',' + tableLookup.join(',') + ' from ' + tableName + ';'

    db.all(sql, [], function(error, rows) {
      if (error) {
        if (callback) { this._initError = error; }
      } else {
        for (var row = 0; row < rows.length; row++) {
          keys = [];
          value = {};
          for (var key = 0; key < me.keyCount; key++) {
            keys[key] = rows[row][tableMatch[key]];
          }
          for (var field = 0; field < me.fieldCount; field++) {
            value[tableLookup[field]] = rows[row][tableLookup[field]];
          }
          me.dictionary.add(keys, value);
        }

        // put in real transform implemenation
        me._transform = me._transform_impl;

        // did  we queue a chunk before the query completed?
        if (me._initData) {
          process.nextTick(() => me._transform(me._initData.chunk, me._initData.encoding, me._initData.transform_complete));
        }

      }
    });

  }

  _transform(chunk, encoding, transform_complete) {
    this._initData = {chunk: chunk, encoding: encoding, transform_complete: transform_complete};
  }

  _transform_impl(chunk, encoding, transform_complete) {

    if (this._initError) {
      transform_complete(this._initError);
      return;
    }

    var keys = [];
    for (var key = 0; key < this.keyCount; key++) {
      keys[key] = chunk[this.rowMatch[key]];
    }

    var value = this.dictionary.find(keys);

    if (value) {
      for (var field = 0; field < this.fieldCount; field++) {
        chunk[this.rowLookup[field]] = value[this.tableLookup[field]];
      }
    }

    this.push(chunk);
    transform_complete();

  }

}

module.exports = Sqlite3Table;
