var Sqlite3 = require('sqlite3').verbose();
var PipeTarget = require('../util/PipeTarget');
var Sqlite3Source = require('../Sqlite3Source');

describe('Sqlite3Source', () => {

  var db;
  var source;
  var target;

  beforeEach((done) => {

    target = new PipeTarget({objectMode: true} ,(actual, expected) => { return (actual.targetId === expected.targetId && actual.targetName === expected.targetName); });

    db = new Sqlite3.Database(':memory:');
    db.serialize(() => {
      db.run('CREATE TABLE target (targetId INTEGER, targetName TEXT)');
      db.run("INSERT INTO target (targetId, targetName) VALUES (1, 'Manny')");
      db.run("INSERT INTO target (targetId, targetName) VALUES (2, 'Moe')");
      db.run("INSERT INTO target (targetId, targetName) VALUES (3, 'Jack')", () => {
        done();
      });
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

  it('should read a table.', (done) => {

    source = new Sqlite3Source({objectMode: true}, db, 'SELECT targetId, targetName FROM target ORDER BY targetId DESC')
    source.on('error', (err) => { fail('SOURCE: ' + err); done(); });

    target.arrange({targetId:3, targetName:'Jack'});
    target.arrange({targetId:2, targetName:'Moe'});
    target.arrange({targetId:1, targetName:'Manny'});
    target.on('error', (err) => { fail('TARGET: ' + err); done(); });

    target.on('finish', () => {
      target.assert();
      done();
    });

    source.pipe(target);

  });

});
