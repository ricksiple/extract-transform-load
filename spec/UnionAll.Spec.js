var UnionAll = require('../UnionAll');

var PipeSource = require('../Util/PipeSource');
var PipeTarget = require('../Util/PipeTarget');

describe('UnionAll', function() {

  it('should union all rows from two sources.', function(done) {

    var spy;

    var source1 = new PipeSource();
    source1.on('error', function(error) { fail('source1: ' + error); });
    source1.arrange({id:1,name:'Adam'});
    source1.arrange({id:4,name:'Bill'});

    var source2 = new PipeSource();
    source2.on('error', function(error) { fail('source2: ' + error); });
    source2.arrange({id:3,name:'Sue'});
    source2.arrange({id:2,name:'Mary'})

    var target = new PipeTarget(
      function(actual, expected) {
        return true;
      }
    );
    target.on('error', function(error) { fail('target: ' + error); });
    target.on('finish', function() {
      target.assert();
      expect(spy).toHaveBeenCalledTimes(4);
      expect(spy).toHaveBeenCalledWith({id:1,name:'Adam'});
      expect(spy).toHaveBeenCalledWith({id:2,name:'Mary'});
      expect(spy).toHaveBeenCalledWith({id:3,name:'Sue'});
      expect(spy).toHaveBeenCalledWith({id:4,name:'Bill'});
      done();
    });

    var union = new UnionAll([source1, source2]);
    union.on('error', function(error) { fail('union: ' + error); });

    spy = spyOn(target, '_spy');

    union.pipe(target);

  });

});
