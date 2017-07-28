var Sqlite3 = require('sqlite3').verbose();
var PipeSource = require('../util/PipeSource');
var Sqlite3Target = require('../Sqlite3Target');

describe('Sqlite3Target', () => {

  var db;
  var source;
  var target;

  beforeEach(() => {

    db = new Sqlite3.Database(':memory:', () => {
      db.run('CREATE TABLE target (targetId INTEGER, targetName TEXT)');
    });

    source = new PipeSource({objectMode: true});
    source.on('error', (error) => { console.log('SOURCE: ' + error); });

    target = new Sqlite3Target({objectMode: true}, db, ["id", "name"], ["targetId", "targetName"]);
    target.on('error', (error) => { console.log('TARGET: ' + error); });

  });

  it('should update a table.', (done) => {

    source.arrange({id:2, name:'Moe'});
    source.arrange({id:1, name:'Manny'});
    source.arrange({id:3, name:'Jack'});

    target.on('finished', () => {
      db.all('SELECT id, name FROM target ORDER BY id', (err, rows) => {
        expect(rows[0].targetId).toBe(1);
        expect(rows[0].targetName).toBe('Manny');
        expect(rows[1].targetId).toBe(2);
        expect(rows[1].targetName).toBe('Moe');
        expect(rows[2].targetId).toBe(3);
        expect(rows[2].targetName).toBe('Jack');
        done();
      });
    });

  });

});
