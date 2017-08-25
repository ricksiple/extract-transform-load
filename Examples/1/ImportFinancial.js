var fs = require('fs');
var LineReader = require('../../LineReader');
var CsvParser = require('../../CsvParser');
var Sqlite3Table = require('../../Sqlite3Table');
var Sqlite3Target = require('../../Sqlite3Target');

class ImportFinancial {

  name() {
    return 'Import Financial';
  }

  run(next, db) {

    var me = this;

    var source = new fs.createReadStream('./Financial.csv')
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

    var s3table = new Sqlite3Table({objectMode: true},
        db, 'FinancialType',
        ['TypeCode'], ['code'],
        ['financialTypeId'], ['id']
    );
    s3table.on('error', function(error) {
      next('S3TABLE: ' + error);
    });

    var s3target = new Sqlite3Target({objectMode: true},
      db, 'Financial',
      ['Code', 'Name', 'financialTypeId', 'StartDate', 'EndDate'],
      ['code', 'name', 'financialTypeId', 'startDate', 'endDate']
    );
    s3target.on('error', function(error) {
      next('SQLITE3TARGET: ' + error);
    });
    s3target.on('finish', () => { next(); });

    source.pipe(lr).pipe(csv).pipe(s3table).pipe(s3target);

  }

}

module.exports = ImportFinancial;
