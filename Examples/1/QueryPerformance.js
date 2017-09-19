class QueryPerformance {

  name() {
    return 'Query Performance';
  }

  run(next, db) {

    console.log('id, financialId, startDate, endDate, netReturn, grossReturn, startMarketValue, endMarketValue');

    db.all("SELECT id, financialId, date(startDate, 'unixepoch', 'localtime') as startDate, date(endDate, 'unixepoch', 'localtime') as endDate, netReturn, grossReturn, startMarketValue, endMarketValue FROM Performance ORDER BY financialId ASC, startDate ASC", [], function(error, rows) {
      if (error) {
        next('QueryPerformance: ' + error);
      } else {
        rows.forEach(function(row) {
          console.log(row.id + ', ' + row.financialId + ', ' +  row.startDate + ', ' + row.endDate + ', ' + row.netReturn + ', ' + row.grossReturn + ', ' + row.startMarketValue + ', ' + row.endMarketValue);
        });
        next();
      }
    });

  }
  
}

module.exports = QueryPerformance;
