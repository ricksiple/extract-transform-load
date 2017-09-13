var ImportProcess = require('./ImportProcess');

var CreateDatabase = require('./CreateDatabase');

var ImportFinancialType = require('./ImportFinancialType');
var ImportFinancial = require('./ImportFinancial');
var ImportRelationship = require('./ImportRelationship');
var ImportPerformance = require('./ImportPerformance');

var QueryFinancialType = require('./QueryFinancialType');
var QueryFinancial = require('./QueryFinancial');
var QueryRelationship = require('./QueryRelationship');
var QueryPerformance = require('./QueryPerformance');

class ImportAll extends ImportProcess {

  constructor() {
    super();

    this.add(() => { return new CreateDatabase(); });

    this.add(() => { return new ImportFinancialType(); });
    this.add(() => { return new ImportFinancial(); });
    this.add(() => { return new ImportRelationship(); });
    this.add(() => { return new ImportPerformance(); });

    this.add(() => { return new QueryFinancialType(); });
    this.add(() => { return new QueryFinancial(); });
    this.add(() => { return new QueryRelationship(); });
    this.add(() => { return new QueryPerformance(); });

  }

}

var importAll = new ImportAll();
importAll.run();
