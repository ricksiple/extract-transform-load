var Sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var LineReader = require('../../LineReader');
var CsvParser = require('../../CsvParser');
var Sqlite3Target = require('../../Sqlite3Target');
var Sqlite3Table = require('../../Sqlite3Table');
var Stack = require('../../util/stack');

class Example1 {

  constructor() {

    this._stack = new Stack();

    // action stack
    this._stack.push(this.openDatabase);
    this._stack.push(this.createDatabase);
    this._stack.push(this.importFinancialType);
    this._stack.push(this.importFinancial);
    this._stack.push(this.importRelationship);
    this._stack.push(this.queryFinancialType);
    this._stack.push(this.queryFinancial);
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

      // Relationship
      sql = 'CREATE TABLE Relationship (id INTEGER PRIMARY KEY AUTOINCREMENT, ownerId INTEGER NOT NULL, ownedId INTEGER NOT NULL, startDate INTEGER NOT NULL, endDate INTEGER NULL);';
      me._db.run(sql, [], function(error) {
        if (error) {
          console.log('Error creating Relationship table: ' + error);
        }
      });

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

  importFinancial() {

    console.log('*** importFinancial...');

    var me = this;

    var source = new fs.createReadStream('./Financial.csv')
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

    var s3table = new Sqlite3Table({objectMode: true},
        me._db, 'FinancialType',
        ['TypeCode'], ['code'],
        ['financialTypeId'], ['id']
    );
    s3table.on('error', function(error) {
      console.log('S3TABLE: ' + error);
      me.next(false);
    });

    var s3target = new Sqlite3Target({objectMode: true},
      me._db, 'Financial',
      // ['Code', 'Name', 'financialTypeId', 'StartDate', 'EndDate'],
      // ['code', 'name', 'financialTypeId', 'startDate', 'endDate']
      ['Code', 'Name', 'financialTypeId', 'StartDate'],
      ['code', 'name', 'financialTypeId', 'startDate']
    );
    s3target.on('error', function(error) {
      console.log('SQLITE3TARGET: ' + error);
      me.next(false)
    });
    s3target.on('finish', () => { me.next(); });

    source.pipe(lr).pipe(csv).pipe(s3table).pipe(s3target);
  }

  importRelationship() {

    console.log('*** importRelationship...');

    var me = this;

    var source = fs.createReadStream('./Relationship.csv');
    source.on('error', function(error) {
      console.log('SOURCE: ' + error)
      me.next(false);
    });

    var lr = new LineReader({objectMode: true});
    lr.on('error', function(error) {
      console.log('LINEREADER: ' + error)
      me.next(false);
    });

    var csv = new CsvParser({objectMode: true, useHeaders: true});
    csv.on('error', function(error) {
      console.log('CSVPARSER: ' + error)
      me.next(false);
    });

    var ownerTable = new Sqlite3Table({objectMode: true},
      me._db, 'Financial',
      ['Owner'], ['code'],
      ['ownerId'], ['id']
    );
    ownerTable.on('error', function(error) {
      console.log('OWNERTABLE: ' + error)
      me.next(false);
    });

    var ownedTable = new Sqlite3Table({objectMode: true},
      me._db, 'Financial',
      ['Owned'], ['code'],
      ['ownedId'], ['id']
    );
    ownedTable.on('error', function(error) {
      console.log('OWNEDTABLE: ' + error)
      me.next(false);
    });

    var s3Target = new Sqlite3Target({objectmode: true},
      me._db, 'Relationship',
      ['ownerId', 'ownedId', 'StartDate', 'EndDate'],
      ['ownerId', 'ownedId', 'startDate', 'endDate']
    );
    s3Target.on('error', function(error) {
      console.log('S3TARGET: ' + error)
      me.next(false);
    });
    s3Target.on('finish', () => { me.next(); });

    source.pipe(lr).pipe(csv).pipe(ownerTable).pipe(ownedTable).pipe(s3Target);

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

  queryFinancial() {

    console.log('*** queryFinancial...');
    console.log('id, code, name, financialTypeId, startDate, endDate');

    var me = this;

    me._db.all("SELECT id, code, name, financialTypeId, startDate, endDate FROM Financial ORDER BY code ASC", [], function(error, rows) {
      if (error) {
        console.log('queryFinancial: ' + error);
      } else {
        rows.forEach(function(row) {
          console.log(row.id + ', ' + row.code + ', ' + row.name + ', ' + row.financialTypeId + ', ' + row.startDate + ', ' + row.endDate);
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
