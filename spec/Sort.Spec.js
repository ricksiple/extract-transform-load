var PipeSource = require('../util/PipeSource');
var PipeTarget = require('../util/PipeTarget');
var Sort = require('../Sort');

describe('Sort', function() {

  var source;
  var target;
  var spy;

  beforeEach(function() {

    source = new PipeSource();
    source.arrange({id:3, name:'Adam'});
    source.arrange({id:1, name:'Bob'});
    source.arrange({id:4, name:'Charles'});
    source.arrange({id:2, name:'David'});
    source.on('error', function(error) { console.log('SOURCE: ' + error); } );

    target = new PipeTarget(
      function(actual, expected) {
        return true;
      });
    target.on('error', function(error) { console.log('TARGET: ' + error); });

    spy = spyOn(target, "_spy");

  });

  it('should sort on a single numeric field ascending.', function(done) {

    target.on('finish', function() {
      expect(spy).toHaveBeenCalledTimes(4);
      expect(spy.calls.argsFor(0)[0]).toEqual({id:1, name:'Bob'});
      expect(spy.calls.argsFor(1)[0]).toEqual({id:2, name:'David'});
      expect(spy.calls.argsFor(2)[0]).toEqual({id:3, name:'Adam'});
      expect(spy.calls.argsFor(3)[0]).toEqual({id:4, name:'Charles'});
      done();
    });

    var sort = new Sort(['id'], ['asc']);
    sort.on('error', function(error) { console.log('SORT: ' + error); });

    source.pipe(sort).pipe(target);

  });

  it('should sort on a single numeric field descending.', function(done) {

    target.on('finish', function() {
      expect(spy).toHaveBeenCalledTimes(4);
      expect(spy.calls.argsFor(0)[0]).toEqual({id:4, name:'Charles'});
      expect(spy.calls.argsFor(1)[0]).toEqual({id:3, name:'Adam'});
      expect(spy.calls.argsFor(2)[0]).toEqual({id:2, name:'David'});
      expect(spy.calls.argsFor(3)[0]).toEqual({id:1, name:'Bob'});
      done();
    });

    var sort = new Sort(['id'], ['desc']);
    sort.on('error', function(error) { console.log('SORT: ' + error); });

    source.pipe(sort).pipe(target);

  });

  it('should sort on a single string field ascending.', function(done) {

    target.on('finish', function() {
      expect(spy).toHaveBeenCalledTimes(4);
      expect(spy.calls.argsFor(0)[0]).toEqual({id:3, name:'Adam'});
      expect(spy.calls.argsFor(1)[0]).toEqual({id:1, name:'Bob'});
      expect(spy.calls.argsFor(2)[0]).toEqual({id:4, name:'Charles'});
      expect(spy.calls.argsFor(3)[0]).toEqual({id:2, name:'David'});
      done();
    });

    var sort = new Sort(['name'], ['asc']);
    sort.on('error', function(error) { console.log('SORT: ' + error); });

    source.pipe(sort).pipe(target);

  });

  it('should sort on a single string field descending.', function(done) {

    target.on('finish', function() {
      expect(spy).toHaveBeenCalledTimes(4);
      expect(spy.calls.argsFor(0)[0]).toEqual({id:2, name:'David'});
      expect(spy.calls.argsFor(1)[0]).toEqual({id:4, name:'Charles'});
      expect(spy.calls.argsFor(2)[0]).toEqual({id:1, name:'Bob'});
      expect(spy.calls.argsFor(3)[0]).toEqual({id:3, name:'Adam'});
      done();
    });

    var sort = new Sort(['name'], ['desc']);
    sort.on('error', function(error) { console.log('SORT: ' + error); });

    source.pipe(sort).pipe(target);

  });

  it('should sort on a two fields ascending.', function(done) {

    source = new PipeSource();
    source.arrange({id:2, name:'Adam'});
    source.arrange({id:1, name:'Bob'});
    source.arrange({id:1, name:'Charles'});
    source.arrange({id:2, name:'David'});
    source.on('error', function(error) { console.log('SOURCE: ' + error); } );

    target.on('finish', function() {
      expect(spy).toHaveBeenCalledTimes(4);
      expect(spy.calls.argsFor(0)[0]).toEqual({id:1, name:'Bob'});
      expect(spy.calls.argsFor(1)[0]).toEqual({id:1, name:'Charles'});
      expect(spy.calls.argsFor(2)[0]).toEqual({id:2, name:'Adam'});
      expect(spy.calls.argsFor(3)[0]).toEqual({id:2, name:'David'});
      done();
    });

    var sort = new Sort(['id', 'name'], ['asc', 'asc']);
    sort.on('error', function(error) { console.log('SORT: ' + error); });

    source.pipe(sort).pipe(target);

  });

  it('should sort on a two fields oppositely.', function(done) {

    source = new PipeSource();
    source.arrange({id:2, name:'Adam'});
    source.arrange({id:1, name:'Bob'});
    source.arrange({id:1, name:'Charles'});
    source.arrange({id:2, name:'David'});
    source.on('error', function(error) { console.log('SOURCE: ' + error); } );

    target.on('finish', function() {
      expect(spy).toHaveBeenCalledTimes(4);
      expect(spy.calls.argsFor(0)[0]).toEqual({id:2, name:'Adam'});
      expect(spy.calls.argsFor(1)[0]).toEqual({id:2, name:'David'});
      expect(spy.calls.argsFor(2)[0]).toEqual({id:1, name:'Bob'});
      expect(spy.calls.argsFor(3)[0]).toEqual({id:1, name:'Charles'});
      done();
    });

    var sort = new Sort(['id', 'name'], ['desc', 'asc']);
    sort.on('error', function(error) { console.log('SORT: ' + error); });

    source.pipe(sort).pipe(target);

  });

});
