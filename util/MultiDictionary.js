class MultiDictionary {

  constructor(depth) {
    this.depth = depth;
    this.table = {};
  }

  add(keys, value) {

    var o = this.table;

    for (var n = 0; n < this.depth - 1; n++) {
      if (!(o[keys[n]])) {
        o[keys[n]] = {};
      }
      o = o[keys[n]];
    }

    o[keys[this.depth - 1]] = value;

  }

  find(keys) {

    var o = this.table;

    for (var n = 0; n < this.depth - 1; n++) {
      o = o[keys[n]];
      if (!o) { return o; }
    }

    return o[keys[this.depth - 1]];

  }

}

var md = new MultiDictionary(2);
md.add(['x','y'],{name: 'Rick'});
md.add(['x','z'],{name: 'Bob'});
md.add(['z','z'],{name: 'Joan'});
console.log(md.table);
console.log(md.find(['x', 'y']));
console.log(md.find(['x', 'z']));
console.log(md.find(['x', 'x']));
console.log(md.find(['z', 'z']));
