var stream = require('stream');

class PipeTarget extends stream.Writable {

   constructor(options) {
     super(options);
     this.expected = [];
   }

   _write(chunk, encoding, callback) {
     console.log(chunk + "=" + value);
     var value = this.expected.shift();
     if (chunk !== value) { throw chunk + ' !== ' + value; }
     callback();
   }

   _final(callback) {
     // not sure why this event isn't firing????
     console.log("FINAL");
     callback();
   }

   arrange(value) {
     console.log(value);
     this.expected.push(value);
   }

   assert(callback) {
     console.log(this.expected.length);
     if (this.expected.length) { throw 'PipeTarget: ' + this.expected.length + ' expected items still in the queue.'}
     callback();
   }

}

module.exports = PipeTarget;
