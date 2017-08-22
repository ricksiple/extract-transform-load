var Sqlite3 = require('Sqlite3').verbose();
var Queue = require('../../util/queue');

var fs = require('fs');
var LineReader = require('../../LineReader');
var CsvParser = require('../../CsvParser');
var Sqlite3Target = require('../../Sqlite3Target');

class ImportFinancialType {

  run(next, db) {

    console.log('*** importFinancialType...');

    var source = new fs.createReadStream('./FinancialType.csv')
    source.on('error', function(error) {
      next('SOURCE: ' + error);
    });

    var lr = new LineReader({objectMode: true});
    lr.on('error', function(error) {
      next('LINEREADER: ' + error);
    });

    var csv = new CsvParser({objectMode: true, useHeaders: true});
    csv.on('error', function(error) {
      next('CSVPARSER: ' + error);
    });

    var s3target = new Sqlite3Target({objectMode: true},
      db, 'FinancialType',
      ['type_code', 'type_name'], ['code', 'name']
    );
    s3target.on('error', function(error) {
      next('SQLITE3TARGET: ' + error);
    });
    s3target.on('finish', () => { next(); });

    source.pipe(lr).pipe(csv).pipe(s3target);

  }

}

module.exports = ImportFinancialType;
