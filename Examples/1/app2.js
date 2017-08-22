var Sqlite3 = require('Sqlite3').verbose();

var ImportFinancialType = require('./ImportFinancialType');

var Queue = require('../../util/queue');

class ImportAll {

  constructor() {
    this._actions = new Queue();
    this._actions.push(() => { return new ImportFinancialType(); });
  }

  run() {
    this._openDatabase();
  }

  _next(error) {

    if (error) {
      console.log('ImportAll: ' + error);
      return;
    }

    if (this._actions.length) {
      var a = this._actions.pop()();
      process.nextTick(() => { a.run(this._next, this._db); });
    } else {
      process.nextTick(() => { this._closeDatabase(); });
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
      me._next(error);
    });
  }

}

var task = new ImportAll();
task.run();
