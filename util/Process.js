var Sqlite3 = require('Sqlite3').verbose();

var Queue = require('../util/queue');

class Process {

  constructor() {
    this._actions = new Queue();
  }

  add(action) {
    this._actions.push(action);
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

module.exports = Process;
