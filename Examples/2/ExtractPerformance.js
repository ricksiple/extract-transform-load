var Sqlite3Source = require("../../Sqlite3Source");
var CsvTarget = require("../../CsvTarget");
var fs = require('fs');

class ExtractPerformance {

  name() {
    return 'Extract Performance';
  }

  run(next, db) {

    var stringDateFormat = {format: function(dateString) { return (dateString.length) ? Intl.DateTimeFormat().format(new Date(dateString)) : dateString; }};
    var returnFormat = new Intl.NumberFormat('en', {useGrouping: false, minimumFractionDigits: 6, maximumFractionDigits: 6});
    var marketValueFormat = new Intl.NumberFormat('en', {useGrouping: false, minimumFractionDigits: 2, maximumFractionDigits: 2});

    var source = new Sqlite3Source({objectMode: true}, db,
      'SELECT f.name AS Name, p.startDate AS StartDate, p.endDate AS EndDate, p.netReturn AS NetReturn, p.grossReturn as GrossReturn, p.startMarketValue AS startMarketValue, p.endMarketValue AS EndMarketValue '
      + 'FROM Performance AS p INNER JOIN Financial AS f ON p.financialId = f.id '
      + 'ORDER BY Name ASC, StartDate ASC');
    source.on('error', (err) => { next('SOURCE: ' + err); });

    var csv  = new CsvTarget({objectMode: true}, ['Name', 'StartDate', 'EndDate', 'NetReturn', 'GrossReturn', 'startMarketValue', 'EndMarketValue'],
      [CsvTarget.quoteString, stringDateFormat, stringDateFormat, returnFormat, returnFormat, marketValueFormat, marketValueFormat]);
    csv.on('error', (err) => { next('CSV: ' + err); });

    var target = fs.createWriteStream('./Performance.csv');
    target.on('error', (err) => { next('TARGET: ' + err); });
    target.on('finish', () => { next(); });

    source.pipe(csv).pipe(target);

  }

}

module.exports = ExtractPerformance;
