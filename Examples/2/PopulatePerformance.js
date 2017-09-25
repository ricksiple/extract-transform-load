class PopulatePerformance {

  name() {
    return 'Populate Performance';
  }

  run(next, db) {

    db.serialize(() => {
      var stmt = db.prepare('INSERT INTO Performance (financialId, startDate, endDate, netReturn, grossReturn, startMarketValue, endMarketValue) VALUES ($financialId, $startDate, $endDate, $netReturn, $grossReturn, $startMarketValue, $endMarketValue);');

      stmt.run({$financialId: 1, $startDate: '7/1/2016', $endDate: '7/31/2016', $netReturn: 1.8899, $grossReturn: 1.9284, $startMarketValue: 25678364.00, $endMarketValue: 26173556.14});
      stmt.run({$financialId: 1, $startDate: '8/1/2016', $endDate: '8/30/2016', $netReturn: 2.0092, $grossReturn: 2.0502, $startMarketValue: 26173556.14, $endMarketValue: 26710163.51});
      stmt.run({$financialId: 1, $startDate: '9/1/2016', $endDate: '9/29/2016', $netReturn: 2.0426, $grossReturn: 2.0843, $startMarketValue: 26710163.51, $endMarketValue: 27266882.34});
      stmt.run({$financialId: 1, $startDate: '10/1/2016', $endDate: '10/29/2016', $netReturn: 1.9526, $grossReturn: 1.9924, $startMarketValue: 27266882.34, $endMarketValue: 27810149.29});
      stmt.run({$financialId: 1, $startDate: '11/1/2016', $endDate: '11/28/2016', $netReturn: 1.9325, $grossReturn: 1.9719, $startMarketValue: 27810149.29, $endMarketValue: 28358545.61});
      stmt.run({$financialId: 1, $startDate: '12/1/2016', $endDate: '12/28/2016', $netReturn: 2.0494, $grossReturn: 2.0912, $startMarketValue: 28358545.61, $endMarketValue: 28951579.06});

      stmt.run({$financialId: 3, $startDate: '1/1/2017', $endDate: '1/31/2017', $netReturn: 1.8865, $grossReturn: 1.9250, $startMarketValue: 41865246.00, $endMarketValue: 42671141.18});
      stmt.run({$financialId: 3, $startDate: '2/1/2017', $endDate: '2/28/2017', $netReturn: 1.9626, $grossReturn: 2.0027, $startMarketValue: 42671141.18, $endMarketValue: 43525710.33});
      stmt.run({$financialId: 3, $startDate: '3/1/2017', $endDate: '3/31/2017', $netReturn: 2.0326, $grossReturn: 2.0740, $startMarketValue: 43525710.33, $endMarketValue: 44428452.69});
      stmt.run({$financialId: 3, $startDate: '4/1/2017', $endDate: '4/30/2017', $netReturn: 1.9394, $grossReturn: 1.9790, $startMarketValue: 44428452.69, $endMarketValue: 45307674.64});
      stmt.run({$financialId: 3, $startDate: '5/1/2017', $endDate: '5/31/2017', $netReturn: 1.9168, $grossReturn: 1.9559, $startMarketValue: 45307674.64, $endMarketValue: 46193856.68});
      stmt.run({$financialId: 3, $startDate: '6/1/2017', $endDate: '6/30/2017', $netReturn: 2.0547, $grossReturn: 2.0966, $startMarketValue: 46193856.68, $endMarketValue: 47162356.17});

      stmt.run({$financialId: 2, $startDate: '7/1/2016', $endDate: '7/31/2016', $netReturn: 1.9352, $grossReturn: 1.9747, $startMarketValue: 125658214.00, $endMarketValue: 128139539.54});
      stmt.run({$financialId: 2, $startDate: '8/1/2016', $endDate: '8/30/2016', $netReturn: 2.0362, $grossReturn: 2.0778, $startMarketValue: 128139539.54, $endMarketValue: 130801986.39});
      stmt.run({$financialId: 2, $startDate: '9/1/2016', $endDate: '9/29/2016', $netReturn: 1.9132, $grossReturn: 1.9523, $startMarketValue: 130801986.39, $endMarketValue: 133355591.67});
      stmt.run({$financialId: 2, $startDate: '10/1/2016', $endDate: '10/29/2016', $netReturn: 1.9047, $grossReturn: 1.9436, $startMarketValue: 133355591.67, $endMarketValue: 135947430.10});
      stmt.run({$financialId: 2, $startDate: '11/1/2016', $endDate: '11/28/2016', $netReturn: 1.9033, $grossReturn: 1.9422, $startMarketValue: 135947430.10, $endMarketValue: 138587760.86});
      stmt.run({$financialId: 2, $startDate: '12/1/2016', $endDate: '12/28/2016', $netReturn: 1.9940, $grossReturn: 2.0347, $startMarketValue: 138587760.86, $endMarketValue: 141407654.34});

      stmt.run({$financialId: 4, $startDate: '4,1/1/2017', $endDate: '1/31/2017', $netReturn: 1.8647, $grossReturn: 1.9028, $startMarketValue: 512896217.00, $endMarketValue: 522655447.48});
      stmt.run({$financialId: 4, $startDate: '4,2/1/2017', $endDate: '2/28/2017', $netReturn: 2.0268, $grossReturn: 2.0682, $startMarketValue: 522655447.48, $endMarketValue: 533464858.49});
      stmt.run({$financialId: 4, $startDate: '4,3/1/2017', $endDate: '3/31/2017', $netReturn: 1.9600, $grossReturn: 2.0000, $startMarketValue: 533464858.49, $endMarketValue: 544134202.71});
      stmt.run({$financialId: 4, $startDate: '4,4/1/2017', $endDate: '4/30/2017', $netReturn: 2.0318, $grossReturn: 2.0733, $startMarketValue: 544134202.71, $endMarketValue: 555415572.88});
      stmt.run({$financialId: 4, $startDate: '4,5/1/2017', $endDate: '5/31/2017', $netReturn: 1.8739, $grossReturn: 1.9122, $startMarketValue: 555415572.88, $endMarketValue: 566036068.10});
      stmt.run({$financialId: 4, $startDate: '4,6/1/2017', $endDate: '6/30/2017', $netReturn: 2.0215, $grossReturn: 2.0628, $startMarketValue: 566036068.10, $endMarketValue: 577712165.69});

      stmt.finalize(() => { next(); });
    });

  }

}

module.exports = PopulatePerformance;
