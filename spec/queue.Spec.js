var Queue = require('../util/queue');

describe('Queue', function() {

    it('should return pushed items in reverse order.', function() {

      var q = new Queue();

      expect(q.length()).toBe(0);
      q.push('first');
      expect(q.length()).toBe(1);
      q.push('second');
      expect(q.length()).toBe(2);
      q.push('third');
      expect(q.length()).toBe(3);

      expect(q.pop()).toBe('third');
      expect(q.length()).toBe(2);
      expect(q.pop()).toBe('second');
      expect(q.length()).toBe(1);
      expect(q.pop()).toBe('first');
      expect(q.length()).toBe(0);

      expect(function() { q.pop(); }).toThrowError(Error, 'Called pop() on empty queue.');

    });

});
