var Broadcast = require('../Broadcast');
var CalcField = require('../CalcField');

var PipeSource = require('../util/PipeSource');
var PipeTarget = require('../util/PipeTarget');

function test_compare(expected, actual) {
  if (expected.id === actual.id && expected.name === actual.name && expected.role === actual.role) {
    return true;
  } else {
    console.log(expected);
    console.log(actual);
    return false;
  };
}

function broadcast_duplicate(chunk) {
  var o = {};
  o.id = chunk.id;
  o.name = chunk.name;
  o.role = chunk.role;
  return o;
}

var test_data = [];
test_data.push({id:1,name:'Rick',role:'husband'});
test_data.push({id:2,name:'Heather',role:'wife'});
test_data.push({id:3,name:'Becky',role:'daughter'});
test_data.push({id:4,name:'Zach',role:'son'});

var target1_data = [];
target1_data.push({id:-1,name:'Rick',role:'husband'});
target1_data.push({id:-2,name:'Heather',role:'wife'});
target1_data.push({id:-3,name:'Becky',role:'daughter'});
target1_data.push({id:-4,name:'Zach',role:'son'});

var target2_data = [];
target2_data.push({id:1,name:'Rick Siple',role:'husband'});
target2_data.push({id:2,name:'Heather Siple',role:'wife'});
target2_data.push({id:3,name:'Becky Siple',role:'daughter'});
target2_data.push({id:4,name:'Zach Siple',role:'son'});

describe('Broadcast-CalcField', function() {

  it('should populate two target streams from a single source.', function(done) {

    var source = new PipeSource({objectMode:true});
    source.on('error', function(error) { fail('source: ' + error); });
    test_data.forEach(function(v,i) { source.arrange(v); });

    function both_complete() {
      if (target1_complete && target2_complete) done();
    }

    var calc1 = new CalcField({objectMode:true},
      function(chunk) {
        chunk.id = -chunk.id;
        return chunk;
      });
    calc1.on('error', function(error) { fail('calc1: ' + error); });

    var target1_complete = false;
    var target1 = new PipeTarget({objectMode:true}, test_compare);
    target1.on('error', function(error) { fail('target1: ' + error); });
    target1.on('finish', function() {
      target1.assert();
      target1_complete = true;
      both_complete();
    });
    target1_data.forEach(function(v,i) { target1.arrange(v); });

    var calc2 = new CalcField({objectMode:true},
      function(chunk) {
        chunk.name = chunk.name + ' Siple';
        return chunk;
      });
    calc2.on('error', function(error) { fail('calc2: ' + error); });

    var target2_complete = false;
    var target2 = new PipeTarget({objectMode:true}, test_compare);
    target2.on('error', function(error) { fail('target2: ' + error); });
    target2.on('finish', function() {
      target2.assert();
      target2_complete = true;
      both_complete();
    });
    target2_data.forEach(function(v,i) { target2.arrange(v); });

    var broadcast = new Broadcast({objectMode:true}, broadcast_duplicate, [calc1, calc2]);

    calc1.pipe(target1);
    calc2.pipe(target2);

    source.pipe(broadcast);

  });

});
