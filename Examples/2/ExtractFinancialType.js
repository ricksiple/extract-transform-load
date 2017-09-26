var Sqlite3Source = require("../../Sqlite3Source");
var CsvTarget = require("../../CsvTarget");
var fs = require('fs');

class ExtractFinancialType {

  name() {
    return 'Extract FinancialType';
  }

  run(next, db) {

    var source = new Sqlite3Source({objectMode: true}, db, 'SELECT code, name FROM FinancialType ORDER BY name ASC');
    source.on('error', (err) => { next('SOURCE: ' + err); });

    var csv  = new CsvTarget({objectMode: true}, ['code', 'name'], [CsvTarget.quoteString, CsvTarget.quoteString]);
    csv.on('error', (err) => { next('CSV: ' + err); });

    var target = fs.createWriteStream('./FinancialType.csv');
    target.on('error', (err) => { next('TARGET: ' + err); });
    target.on('finish', () => { next(); });

    source.pipe(csv).pipe(target);

  }

}

module.exports = ExtractFinancialType;
