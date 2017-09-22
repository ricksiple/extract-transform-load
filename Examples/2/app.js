var ImportProcess = require('../ImportProcess');

var CreateDatabase = require('./CreateDatabase');

var PopulateFinancialType = require('./PopulateFinancialType');

var ExtractFinancialType = require('./ExtractFinancialType');

class ImportAll extends ImportProcess {

  constructor() {
    super();

    this.add(() => { return new CreateDatabase(); });

    this.add(() => { return new PopulateFinancialType(); });

    this.add(() => { return new ExtractFinancialType(); });

  }

}

var importAll = new ImportAll();
importAll.run();
