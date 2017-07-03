var PipeSource = require('../util/PipeSource');
var PipeTarget = require('../util/PipeTarget');
var CsvParser = require('../CsvParser');

describe('CsvParser', function() {

  var source;
  var target;
  var parser;

  it('should properly parse a CSV string into an object', function(done) {

    source = new PipeSource({decodeStrings: false, encoding: 'utf8'});
    source.arrange('Column1,Column2,Column3');
    source.arrange('one,two,red,blue');
    source.arrange('three,four,"window,door"');

    target = new PipeTarget({objectMode: true}, PipeTarget.compareArrays);
    target.arrange(['Column1', 'Column2', 'Column3']);
    target.arrange(['one','two','red','blue']);
    target.arrange(['three','four','window,door']);
    target.on('finish', function() {
      target.assert();
      done();
    });

    parser = new CsvParser({objectMode: true});

    source.pipe(parser).pipe(target);

  });

  it('should use the headers as field names', function(done) {

    source = new PipeSource({decodeStrings: false, encoding: 'utf8'});
    source.arrange('id,name,company,city,state');
    source.arrange('1,"Rick Siple","Marvin & Palmer Associates, Inc.","Wilmington","DE"');
    source.arrange('4,"Zach Siple","Zanicus Virtual Industries","Newark","DE"');

    target = new PipeTarget({objectMode: true}, function(chunk, value) {
      return chunk.id === value.id && chunk.name === value.name && chunk.company === value.company && chunk.city === value.city && chunk.state === value.state;
    });
    target.arrange({id:1,name:"Rick Siple",company:"Marvin & Palmer Associates, Inc.",city:"Wilmington",state:"DE"});
    target.arrange({id:4,name:"Zach Siple",company:"Zanicus Virtual Industries",city:"Newark",state:"DE"});
    target.on('finish', function() {
      target.assert();
      done();
    });

    parser = new CsvParser({objectMode: true, useHeaders: true});

    source.pipe(parser).pipe(target);

  });

});
