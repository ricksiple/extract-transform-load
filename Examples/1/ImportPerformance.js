var fs = require('fs');
var LineReader = require('../../LineReader');
var CsvParser = require('../../CsvParser');
var Sqlite3Table = require('../../Sqlite3Table');
var Sqlite3Target = require('../../Sqlite3Target');

class ImportPerformance {

  name() {
    return 'Import Performance';
  }

  run(next, db) {

    var source = fs.createReadStream('./Performance.csv');
    source.on('error', function(error) {
      next('SOURCE: ' + error)
    });

    var lr = new LineReader();
    lr.on('error', function(error) {
      next('LINEREADER: ' + error)
    });

    var csv = new CsvParser({useHeaders: true});
    csv.on('error', function(error) {
      next('CSVPARSER: ' + error)
    });

    // var ownerTable = new Sqlite3Table({objectMode: true, log: function(msg) { console.log(msg); }},
    var s3Table = new Sqlite3Table(
      db, 'Financial',
      ['Code'], ['code'],
      ['financialId'], ['id']
    );
    s3Table.on('error', function(error) {
      next('S3TABLE: ' + error)
    });

    var s3Target = new Sqlite3Target(
      db, 'Performance',
      ['financialId', 'StartDate', 'EndDate', 'NetReturn', 'GrossReturn', 'StartMarketValue', 'EndMarketValue'],
      ['financialId', 'startDate', 'endDate',  'netReturn', 'grossReturn', 'startMarketValue', 'endMarketValue'],
      ['general', 'datetime', 'datetime',  'general', 'general', 'general', 'general']
    );
    s3Target.on('error', function(error) {
      next('S3TARGET: ' + error)
    });
    s3Target.on('finish', () => { next(); });

    source.pipe(lr).pipe(csv).pipe(s3Table).pipe(s3Target);

  }

}

module.exports = ImportPerformance;
