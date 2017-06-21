var PipeSource = require('../util/PipeSource');

describe('PipeSource', function() {

  var source;

  beforeEach(function() {
    source = new PipeSource({encoding: 'utf8', decodeStrings: false});
  });

  it('should return a single line as string.', function() {

    source.arrange('Only one line.');
    expect(source.read()).toBe('Only one line.');
    expect(source.read()).toBeNull();

  });

  it("should return a two lines as two string.", function() {

    source.arrange('This is one line.');
    source.arrange('This is the other line.');
    expect(source.read()).toBe('This is one line.');
    expect(source.read()).toBe('This is the other line.');
    expect(source.read()).toBeNull();

  });

});
