var stream = require('stream');

class Sqlite3Table extends stream.Transform {

  constructor(options, db, tableName, rowMatch, tableMatch, rowLookup, tableLookup) {
    super(options);

    db.all('select ' + tableMatch.join(',') + ',' + tableLookup.join(',') + ' from ' + tableName + ';', [], function(error) {

    });

  }

  _transform(chunk, encoding, transform_complete) {
    select [tableLookup] from [table] where [tableMatch] = [rowMatch];

  }

}
