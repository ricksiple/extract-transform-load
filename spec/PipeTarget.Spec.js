var PipeTarget = require('../util/PipeTarget');
var PipeSource = require('../util/PipeSource');

describe('PipeTarget', function() {

  var source;
  var target;

  beforeEach(function() {
    source = new PipeSource({encoding: 'utf8', decodeStrings: false});
    target = new PipeTarget({encoding: 'utf8', decodeStrings: false});
  });

  it('should detect only a single line of input.', function(done) {

    source.arrange('This is the first line.');

    target.arrange('This is the first line.');
    target.on('finish', function() {
        target.assert(done);
      });

    source.pipe(target);

  });

  it('should detect two lines of input.', function(done) {

    source.arrange('This is the first line.');
    source.arrange('This is the second line.');

    target.arrange('This is the first line.');
    target.arrange('This is the second line.');
    target.on('finish', function() {
        target.assert(done);
      });

    source.pipe(target);

  });

  it('should report an error if a line is missing.', function(done) {

    source.arrange('This is the first line.');

    target.arrange('This is the first line.');
    target.arrange('This is the second line.');
    target.on('finish', function() {
        target.assert();
        done();
      });

    source.pipe(target);

  });

  it('should report an error if there is an extra line.', function(done) {

    source.arrange('This is the first line.');
    source.arrange('This is the second line.');

    target.arrange('This is the first line.');

    target.on('finish', function() {
        target.assert();
        done();
      });

    source.pipe(target);

  });

});
