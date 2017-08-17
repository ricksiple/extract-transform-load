var Stack = require('../util/stack');

describe('Stack', function() {

    it('should return pushed items in same order.', function() {


      var s = new Stack();

      expect(s.length()).toBe(0);
      s.push('first');
      expect(s.length()).toBe(1);
      s.push('second');
      expect(s.length()).toBe(2);
      s.push('third');
      expect(s.length()).toBe(3);

      expect(s.pop()).toBe('first');
      expect(s.length()).toBe(2);
      expect(s.pop()).toBe('second');
      expect(s.length()).toBe(1);
      expect(s.pop()).toBe('third');
      expect(s.length()).toBe(0);

      expect(function() { s.pop(); }).toThrowError(Error, 'Called pop() on empty stack.');

    });

});
