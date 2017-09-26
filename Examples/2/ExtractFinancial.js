var Sqlite3Source = require("../../Sqlite3Source");
var CsvTarget = require("../../CsvTarget");
var fs = require('fs');

class ExtractFinancial {

  name() {
    return 'Extract Financial';
  }

  run(next, db) {

    var stringDateFormat = {format: function(dateString) { return (dateString.length) ? Intl.DateTimeFormat().format(new Date(dateString)) : dateString; }};

    var source = new Sqlite3Source({objectMode: true}, db,
      'SELECT f.code AS code, f.name as name, ft.name AS type, f.startdate AS startdate, f.enddate AS enddate '
      + 'FROM Financial AS f INNER JOIN FinancialType AS ft ON f.financialTypeId = ft.id '
      + 'ORDER BY f.name ASC');
    source.on('error', (err) => { next('SOURCE: ' + err); });

    var csv  = new CsvTarget({objectMode: true}, ['code', 'name', 'type', 'startdate', 'enddate'], [CsvTarget.quoteString, CsvTarget.quoteString, CsvTarget.quoteString, stringDateFormat, stringDateFormat]);
    csv.on('error', (err) => { next('CSV: ' + err); });

    var target = fs.createWriteStream('./Financial.csv');
    target.on('error', (err) => { next('TARGET: ' + err); });
    target.on('finish', () => { next(); });

    source.pipe(csv).pipe(target);

  }

}

module.exports = ExtractFinancial;
