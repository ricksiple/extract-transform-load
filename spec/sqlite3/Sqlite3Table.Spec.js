var Sqlite3 = require('sqlite3').verbose();

var Sqlite3Table = require('../../sqlite3/Sqlite3Table');

var PipeSource = require('../../util/PipeSource');
var PipeTarget = require('../../util/PipeTarget');

describe('Sqlite3Table', function() {

  describe('single key field', function() {

    var source;
    var target;
    var db;
    var s3t;

    beforeEach(function(done) {
      db = new Sqlite3.Database(':memory:');
      db.serialize(function() {
        db.run('CREATE TABLE RoleType ( id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT UNIQUE);');
        db.run("INSERT INTO RoleType (code) VALUES ('DEV')", function(error) { if (error) { fail(error); done(); } });
        db.run("INSERT INTO RoleType (code) VALUES ('MGR')", function(error) { if (error) { fail(error); done(); } });
        db.run("INSERT INTO RoleType (code) VALUES ('TST')", function(error) {
          if (error) { fail(error); }
          done();
        });
        // db.all("SELECT id, code FROM RoleType ORDER BY id;", [], function(error, rows) {
        //   if (error) {
        //     fail(error);
        //   } else {
        //     rows.forEach(function(element) { console.log(element.id + ',' + element.code); });
        //   }
        //   done();
        // });
      });
    });

    afterEach(function(done) {
      db.close(function(error) {
        if (error) {
          fail(error);
        }
        done();
      });
    });

    it('should store a single key field and a single lookup field.', function(done) {

      var source = new PipeSource();
      source.arrange({name: 'Adam', role: 'MGR'});
      source.arrange({name: 'Bob', role: 'DEV'});
      source.arrange({name: 'Carl', role: 'TST'});
      source.on('error', function(error) { fail('SOURCE: ' + error); done(); });

      var target = new PipeTarget(
        function(actual, expected) {
          expect(actual).toEqual(expected);
          return true;
        }
      );
      target.arrange({name: 'Adam', role: 'MGR', roleId: 2});
      target.arrange({name: 'Bob', role: 'DEV', roleId: 1});
      target.arrange({name: 'Carl', role: 'TST', roleId: 3});
      target.on('error', function(error) { fail('TARGET: ' + error); done(); });
      target.on('finish', function() {
        target.assert();
        done();
      });

      var s3t = new Sqlite3Table(
        db, 'RoleType',
        ['role'], ['code'],
        ['roleId'], ['id']
      );

      source.pipe(s3t).pipe(target);

    });

    it('should throw an error if the rowMatch/tableMatch lengths are different.', function(done) {

      var source = new PipeSource();
      source.arrange({name: 'Adam', role: 'MGR'});
      source.arrange({name: 'Bob', role: 'DEV'});
      source.arrange({name: 'Carl', role: 'TST'});
      source.on('error', function(error) { fail('SOURCE: ' + error); done(); });

      var target = new PipeTarget(
        function(actual, expected) {
          expect(actual).toEqual(expected);
          return true;
        }
      );
      target.arrange({name: 'Adam', role: 'MGR', roleId: 2});
      target.arrange({name: 'Bob', role: 'DEV', roleId: 1});
      target.arrange({name: 'Carl', role: 'TST', roleId: 3});
      target.on('error', function(error) { fail('TARGET: ' + error); done(); });
      target.on('finish', function() {
        fail("Sqlite3Table didn't throw expected error.");
        done();
      });

      var s3t = new Sqlite3Table(
        db, 'RoleType',
        ['role', 'oops'], ['code'],
        ['roleId'], ['id']
      );
      s3t.on('error', function(error) {
        // console.log(error);
        expect(error).toEqual(new Error('Number of table key fields (1) does not match number of row key fields(2).'));
        done();
      });

      source.pipe(s3t).pipe(target);

    });

  it('should throw an error if the rowLookup/tableLookup lengths are different.', function(done) {

    var source = new PipeSource();
    source.arrange({name: 'Adam', role: 'MGR'});
    source.arrange({name: 'Bob', role: 'DEV'});
    source.arrange({name: 'Carl', role: 'TST'});
    source.on('error', function(error) { fail('SOURCE: ' + error); done(); });

    var target = new PipeTarget(
      function(actual, expected) {
        expect(actual).toEqual(expected);
        return true;
      }
    );
    target.arrange({name: 'Adam', role: 'MGR', roleId: 2});
    target.arrange({name: 'Bob', role: 'DEV', roleId: 1});
    target.arrange({name: 'Carl', role: 'TST', roleId: 3});
    target.on('error', function(error) { fail('TARGET: ' + error); done(); });
    target.on('finish', function() {
      fail("Sqlite3Table didn't throw expected error.");
      done();
    });

    var s3t = new Sqlite3Table(
      db, 'RoleType',
      ['role'], ['code'],
      ['roleId', 'oops'], ['id']
    );
    s3t.on('error', function(error) {
      // console.log(error);
      expect(error).toEqual(new Error('Number of table lookup fields (1) does not match number of row lookup fields(2).'));
      done();
    });

    source.pipe(s3t).pipe(target);

  });

});

  describe('mulitple key fields', function() {

    var source;
    var target;
    var db;
    var s3t;

    beforeEach(function(done) {
      db = new Sqlite3.Database(':memory:');
      db.serialize(function() {
        db.run('CREATE TABLE RoleType (id INTEGER PRIMARY KEY AUTOINCREMENT, typeCode TEXT, code TEXT, name TEXT);');
        db.run("INSERT INTO RoleType (typeCode, code, name) VALUES ('IT', 'DEV', 'IT Developer')", function(error) { if (error) { fail(error); done(); } });
        db.run("INSERT INTO RoleType (typeCode, code, name) VALUES ('ADM', 'CEO', 'Administration CEO')", function(error) { if (error) { fail(error); done(); } });
        db.run("INSERT INTO RoleType (typeCode, code, name) VALUES ('ADM', 'MGR', 'Administration Manager')", function(error) { if (error) { fail(error); done(); } });
        db.run("INSERT INTO RoleType (typeCode, code, name) VALUES ('IT', 'MGR', 'IT Manager')", function(error) { if (error) { fail(error); done(); } });
        db.run("INSERT INTO RoleType (typeCode, code, name) VALUES ('MKT', 'SLS', 'Marketing Sales')", function(error) { if (error) { fail(error); done(); } });
        db.run("INSERT INTO RoleType (typeCode, code, name) VALUES ('MKT', 'MGR', 'Marketing Manager')", function(error) { if (error) { fail(error); done(); } });
        db.run("INSERT INTO RoleType (typeCode, code, name) VALUES ('IT', 'TST', 'IT Tester')", function(error) {
          if (error) {
            fail(error);
          }
          done();
        });
        // db.all("SELECT id, code FROM RoleType ORDER BY id;", [], function(error, rows) {
        //   if (error) {
        //     fail(error);
        //   } else {
        //     rows.forEach(function(element) { console.log(element.id + ',' + element.code); });
        //   }
        //   done();
        // });
      });
    });

    afterEach(function(done) {
      db.close(function(error) {
        if (error) {
          fail(error);
        }
        done();
      });
    });

    it('should store a mulitple key field and a mulitple lookup field.', function(done) {

      var source = new PipeSource();
      source.arrange({name: 'Adam', roleType: 'IT', role: 'MGR'});
      source.arrange({name: 'Bob', roleType: 'IT', role: 'DEV'});
      source.arrange({name: 'Jane', roleType: 'ADM', role: 'MGR'});
      source.arrange({name: 'Carl', roleType: 'IT', role: 'TST'});
      source.on('error', function(error) { fail('SOURCE: ' + error); done(); });

      var target = new PipeTarget(
        function(actual, expected) {
          expect(actual).toEqual(expected);
          return true;
        }
      );
      target.arrange({name: 'Adam', roleType: 'IT', role: 'MGR', roleId: 4, roleName: 'IT Manager'});
      target.arrange({name: 'Bob', roleType: 'IT', role: 'DEV', roleId: 1, roleName: 'IT Developer'});
      target.arrange({name: 'Jane', roleType: 'ADM', role: 'MGR', roleId: 3, roleName: 'Administration Manager'});
      target.arrange({name: 'Carl', roleType: 'IT', role: 'TST', roleId: 7, roleName: 'IT Tester'});
      target.on('error', function(error) { fail('TARGET: ' + error); done(); });
      target.on('finish', function() {
        target.assert();
        done()
      });

      var s3t = new Sqlite3Table(
        db, 'RoleType',
        ['roleType', 'role'], ['typeCode', 'code'],
        ['roleId', 'roleName'], ['id', 'name']
      );

      source.pipe(s3t).pipe(target);

    });

  });

});
