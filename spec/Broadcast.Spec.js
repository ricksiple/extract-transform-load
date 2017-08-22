var Broadcast = require('../Broadcast');

var PipeSource = require('../util/PipeSource');
var PipeTarget = require('../util/PipeTarget');

function test_compare(expected, actual) {
  return expected.id === actual.id && expected.name === actual.name && expected.role === actual.role;
}

function broadcast_duplicate(chunk) {
  var o = {};
  o.id = chunk.id;
  o.name = chunk.name;
  o.role = chunk.role;
  return o;
}

var test_data = [];
test_data.push({id:1,name:'Homer',role:'husband'});
test_data.push({id:2,name:'Marge',role:'wife'});
test_data.push({id:3,name:'Lisa',role:'daughter'});
test_data.push({id:4,name:'Bart',role:'son'});

describe('Broadcast', function() {

  it('should populate one target streams from a single source.', function(done) {

    var source = new PipeSource({objectMode:true});
    source.on('error', function(error) { fail('source: ' + error); });
    test_data.forEach(function(v,i) { source.arrange(v); });

    var target1 = new PipeTarget({objectMode:true}, test_compare);
    target1.on('error', function(error) { fail('target1: ' + error); });
    target1.on('finish', function() {
      target1.assert();
      done();
    });
    test_data.forEach(function(v,i) { target1.arrange(v); });

    var broadcast = new Broadcast({objectMode:true}, broadcast_duplicate, [target1]);

    source.pipe(broadcast);

  });

  it('should populate two target streams from a single source.', function(done) {

    var source = new PipeSource({objectMode:true});
    source.on('error', function(error) { fail('source: ' + error); });
    test_data.forEach(function(v,i) { source.arrange(v); });

    function both_complete() {
      if (target1_complete && target2_complete) done();
    }

    var target1_complete = false;
    var target1 = new PipeTarget({objectMode:true}, test_compare);
    target1.on('error', function(error) { fail('target1: ' + error); });
    target1.on('finish', function() {
      target1.assert();
      target1_complete = true;
      both_complete();
    });
    test_data.forEach(function(v,i) { target1.arrange(v); });

    var target2_complete = false;
    var target2 = new PipeTarget({objectMode:true}, test_compare);
    target2.on('error', function(error) { fail('target2: ' + error); });
    target2.on('finish', function() {
      target2.assert();
      target2_complete = true;
      both_complete();
    });
    test_data.forEach(function(v,i) { target2.arrange(v); });

    var broadcast = new Broadcast({objectMode:true}, broadcast_duplicate, [target1, target2]);

    source.pipe(broadcast);

  });

});
