var Sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var LineReader = require('../../LineReader');
var CsvParser = require('../../CsvParser');

db = new Sqlite3.Database(':memory:', function(error) {
  if (error) {
    console.log('Error creating database instance: ' + error);
  }
});

CreateDatabase(db);
ImportFinancial(db);

function CreateDatabase(db) {

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
      }
    });
    if (abort) { return; }

    // Financial
    sql = 'CREATE TABLE Financial (id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT UNIQUE NOT NULL, name TEXT UNIQUE NOT NULL, financialTypeId INTEGER NOT NULL, startDate INTEGER NOT NULL, endDate INTEGER NULL);';
    db.run(sql, [], function(error) {
      if (error) {
        console.log('Error creating Financial table: ' + error);
        abort = true;
      }
    });
    if (abort) { return; }

    // Relationship
    sql = 'CREATE TABLE Relationship (id INTEGER PRIMARY KEY AUTOINCREMENT, financialId INTEGER NOT NULL, relatedId INTEGER NOT NULL, startDate INTEGER NOT NULL, endDate INTEGER NULL);';
    db.run(sql, [], function(error) {
      if (error) {
        console.log('Error creating Relationship table: ' + error);
        abort = true;
      }
    });
    if (abort) { return; }

    // Performance
    sql = 'CREATE TABLE Performance (id INTEGER PRIMARY KEY AUTOINCREMENT, financialId INTEGER NOT NULL, startDate INTEGER NOT NULL, endDate INTEGER NOT NULL, netReturn REAL NOT NULL, grossReturn REAL NOT NULL, startMarketValue REAL NOT NULL, endMarketValue REAL NOT NULL);';
    db.run(sql, [], function(error) {
      if (error) {
        console.log('Error creating Performance table: ' + error);
        abort = true;
      }
    });
    if (abort) { return; }

    // populate
    // FinancialType
    sql = "INSERT INTO FinancialType (code, name) VALUES ('P', 'Portfolio'),  ('B', 'Benchmark');"
    db.run(sql, [], function(error) {
      if (error) {
        console.log('Error populating database: ' + error);
        abort = true;
      }
    });
    if (abort) { return; }

    // test
    // FinancialType
    var sql = "SELECT id, code, name FROM FinancialType ORDER BY code ASC;"
    db.each(sql, [], function(error, row) {
      if (error) {
        console.log('Error getting FinancialType rows: ' + error);
        abort = true;
      } else {
        console.log('id: ' + row.id + ', code: ' + row.code + ', name: ' + row.name);
      }
    });
    if (abort) { return; }

  });

}

function ImportFinancial(db) {

  var source = new fs.createReadStream('./Financial.csv')
  source.on('error', function(errror) { console.log('SOURCE: ' + error); });

  var lr = new LineReader({objectMode: true});
  lr.on('error', function(error) { console.log('LINEREADER: ' + error); });

  var csv = new CsvParser({objectMode: true, useHeaders: true});
  csv.on('error', function(error) { console.log('CSVPARSER: ' + error); });

}
