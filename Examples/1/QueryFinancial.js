class QueryFinancial {

  name() {
    return 'Query Financial';
  }

  run(next, db) {

    console.log('id, code, name, financialTypeId, startDate, endDate');

    db.all("SELECT id, code, name, financialTypeId, startDate, endDate FROM Financial ORDER BY code ASC", [], function(error, rows) {
      if (error) {
        next('QueryFinancial: ' + error);
      } else {
        rows.forEach(function(row) {
          console.log(row.id + ', ' + row.code + ', ' + row.name + ', ' + row.financialTypeId + ', ' + row.startDate + ', ' + row.endDate);
        });
        next();
      }
    });

  }

}

module.exports = QueryFinancial;
