var Sqlite3 = require('Sqlite3').verbose();

var CreateDatabase = require('./CreateDatabase');
var ImportFinancialType = require('./ImportFinancialType');

var Queue = require('../../util/queue');

class ImportAll {

  constructor() {
    this._actions = new Queue();
    this._actions.push(() => { return new CreateDatabase(); });
    this._actions.push(() => { return new ImportFinancialType(); });
  }

  run() {
    this._openDatabase();
  }

  _next(error) {

    var me = this;

    if (error) {
      console.log('ImportAll: ' + error);
    } else {
      if (this._actions.length()) {
        var action = this._actions.pop()();
        console.log(action.name());
        process.nextTick(() => { action.run((error) => { me._next(error); }, this._db); });
      } else {
        process.nextTick(() => { this._closeDatabase(); });
      }
    }

  }

  _openDatabase() {
    var me = this;
    this._db = new Sqlite3.Database(':memory:', function(error) {
      me._next(error);
    });
  }

  _closeDatabase() {
    var me = this;
    this._db.close(function (error) {
      if (error) { console.log('CloseDatabase: ' + error); }
    });
  }

}

var task = new ImportAll();
task.run();
