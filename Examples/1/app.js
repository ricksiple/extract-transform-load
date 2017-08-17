var Sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var LineReader = require('../../LineReader');
var CsvParser = require('../../CsvParser');
var Sqlite3Target = require('../../Sqlite3Target');
var Stack = require('../../util/stack');

class Example1 {

  constructor() {

    this._stack = new Stack();

    // action stack
    this._stack.push(this.openDatabase);
    this._stack.push(this.createDatabase);
    this._stack.push(this.importFinancialType);
    this._stack.push(this.queryFinancialType);
    this._stack.push(this.closeDatabase);
    this._stack.push(this.done)

  }

  next(result = true) {
    if (result) {
      var f = this._stack.pop();
      if (f) {
        process.nextTick(() => f.call(this));
      }
    }
  }

  //actions

  openDatabase() {

    console.log('*** openDatabase...')

    var me = this;

    this._db = new Sqlite3.Database(':memory:', function(error) {
      if (error) {
        console.log('Error creating database instance: ' + error);
      }
      me.next();
    });

  }

  createDatabase() {

    var me = this;

    console.log('*** createDatabase...');

    me._db.serialize(function() {

      var sql = '';

      // create database structure
      // FinancialType
      sql = 'CREATE TABLE FinancialType (id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT UNIQUE NOT NULL, name TEXT UNIQUE NOT NULL);';
      me._db.run(sql, [], function(error) {
        if (error) {
          console.log('Error creating FinancialType table: ' + error);
        }
      });

      // Financial
      sql = 'CREATE TABLE Financial (id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT UNIQUE NOT NULL, name TEXT UNIQUE NOT NULL, financialTypeId INTEGER NOT NULL, startDate INTEGER NOT NULL, endDate INTEGER NULL);';
      me._db.run(sql, [], function(error) {
        if (error) {
          console.log('Error creating Financial table: ' + error);
        }
      });

      // // Relationship
      // sql = 'CREATE TABLE Relationship (id INTEGER PRIMARY KEY AUTOINCREMENT, financialId INTEGER NOT NULL, relatedId INTEGER NOT NULL, startDate INTEGER NOT NULL, endDate INTEGER NULL);';
      // db.run(sql, [], function(error) {
      //   if (error) {
      //     console.log('Error creating Relationship table: ' + error);
      //   }
      // });
      //
      // // Performance
      // sql = 'CREATE TABLE Performance (id INTEGER PRIMARY KEY AUTOINCREMENT, financialId INTEGER NOT NULL, startDate INTEGER NOT NULL, endDate INTEGER NOT NULL, netReturn REAL NOT NULL, grossReturn REAL NOT NULL, startMarketValue REAL NOT NULL, endMarketValue REAL NOT NULL);';
      // db.run(sql, [], function(error) {
      //   if (error) {
      //     console.log('Error creating Performance table: ' + error);
      //   }
      // });

      // serialize a no-op sql statement to call "next()";
      me._db.all('select 1',[], function(error, rows) {
        me.next(true);
      });

    });

  }

  importFinancialType() {

    console.log('*** importFinancialType...');

    var me = this;

    var source = new fs.createReadStream('./FinancialType.csv')
    source.on('error', function(error) {
      console.log('SOURCE: ' + error);
      me.next(false);
    });

    var lr = new LineReader({objectMode: true});
    lr.on('error', function(error) {
      console.log('LINEREADER: ' + error);
      me.next(false);
    });

    var csv = new CsvParser({objectMode: true, useHeaders: true});
    csv.on('error', function(error) {
      console.log('CSVPARSER: ' + error);
      me.next(false);
    });

    var s3target = new Sqlite3Target({objectMode: true},
      me._db, 'FinancialType',
      ['type_code', 'type_name'], ['code', 'name']
    );
    s3target.on('error', function(error) {
      console.log('SQLITE3TARGET: ' + error);
      me.next(false)
    });
    s3target.on('finish', () => { me.next(); });

    source.pipe(lr).pipe(csv).pipe(s3target);

  }

  queryFinancialType() {

    console.log('*** queryFinancialType...');
    console.log('id, code, name');

    var me = this;

    me._db.all("SELECT id, code, name FROM FinancialType ORDER BY code ASC", [], function(error, rows) {
      if (error) {
        console.log('queryFinancialType: ' + error);
      } else {
        rows.forEach(function(row) {
          console.log(row.id + ', ' + row.code + ', ' + row.name);
        });
        me.next();
      }
    });

  }

  closeDatabase() {

    console.log('*** closeDatabase...');

    this._db.close(() => { this.next(); });

  }

  done() {
    console.log('*** done.');
  }

}

var ex1 = new Example1();
ex1.next();

// function ImportFinancial(db) {
//
//   var source = new fs.createReadStream('./Financial.csv')
//   source.on('error', function(errror) { console.log('SOURCE: ' + error); });
//
//   var lr = new LineReader({objectMode: true});
//   lr.on('error', function(error) { console.log('LINEREADER: ' + error); });
//
//   var csv = new CsvParser({objectMode: true, useHeaders: true});
//   csv.on('error', function(error) { console.log('CSVPARSER: ' + error); });
//
// }
