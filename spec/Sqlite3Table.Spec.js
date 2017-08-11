var Sqlite3Table = require('../Sqlite3Table');
var Sqlite3 = require('sqlite3').verbose();
var PipeSource = require('../util/PipeSource');
var PipeTarget = require('../util/PipeTarget');

describe('Sqlite3Table', function() {

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
    });
  });

  it('should store a single key field and a single lookup field.', function(done) {

    var source = new PipeSource({objectMode: true});
    source.arrange({name: 'Adam', role: 'MGR'});
    source.arrange({name: 'Bob', role: 'DEV'});
    source.arrange({name: 'Carl', role: 'TST'});
    source.on('error', function(error) { fail('SOURCE: ' + error); done(); });

    var target = new PipeTarget({objectMode: true});
    target.arrange({name: 'Adam', role: 'MGR', roleId: 2});
    target.arrange({name: 'Bob', role: 'DEV', roleId: 1});
    target.arrange({name: 'Carl', role: 'TST', roleId: 3});
    target.on('error', function(error) { fail('TARGET: ' + error); done(); });
    target.on('finish', done);

    var s3t = new Sqlite3Table({objectMode: true},
      db, 'RoleType',
      ['role'], ['code'],
      ['roleId'], ['id'],
      function(error) {
        expect(error).toBeUndefined();
        source.pipe(s3t).pipe(target);
      }
    );

  });

});
