var Sqlite3Table = require('../Sqlite3Table');
var Sqlite3 = require('sqlite3').verbose();

describe('Sqlite3Table', function() {

  it('should store a single key field and a single lookup field.', function(done) {

    var db = new Sqlite3.Database(':memory:');
    var doIt;

    var s3t = new Sqlite3Table({objectMode: true},
      db, 'FinancialType',
      ['typeCode'], ['code'],
      ['typeId'], ['id'],
      function(error) {
        expect(error).toBeUndefined();

        expect()
      }

  });

});
