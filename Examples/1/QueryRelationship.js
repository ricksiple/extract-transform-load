class QueryRelationship {

  name() {
    return 'Query Relationship';
  }

  run(next, db) {

    console.log('id, ownerId, ownedId, startDate, endDate');

    db.all("SELECT id, ownerId, ownedId, startDate, endDate FROM Relationship ORDER BY ownerId ASC", [], function(error, rows) {
      if (error) {
        next('QueryRelationship: ' + error);
      } else {
        rows.forEach(function(row) {
          console.log(row.id + ', ' + row.ownerId + ', ' + row.ownedId + ', ' + row.startDate + ', ' + row.endDate);
        });
        next();
      }
    });

  }
  
}

module.exports = QueryRelationship;
