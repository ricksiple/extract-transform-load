var stream = require('stream');
var Mkd = require('util/MultiKeyDictionary');

class Sqlite3Table extends stream.Transform {

  constructor(options, db, tableName, rowMatch, tableMatch, rowLookup, tableLookup, callback) {
    super(options);

    this.rowMatch = rowMatch;
    this.tableMatch = tableMatch;
    this.rowLookup = rowLookup;
    this.tableLookup = tableLookup;

    if (rowMatch.length !=== tableMatch.length) { throw RangeError('Number of table key fields (' + tableMatch.length + ') does not match number of row key fields(' +  rowMatch.length + ').')}
    if (rowLookup.length !=== tableLookup.length) { throw RangeError('Number of table lookup fields (' + tableLookup.length + ') does not match number of row lookup fields(' +  rowLookup.length + ').')}

    this.keyCount = tableMatch.length;
    this.fieldCount = tableLookup.length;
    this.dictionary = new Mkd(keyCount);

    var keys;
    var value;

    db.all('select ' + tableMatch.join(',') + ',' + tableLookup.join(',') + ' from ' + tableName + ';', [], function(error, rows) {
      if (error) {
        if (callback) { callback(error); }
      } else {
        for (var row = 0, row < rows.length; row++) {
          keys = [];
          value = {};
          for (var key = 0; key < this.keyCount; key++) {
            keys[key] = rows[row][tableMatch[key]];
          }
          for (var field = 0; field < this.fieldCount; field++) {
            value[tableLookup[field]] = row[tableLookup[field]];
          }
          this.dictionary.add(keys, value);
        }
        if (callback) { callback(); }
      }
    });

  }

  _transform(chunk, encoding, transform_complete) {

    var keys = [];
    for (var key = 0; key < this.keyCount) {
      keys[key] = chunk[this.rowMatch[key]);
    }

    var value = this.dictionary.find(keys);

    if (value) {
      for (var field = 0; field < this.fieldCount; field++) {
        chunk[this.rowLookup[field]] = value[this.tableLookup[field]];
      }
    }

  }

}
