var PipeSource = require('../util/PipeSource');
var LineReader = require('../LineReader');
var CsvParser = require('../CsvParser');
var PipeTarget = require('../util/PipeTarget');

describe('CSV pipeline', function() {

  it('should properly read and parse a csv file.', function(done) {

    var source = new PipeSource({decodeStrings: false, encoding:'utf8'});
    source.on('error', function(error) { console.log('PipeSource: ' + error); });
    source.arrange('"id","name","handle"\r\n4,"Rick","Kojoto"\r\n2,"Heather","Koneko"\r\n1,"Becky","Gecko"\r\n3,"Zach","Techno"');

    var reader = new LineReader({decodeStrings: false, encoding:'utf8'});
    reader.on('error', function(error) { console.log('LineReader: ' + error); });

    var parser = new CsvParser({objectMode: true, useHeaders: true});
    parser.on('error', function(error) { console.log('CsvParser: ' + error); });

    var target = new PipeTarget({objectMode: true}, function(chunk, value) {
      return chunk.id === value.id && chunk.name === value.name && chunk.handle === value.handle;
    });
    target.on('error', function(error) { console.log('PipeTarget: ' + error); });
    target.on('finish', function() {
      target.assert();
      done();
    });
    target.arrange({id:4, name:'Rick', handle:'Kojoto'});
    target.arrange({id:2, name:'Heather', handle:'Koneko'});
    target.arrange({id:1, name:'Becky', handle:'Gecko'});
    target.arrange({id:3, name:'Zach', handle:'Techno'});

    source.pipe(reader).pipe(parser).pipe(target);

  });

});
