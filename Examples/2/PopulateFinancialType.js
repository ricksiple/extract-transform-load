var fs = require('fs');

class PopulateFinancialType {

  name() {
    return 'Populate FinancialType';
  }

  run(next, db) {

    db.serialize(() => {
        var stmt = db.prepare('INSERT INTO FinancialType (code, name) VALUES ($code, $name);');
        stmt.run({$code: 'P', $name: 'Portfolio'});
        stmt.run({$code: 'B', $name: 'Benchmark'});
        stmt.finalize();
    });

  }

}

module.exports = PopulateFinancialType;
