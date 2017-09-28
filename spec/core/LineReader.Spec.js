var stream = require('stream');

var LineReader = require('../../core/LineReader');

var PipeSource = require('../../util/PipeSource');
var PipeTarget = require('../../util/PipeTarget');

describe("LineReader", function() {

  it("should convert block reads to a series strings", function(done) {

    var src = new PipeSource({ encoding: 'utf8', decodeStrings: false });
    src.arrange('"code","name","currency');
    src.arrange('Id","id"\r\n"NDX Inde');
    src.arrange('x","NASDAQ 10');
    src.arrange('0","USD",3\r\n"SPX Index","S&P 5');
    src.arrange('00","USD",1\r\n"MXWO Inde');
    src.arrange('x","MSCI World","USD",2');

    var tgt = new PipeTarget(null, { encoding: 'utf8', decodeStrings: false });
    tgt.arrange('"code","name","currencyId","id"');
    tgt.arrange('"NDX Index","NASDAQ 100","USD",3');
    tgt.arrange('"SPX Index","S&P 500","USD",1');
    tgt.arrange('"MXWO Index","MSCI World","USD",2');
    // tgt.arrange('test');
    tgt.on('finish', function() {
      tgt.assert();
      done();
    });

    var lineReader = new LineReader()
      .on("error", function(err) { throw "toStringTransform: " + err; });

    src.pipe(lineReader).pipe(tgt);

  });

});
