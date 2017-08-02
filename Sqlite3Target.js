var stream = require('stream');

class Sqlite3Target extends stream.Writable {

  constructor(options, db, table_name, stream_fields, table_fields) {
    super(options);

    this.db = db;
    this.stream_fields = stream_fields;
    this.stmt_params = [];

    var sql = '';
    var sql_fields = '';
    var sql_params = '';

    sql_fields = table_fields[0];
    sql_params = '$' + table_fields[0];
    this.stmt_params[0] = '$' + table_fields[0];
    for (var n = 1; n < table_fields.length; n++) {
      sql_fields = sql_fields + ',' + table_fields[n];
      sql_params = sql_params + ',$' + table_fields[n];
      this.stmt_params[n] = '$' + table_fields[n];
    }

    this.sql = 'INSERT INTO ' + table_name + ' (' + sql_fields + ') VALUES (' + sql_params + ')';

  }

  _write(chunk, encoding, write_complete) {
    // initial statment setup
    this.stmt = this.db.prepare(this.sql, (error) => {
      this.db.run('begin transaction', (error) => {
        this._write = this._write_impl;
        this._write(chunk, encoding, write_complete);
      });
    });
  }

  _write_impl(chunk, encoding, write_complete) {

    var params = {};
    for (var n = 0; n < this.stream_fields.length; n++) {
      params[this.stmt_params[n]] = chunk[this.stream_fields[n]];
    }
    this.stmt.run(params, (error) => {
      if (error) {
        write_complete(error);
      } else {
        write_complete();
      }

    });

  }

  _final(final_complete) {
    this.stmt.finalize();
    this.db.run('commit transaction', (error) => {
      final_complete();
    });
  }

}

module.exports = Sqlite3Target;
