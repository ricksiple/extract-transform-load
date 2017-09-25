var ImportProcess = require('../ImportProcess');

var CreateDatabase = require('./CreateDatabase');

var PopulateFinancialType = require('./PopulateFinancialType');
var PopulateFinancial = require('./PopulateFinancial');
var PopulateRelationship = require('./PopulateRelationship');
var PopulatePerformance = require('./PopulatePerformance');

var ExtractFinancialType = require('./ExtractFinancialType');

class ImportAll extends ImportProcess {

  constructor() {
    super();

    this.add(() => { return new CreateDatabase(); });

    this.add(() => { return new PopulateFinancialType(); });
    this.add(() => { return new PopulateFinancial(); });
    this.add(() => { return new PopulateRelationship(); });
    this.add(() => { return new PopulatePerformance(); });

    this.add(() => { return new ExtractFinancialType(); });

  }

}

var importAll = new ImportAll();
importAll.run();
