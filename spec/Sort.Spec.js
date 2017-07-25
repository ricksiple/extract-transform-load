var PipeSource = require('../util/PipeSource');
var PipeTarget = require('../util/PipeTarget');
var Sort = require('../Sort');

describe('Sort', function() {

  it('should sort on a single numeric field.', function(done) {

    var spy;

    var source = new PipeSource({objectMode: true});
    source.arrange({id:3, name:'Charles'});
    source.arrange({id:1, name:'Adam'});
    source.arrange({id:4, name:'David'});
    source.arrange({id:2, name:'Bob'});
    source.on('error', function(error) { console.log('SOURCE: ' + error); } );

    var target = new PipeTarget({objectMode: true},
      function(actual, expected) {
        return true;
      });
    target.on('error', function(error) { console.log('TARGET: ' + error); });
    target.on('finish', function() {
      expect(spy).toHaveBeenCalledTimes(4);
      expect(spy.calls.argsFor(0)[0]).toEqual({id:1, name:'Adam'});
      expect(spy.calls.argsFor(1)[0]).toEqual({id:2, name:'Bob'});
      expect(spy.calls.argsFor(2)[0]).toEqual({id:3, name:'Charles'});
      expect(spy.calls.argsFor(3)[0]).toEqual({id:4, name:'David'});
      done();
    });

    var sort = new Sort({objectMode: true});
    sort.on('error', function(error) { console.log('SORT: ' + error); });

    spy = spyOn(target, "_spy");

    source.pipe(sort).pipe(target);

  });

});
