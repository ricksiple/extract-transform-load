class CreateDatabase {

  name() {
    return 'Create Database';
  }

  run(next, db) {

    var me = this;

    db.serialize(function() {

      var sql = '';

      // create database structure
      // FinancialType
      sql = 'CREATE TABLE FinancialType (id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT UNIQUE NOT NULL, name TEXT UNIQUE NOT NULL);';
      db.run(sql, [], function(error) {
        if (error) {
          next('Error creating FinancialType table: ' + error);
        }
      });

      // Financial
      sql = 'CREATE TABLE Financial (id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT UNIQUE NOT NULL, name TEXT UNIQUE NOT NULL, financialTypeId INTEGER NOT NULL, startDate INTEGER NOT NULL, endDate INTEGER NULL);';
      db.run(sql, [], function(error) {
        if (error) {
          next('Error creating Financial table: ' + error);
        }
      });

      // Relationship
      sql = 'CREATE TABLE Relationship (id INTEGER PRIMARY KEY AUTOINCREMENT, ownerId INTEGER NOT NULL, ownedId INTEGER NOT NULL, startDate INTEGER NOT NULL, endDate INTEGER NULL);';
      db.run(sql, [], function(error) {
        if (error) {
          next('Error creating Relationship table: ' + error);
        }
      });

      // Performance
      sql = 'CREATE TABLE Performance (id INTEGER PRIMARY KEY AUTOINCREMENT, financialId INTEGER NOT NULL, startDate INTEGER NOT NULL, endDate INTEGER NOT NULL, netReturn REAL NOT NULL, grossReturn REAL NOT NULL, startMarketValue REAL NOT NULL, endMarketValue REAL NOT NULL);';
      db.run(sql, [], function(error) {
        if (error) {
          next('Error creating Performance table: ' + error);
        }
      });

      // serialize a no-op sql statement to call "next()";
      db.all('select 1',[], function(error, rows) {
        next();
      });

    });

  }

}

module.exports = CreateDatabase;
