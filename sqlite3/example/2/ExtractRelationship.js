var Sqlite3Source = require("../../Sqlite3Source");
var CsvTarget = require("../../CsvTarget");
var fs = require('fs');

class ExtractRelationship {

  name() {
    return 'Extract Relationship';
  }

  run(next, db) {

    var stringDateFormat = {format: function(dateString) { return (dateString.length) ? Intl.DateTimeFormat().format(new Date(dateString)) : dateString; }};

    var source = new Sqlite3Source(db,
      'SELECT fOwner.name AS OwnerName, fOwned.name AS OwnedName, r.startDate AS StartDate, r.endDate AS EndDate '
      + 'FROM Relationship AS r INNER JOIN Financial AS fOwner ON r.ownerId = fOwner.id INNER JOIN Financial AS fOwned ON r.ownedId = fOwned.id '
      + 'ORDER BY OwnerName ASC, OwnedName ASC');
    source.on('error', (err) => { next('SOURCE: ' + err); });

    var csv  = new CsvTarget(['OwnerName', 'OwnedName', 'StartDate', 'EndDate'], [CsvTarget.quoteString, CsvTarget.quoteString, stringDateFormat, stringDateFormat]);
    csv.on('error', (err) => { next('CSV: ' + err); });

    var target = fs.createWriteStream('./Relationship.csv');
    target.on('error', (err) => { next('TARGET: ' + err); });
    target.on('finish', () => { next(); });

    source.pipe(csv).pipe(target);

  }

}

module.exports = ExtractRelationship;
