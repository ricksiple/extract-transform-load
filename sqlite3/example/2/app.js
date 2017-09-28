var Process = require('../Process');

var CreateDatabase = require('./CreateDatabase');

var PopulateFinancialType = require('./PopulateFinancialType');
var PopulateFinancial = require('./PopulateFinancial');
var PopulateRelationship = require('./PopulateRelationship');
var PopulatePerformance = require('./PopulatePerformance');

var ExtractFinancialType = require('./ExtractFinancialType');
var ExtractFinancial = require('./ExtractFinancial');
var ExtractRelationship = require('./ExtractRelationship');
var ExtractPerformance = require('./ExtractPerformance');

class ExtractAll extends Process {

  constructor() {
    super();

    this.add(() => { return new CreateDatabase(); });

    this.add(() => { return new PopulateFinancialType(); });
    this.add(() => { return new PopulateFinancial(); });
    this.add(() => { return new PopulateRelationship(); });
    this.add(() => { return new PopulatePerformance(); });

    this.add(() => { return new ExtractFinancialType(); });
    this.add(() => { return new ExtractFinancial(); });
    this.add(() => { return new ExtractRelationship(); });
    this.add(() => { return new ExtractPerformance(); });

  }

}

(new ExtractAll()).run();
