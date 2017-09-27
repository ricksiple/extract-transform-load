var PipeSource = require('../util/PipeSource');
var LineReader = require('../LineReader');
var CsvParser = require('../CsvParser');
var PipeTarget = require('../util/PipeTarget');

describe('CSV pipeline', function() {

  it('should properly read and parse a csv file.', function(done) {

    var source = new PipeSource({decodeStrings: false, encoding:'utf8'});
    source.on('error', function(error) { console.log('PipeSource: ' + error); });
    source.arrange('"id","name","handle"\r\n4,"Homer","Baldy"\r\n2,"Marge","Pearls"\r\n1,"Lisa","Smarty"\r\n3,"Bart","Trouble"');

    var reader = new LineReader({decodeStrings: false, encoding:'utf8'});
    reader.on('error', function(error) { console.log('LineReader: ' + error); });

    var parser = new CsvParser({useHeaders: true});
    parser.on('error', function(error) { console.log('CsvParser: ' + error); });

    var target = new PipeTarget(function(chunk, value) {
      return chunk.id === value.id && chunk.name === value.name && chunk.handle === value.handle;
    });
    target.on('error', function(error) { console.log('PipeTarget: ' + error); });
    target.on('finish', function() {
      target.assert();
      done();
    });
    target.arrange({id:4, name:'Homer', handle:'Baldy'});
    target.arrange({id:2, name:'Marge', handle:'Pearls'});
    target.arrange({id:1, name:'Lisa', handle:'Smarty'});
    target.arrange({id:3, name:'Bart', handle:'Trouble'});

    source.pipe(reader).pipe(parser).pipe(target);

  });

});
