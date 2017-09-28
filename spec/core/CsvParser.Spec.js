var PipeSource = require('../../util/PipeSource');
var PipeTarget = require('../../util/PipeTarget');
var CsvParser = require('../../core/CsvParser');

describe('CsvParser', function() {

  var source;
  var target;
  var parser;

  it('should properly parse a CSV string into an object', function(done) {

    source = new PipeSource({decodeStrings: false, encoding: 'utf8'});
    source.arrange('Column1,Column2,Column3');
    source.arrange('one,two,red,blue');
    source.arrange('three,four,"window,door"');

    target = new PipeTarget(PipeTarget.compareArrays);
    target.arrange(['Column1', 'Column2', 'Column3']);
    target.arrange(['one','two','red','blue']);
    target.arrange(['three','four','window,door']);
    target.on('finish', function() {
      target.assert();
      done();
    });

    parser = new CsvParser();

    source.pipe(parser).pipe(target);

  });

  it('should use the headers as field names', function(done) {

    source = new PipeSource({decodeStrings: false, encoding: 'utf8'});
    source.arrange('id,name,company,city,state');
    source.arrange('1,"Homer Simpson","Springfield Nuclear Power","Springfield","ZZ"');
    source.arrange('4,"Bart Simpson","Kiwk-E-Mart","Summerfield","XX"');

    target = new PipeTarget(function(chunk, value) {
      return chunk.id === value.id && chunk.name === value.name && chunk.company === value.company && chunk.city === value.city && chunk.state === value.state;
    });
    target.arrange({id:1,name:"Homer Simpson",company:"Springfield Nuclear Power",city:"Springfield",state:"ZZ"});
    target.arrange({id:4,name:"Bart Simpson",company:"Kiwk-E-Mart",city:"Summerfield",state:"XX"});
    target.on('finish', function() {
      target.assert();
      done();
    });

    parser = new CsvParser({useHeaders: true});

    source.pipe(parser).pipe(target);

  });

});
