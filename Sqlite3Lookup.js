var stream = require('stream');

class Sqlite3Lookup extends stream.Transform {

  constructor(options, db, tableName, rowMatch, tableMatch, rowLookup, tableLookup) {
    super(options);

    var sql = 'select ' + tableLookup.join(',') + ' from ' + tableName + ' where ';
    sql = sql + tableMatch[0] + ' = $' + tableMatch[0]
    for (var n = 1; n < tableMatch.length; n++) {
      sql = sql + ' and ' + tableMatch[n] + ' = $' + tableMatch[n];
    }

    var params = {};
    for (var n = 0; n < rowMatch)
    db.all(sql, [], function(error) {

    });
  }

  _transform(chunk, encoding, transform_complete) {
    select [tableLookup] from [table] where [tableMatch] = [rowMatch];

  }

}
