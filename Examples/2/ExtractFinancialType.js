var Sqlite3Source = require("../../Sqlite3Source");
var CsvTarget = require("../../CsvTarget");
var fs = require('fs');

class ExtractFinancialType {

  contructor() {

  }

  run(db, next) {

    var source = new Sqlite3Source({objectMode: true}, db, "SELECT code, name FROM FinancialType ORDER BY name ASC");

    var csv  = new CsvTarget({objectMode: true}, ['code', 'name'], [CsvTarget.quoteString, CsvTarget.quoteString]);

    var target = fs.createWriteStream('./FinancialType.csv');

    source.pipe(csv).pipe(target);

  }

}

module.exports = ExtractFinancialType;
