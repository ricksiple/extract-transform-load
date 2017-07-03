var PipeSource = require('../util/PipeSource');
var PipeTarget = require('../util/PipeTarget');
var CsvParser = require('../CsvParser');

describe('CsvParser', function() {

  it('should properly parse a CSV string into an object', function(done) {

    var source = new PipeSource({decodeStrings: false, encoding: 'utf8'});
    source.arrange('Column1,Column2,Column3');
    source.arrange('one,two,red,blue');
    source.arrange('three,four,"window,door"');

    // var target = new PipeTarget({objectMode: true});
    var target = new PipeTarget({objectMode: true}, PipeTarget.compareArrays);
    target.arrange(['Column1', 'Column2', 'Column3']);
    target.arrange(['one','two','red','blue']);
    target.arrange(['three','four','window,door']);
    target.on('finish', function() {
      target.assert();
      done();
    });

    var parser = new CsvParser({objectMode: true});

    source.pipe(parser).pipe(target);

  });

});
