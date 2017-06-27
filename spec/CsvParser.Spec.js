var PipeSource = require('../util/PipeSource');
var PipeTarget = require('../util/PipeTarget');
var CsvParser = require('../CsvParser');

describe('CsvParser', function() {

  it('should properly parse a CSV string into an object', function(done) {

    var source = new PipeSource({decodeStrings: false, encoding: 'utf8'});
    source.arrange('Column1,Column2,Column3');
    source.arrange('56,"a string",42-36-42');

    var target = new PipeTarget({objectMode: true});
    target.arrange(['Column1', 'Column2', 'Column3']);
    target.arrange([56, 'a string', '42-36-42']);
    target.on('finish', function() {
      target.assert();
      done();
    });

    var parser = new CsvParser();

    source.pipe(parser).pipe(target);

  });

});
