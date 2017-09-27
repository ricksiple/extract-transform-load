var CalcField = require('../CalcField');

var PipeSource = require('../util/PipeSource');
var PipeTarget = require('../util/PipeTarget');

describe('CalcField', function() {

  it('should compute a math equation', function(done) {

    var source = new PipeSource();
    source.on('error', function(error) { fail('PipeSource: ' + error); });
    source.arrange({orderId: 1, itemId: "NU001", units: 3, cost: 4.5});
    source.arrange({orderId: 2, itemId: "EX045", units: 5, cost: 0.34});

    var calc = new CalcField(
      function(chunk) {
        chunk.total = chunk.units * chunk.cost;
        return chunk;
      });
    source.on('error', function(error) { fail('CalcField: ' + error); });

    var target = new PipeTarget(
      function(actual, expected) {
        var actual_total = Math.round(actual.total * 100) / 100;
        var expected_total = Math.round(expected.total * 100) / 100;
        return actual_total === expected_total;
      }
    );
    target.on('error', function(error) {
      fail('PipeTarget: ' + error);
      done();
    });
    target.on('finish', function() {
      target.assert();
      done();
    });
    target.arrange({orderId: 1, itemId: "NU001", units: 3, cost: 4.5, total: 13.5});
    target.arrange({orderId: 2, itemId: "EX045", units: 5, cost: 0.34, total: 1.7});

    source.pipe(calc).pipe(target);

  });

});
