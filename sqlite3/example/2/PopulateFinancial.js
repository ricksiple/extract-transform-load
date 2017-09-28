class PopulateFinancial {

  name() {
    return 'Populate Financial';
  }

  run(next, db) {

    db.serialize(() => {
        var stmt = db.prepare('INSERT INTO Financial (code, name, financialTypeId, startDate, endDate) VALUES ($code, $name, $financialTypeId, $startDate, $endDate);');
        stmt.run({$code: 'ASIA', $name: 'ASIA Fund', $financialTypeId: 1, $startDate: '6/30/2016', $endDate: '12/31/2016'});
        stmt.run({$code: 'ASEAN', $name: 'MSCI ASEAN', $financialTypeId: 2, $startDate: '6/30/2016', $endDate: '12/31/2016'});
        stmt.run({$code: 'NRTH', $name: 'North America', $financialTypeId: 1, $startDate: '1/1/2017', $endDate: null});
        stmt.run({$code: 'SP500', $name: 'S&P 500', $financialTypeId: 2, $startDate: '1/1/2017', $endDate: null});
        stmt.finalize(() => { next(); });
    });

  }

}

module.exports = PopulateFinancial;
