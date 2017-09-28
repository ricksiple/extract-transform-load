class QueryFinancialType {

  name() {
    return 'Query FinancialType';
  }

  run(next, db) {

    console.log('id, code, name');
    db.all("SELECT id, code, name FROM FinancialType ORDER BY code ASC", [], function(error, rows) {
      if (error) {
        next('QueryFinancialType: ' + error);
      } else {
        rows.forEach(function(row) {
          console.log(row.id + ', ' + row.code + ', ' + row.name);
        });
        next();
      }
    });

  }

}

module.exports = QueryFinancialType;
