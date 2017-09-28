var Mkd = require('../../util/MultiKeyDictionary');

describe('MultiKeyDictionary', function() {

  it('should store object with two key fields.', function() {

    mkd = new Mkd(2);

    mkd.add(['a', 'b'], {name: 'Jose'});
    mkd.add(['a', 'a'], {name: 'Frank'});
    mkd.add(['b', 'e'], {name: 'Debbie'});

    expect(mkd.find(['a', 'a'])).toEqual({name: 'Frank'});
    expect(mkd.find(['x', 'x'])).toBeUndefined();
    expect(mkd.find(['a', 'b'])).toEqual({name: 'Jose'});
    expect(mkd.find(['b', 'e'])).toEqual({name: 'Debbie'});

  });

  it('should store object with two key fields.', function() {

    mkd = new Mkd(5);

    mkd.add(['a', 'b', 'c', 'd', 'e'], {name: 'Jose'});
    mkd.add(['a', 'b', 'c', 'd', 'd'], {name: 'Pablo'});
    mkd.add(['a', 'a', 'a', 'a', 'a'], {name: 'Frank'});
    mkd.add(['b', 'e', 'x', 'y', '5'], {name: 'Debbie'});

    expect(mkd.find(['a', 'b', 'c', 'd', 'e'])).toEqual({name: 'Jose'});
    expect(mkd.find(['a', 'b', 'c', 'd', 'd'])).toEqual({name: 'Pablo'});
    expect(mkd.find(['a', 'a', 'a', 'a', 'a'])).toEqual({name: 'Frank'});
    expect(mkd.find(['b', 'e', 'x', 'y', '5'])).toEqual({name: 'Debbie'});

  });

  it('should thown an error when adding a record if the key count does not match the depth.', function() {

    mkd = new Mkd(5);

    expect(function() { mkd.add(['a', 'b', 'c'], {name: 'Jose'}); }).toThrowError(RangeError);

  });

  it('should thown an error when adding a record if the key count does not match the depth.', function() {

    mkd = new Mkd(5);

    mkd.add(['a', 'b', 'c', 'd', 'e'], {name: 'Jose'});

    expect(function() { mkd.find(['a', 'b', 'c', 'd', 'e', 'f']); }).toThrowError(RangeError);

  });

});
