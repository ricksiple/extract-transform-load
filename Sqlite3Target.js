var stream = require('stream');

class Sqlite3Target extends stream.Writeable {

  constructor(options, db, table_name, stream_fields, table_fields) {
    super(options);

    this.db = db;
    this.stream_fields = stream_fields;
    this.stmt_params = [];

    var sql = '';
    var sql_fields = '';
    var sql_params = '';

    sql_fields = table_fields[0];
    sql_params = table_fields[0];
    stmt_params = '$' + table_fields[0];
    for (var n = 1; n < table_fields.length; n++) {
      sql_fields = sql_fields + ',' + table_fields[n];
      sql_params = sql_params + ',$' + table_fields[n];
      stmt_params[n] = '$' + table_fields[n];
    }

    sql = 'INSERT INTO ' + table_name + ' (' + sql_fields + ') VALUES (' + sql_params + ')';
    this.stmt = db.prepare(sql);

    this.db.run('begin transaction');

  }

  _write(chunk, encoding, write_complete) {

    var params = {};
    for (var n = 0; n < this.stream_fields; n++) {
      params[this.stmt_params] = chunk[this.stream_fields[n]];
    }
    stmt.run(params, (error) => {
      if (error) {
        write_compete(error);
      } else {
        write_complete();
      }

    });

  }

  _final(final_complete) {
    this.stmt.finalize();
    this.db.run('commit transaction');
    final_complete();
  }

}
