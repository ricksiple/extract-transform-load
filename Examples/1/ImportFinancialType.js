var Sqlite3 = require('Sqlite3').verbose();
var Queue = require('../../util/queue');

class ImportFinancialType {

  constructor() {

    this._db = new Sqlite3.Database(':memory:');
    this._actions = new Queue();
    
  }

}
