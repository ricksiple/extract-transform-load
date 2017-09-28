var PipeTarget = require('../../util/PipeTarget');
var PipeSource = require('../../util/PipeSource');

describe('PipeTarget', function() {

  var source;
  var target;

  beforeEach(function() {
    source = new PipeSource({encoding: 'utf8', decodeStrings: false});
    target = new PipeTarget(null, {encoding: 'utf8', decodeStrings: false});
  });

  it('should detect only a single line of input.', function(done) {

    source.arrange('This is the first line.');

    target.arrange('This is the first line.');
    target
      .on('error', function(err) {
        fail('PipeTarget error event fired.');
      })
      .on('finish', function() {
        target.assert();
        done();
      });

    source.pipe(target);

  });

  it('should detect two lines of input.', function(done) {

    source.arrange('This is the first line.');
    source.arrange('This is the second line.');

    target.arrange('This is the first line.');
    target.arrange('This is the second line.');
    target
      .on('error', function(err) {
        fail('PipeTarget error event fired.');
      })
      .on('finish', function() {
        target.assert();
        done();
      });

    source.pipe(target);

  });

  it('should report an error if a line is missing.', function(done) {

    source.arrange('This is the first line.');

    target.arrange('This is the first line.');
    target.arrange('This is the second line.');
    target
      .on('error', function(err) {
        fail('PipeTarget error event should not have fired.');
      })
      .on('finish', function() {
        expect(target.assert).toThrowError();
        done();
      });

    source.pipe(target);

  });

  it('should report an error if there is an extra line.', function(done) {

    source.arrange('This is the first line.');
    source.arrange('This is the second line.');

    target.arrange('This is the first line.');

    target
      .on('error', function(err) {
        // this is the expected result
        done();
      })
      .on('finish', function() {
        fail('Did not detect the extra line.');
        done();
      });

    source.pipe(target);

  });

});
