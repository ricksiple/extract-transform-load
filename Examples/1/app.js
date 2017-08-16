var Sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var LineReader = require('../../LineReader');
var CsvParser = require('../../CsvParser');
var Sqlite3Target = require('../../Sqlite3Target');

db = new Sqlite3.Database(':memory:', function(error) {
  if (error) {
    console.log('Error creating database instance: ' + error);
  }
});

// action queue

var todo = [];
todo.push(done)
todo.push(closeDatabase);
todo.push(queryFinancialType);
todo.push(importFinancialType);
todo.push(createDatabase);

// schedule the first action
todo_next();

function todo_next() {
  var f = todo.pop();
  if (f) {
    process.nextTick(f, db, todo_next);
  }
}

//actions

function done(db, next) {
  console.log('*** done.');
}

function closeDatabase(db, next) {

  console.log('*** closeDatabase...');

  db.close(next);

}

function createDatabase(db, next) {

  console.log('*** createDatabase...');

  db.serialize(function() {

    var sql = '';
    var abort = false;

    // create database structure
    // FinancialType
    sql = 'CREATE TABLE FinancialType (id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT UNIQUE NOT NULL, name TEXT UNIQUE NOT NULL);';
    db.run(sql, [], function(error) {
      if (error) {
        console.log('Error creating FinancialType table: ' + error);
        abort = true;
      } else {
        console.log('CREATE TABLE FinancialType...OK');
        next();
      }
    });
    if (abort) { return; }

    // // Financial
    // sql = 'CREATE TABLE Financial (id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT UNIQUE NOT NULL, name TEXT UNIQUE NOT NULL, financialTypeId INTEGER NOT NULL, startDate INTEGER NOT NULL, endDate INTEGER NULL);';
    // db.run(sql, [], function(error) {
    //   if (error) {
    //     console.log('Error creating Financial table: ' + error);
    //     abort = true;
    //   }
    // });
    // if (abort) { return; }
    //
    // // Relationship
    // sql = 'CREATE TABLE Relationship (id INTEGER PRIMARY KEY AUTOINCREMENT, financialId INTEGER NOT NULL, relatedId INTEGER NOT NULL, startDate INTEGER NOT NULL, endDate INTEGER NULL);';
    // db.run(sql, [], function(error) {
    //   if (error) {
    //     console.log('Error creating Relationship table: ' + error);
    //     abort = true;
    //   }
    // });
    // if (abort) { return; }
    //
    // // Performance
    // sql = 'CREATE TABLE Performance (id INTEGER PRIMARY KEY AUTOINCREMENT, financialId INTEGER NOT NULL, startDate INTEGER NOT NULL, endDate INTEGER NOT NULL, netReturn REAL NOT NULL, grossReturn REAL NOT NULL, startMarketValue REAL NOT NULL, endMarketValue REAL NOT NULL);';
    // db.run(sql, [], function(error) {
    //   if (error) {
    //     console.log('Error creating Performance table: ' + error);
    //     abort = true;
    //   }
    // });
    // if (abort) { return; }

  });

}

function importFinancialType(db, next) {

  console.log('*** importFinancialType...');

  var source = new fs.createReadStream('./FinancialType.csv')
  source.on('error', function(errror) { console.log('SOURCE: ' + error); });

  var lr = new LineReader({objectMode: true});
  lr.on('error', function(error) { console.log('LINEREADER: ' + error); });

  var csv = new CsvParser({objectMode: true, useHeaders: true});
  csv.on('error', function(error) { console.log('CSVPARSER: ' + error); });

  var s3target = new Sqlite3Target({objectMode: true},
    db, 'FinancialType',
    ['type_code', 'type_name'], ['code', 'name']
  );
  s3target.on('error', function(error) { console.log('SQLITE3TARGET: ' + error); });
  s3target.on('finish', next);

  source.pipe(lr).pipe(csv).pipe(s3target);

}

function queryFinancialType(db, next) {

  console.log('*** queryFinancialType...');
  console.log('id, code, name');

  db.all("SELECT id, code, name FROM FinancialType ORDER BY code ASC", [], function(error, rows) {
    if (error) {
      console.log('queryFinancialType: ' + error);
    } else {
      rows.forEach(function(row) {
        console.log(row.id + ', ' + row.code + ', ' + row.name);
      });
      next();
    }
  });

}

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
