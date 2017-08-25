var fs = require('fs');
var LineReader = require('../../LineReader');
var CsvParser = require('../../CsvParser');
var Sqlite3Table = require('../../Sqlite3Table');
var Sqlite3Target = require('../../Sqlite3Target');

class ImportRelationship {

  name() {
    return 'Import Relationship';
  }

  run(next, db) {

    var source = fs.createReadStream('./Relationship.csv');
    source.on('error', function(error) {
      next('SOURCE: ' + error)
    });

    var lr = new LineReader({objectMode: true});
    lr.on('error', function(error) {
      next('LINEREADER: ' + error)
    });

    var csv = new CsvParser({objectMode: true, useHeaders: true});
    csv.on('error', function(error) {
      next('CSVPARSER: ' + error)
    });

    // var ownerTable = new Sqlite3Table({objectMode: true, log: function(msg) { console.log(msg); }},
    var ownerTable = new Sqlite3Table({objectMode: true},
      db, 'Financial',
      ['Owner'], ['code'],
      ['ownerId'], ['id']
    );
    ownerTable.on('error', function(error) {
      next('OWNERTABLE: ' + error)
    });

    var ownedTable = new Sqlite3Table({objectMode: true},
      db, 'Financial',
      ['Owned'], ['code'],
      ['ownedId'], ['id']
    );
    ownedTable.on('error', function(error) {
      next('OWNEDTABLE: ' + error)
    });

    var s3Target = new Sqlite3Target({objectMode: true, log: (message) => { console.log("s3Target: " + message); }},
      db, 'Relationship',
      ['ownerId', 'ownedId', 'StartDate', 'EndDate'],
      ['ownerId', 'ownedId', 'startDate', 'endDate']
    );
    s3Target.on('error', function(error) {
      next('S3TARGET: ' + error)
    });
    s3Target.on('finish', () => { next(); });

    source.pipe(lr).pipe(csv).pipe(ownedTable).pipe(ownerTable).pipe(s3Target);

  }

}

module.exports = ImportRelationship;
