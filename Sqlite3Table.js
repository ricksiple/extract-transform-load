var stream = require('stream');
var Mkd = require('./util/MultiKeyDictionary');

class Sqlite3Table extends stream.Transform {

  constructor(options, db, tableName, rowMatch, tableMatch, rowLookup, tableLookup, callback) {
    super(options);

    this.rowMatch = rowMatch;
    this.tableMatch = tableMatch;
    this.rowLookup = rowLookup;
    this.tableLookup = tableLookup;

    if (rowMatch.length !== tableMatch.length) {
      if (callback) {
        callback('Number of table key fields (' + tableMatch.length + ') does not match number of row key fields(' +  rowMatch.length + ').');
        return;
      }
    }
    if (rowLookup.length !== tableLookup.length) {
      if (callback) {
        callback('Number of table lookup fields (' + tableLookup.length + ') does not match number of row lookup fields(' +  rowLookup.length + ').');
        return;
      }
    }

    this.keyCount = tableMatch.length;
    this.fieldCount = tableLookup.length;
    this.dictionary = new Mkd(this.keyCount);

    var me = this;

    var keys;
    var value;

    db.all('select ' + tableMatch.join(',') + ',' + tableLookup.join(',') + ' from ' + tableName + ';', [], function(error, rows) {
      if (error) {
        if (callback) { callback(error); }
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
        if (callback) { callback(); }
      }
    });

  }

  _transform(chunk, encoding, transform_complete) {

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
