class PopulateRelationship {

  name() {
    return 'Populate Relationship';
  }

  run(next, db) {

    db.serialize(() => {
        //sql = 'CREATE TABLE Relationship (id INTEGER PRIMARY KEY AUTOINCREMENT, ownerId INTEGER NOT NULL, ownedId INTEGER NOT NULL, startDate INTEGER NOT NULL, endDate INTEGER NULL);';
        var stmt = db.prepare('INSERT INTO Relationship (ownerId, ownedId, startDate, endDate) VALUES ($ownerId, $ownedId, $startDate, $endDate);');
        stmt.run({$ownerId: 3, $ownedId: 4, $startDate: '1/1/2017', $endDate: null});
        stmt.run({$ownerId: 1, $ownedId: 2, $startDate: '6/30/2016', $endDate: '12/31/2016'});
        stmt.finalize(() => { next(); });
    });

  }

}

module.exports = PopulateRelationship;
