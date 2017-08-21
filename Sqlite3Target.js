var stream = require('stream');

function getDefaultTypes(table_fields) {
  var t = [];
  for (var n = 0; n < table_fields.length; n++) {
    t.push('general');
  }
  return t;
}

function getParameter(table_field, table_type) {

  var ttype = table_type.toLocaleLowerCase();

  if (ttype === "datetime") {
    return "strftime('%s',$" + table_field +")";
  } else {
    return '$' + table_field;
  }

}

function formatParameter(field_value, field_type) {
  if (field_type.toLocaleLowerCase() === 'datetime') {
    return (new Date(field_value)).toISOString();
  } else {
    return field_value;
  }
}

class Sqlite3Target extends stream.Writable {

  constructor(options, db, table_name, stream_fields, table_fields, table_types) {
    super(options);

    this.db = db;
    this.stream_fields = stream_fields;
    this.stmt_params = [];

    this.table_types = table_types || getDefaultTypes(table_fields);
    var sql = '';
    var sql_fields = '';
    var sql_params = '';

    sql_fields = table_fields[0];
    sql_params = getParameter(table_fields[0], this.table_types[0]);
    this.stmt_params[0] = '$' + table_fields[0];
    for (var n = 1; n < table_fields.length; n++) {
      sql_fields = sql_fields + ',' + table_fields[n];
      sql_params = sql_params + ',' + getParameter(table_fields[n], this.table_types[n]);
      this.stmt_params[n] = '$' + table_fields[n];
    }

    this.sql = 'INSERT INTO ' + table_name + ' (' + sql_fields + ') VALUES (' + sql_params + ')';
    console.log(this.sql);

  }

  _write(chunk, encoding, write_complete) {

    var me = this;

    // initial statment setup
    me.db.serialize(function() {
      me.stmt = me.db.prepare(me.sql, (error) => {
        if (error) { console.log('Sqlite3Target: Error preparing statement: "' + me.sql + '": ' + error)};
      });
      me.db.run('begin transaction', (error) => {
        me._write = me._write_impl;
        me._write(chunk, encoding, write_complete);
      });
    });
  }

  _write_impl(chunk, encoding, write_complete) {

    var params = {};
    for (var n = 0; n < this.stream_fields.length; n++) {
      params[this.stmt_params[n]] = formatParameter(chunk[this.stream_fields[n]], this.table_types[n]);
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
