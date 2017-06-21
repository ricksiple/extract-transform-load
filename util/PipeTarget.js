var stream = require('stream');

class PipeTarget extends stream.Writable {

   constructor(options) {
     super(options);
     this.expected = [];
   }

   _write(chunk, encoding, callback) {
     var value = this.expected.shift();
     if (chunk !== value) {
       callback(new Error(chunk + ' !== ' + value));
     } else {
       callback();
     }
   }

   _final(callback) {
     // not sure why this event isn't firing????
     console.log("FINAL");
     callback();
   }

   arrange(value) {
     this.expected.push(value);
   }

   assert() {
     if (this.expected.length > 0) throw new Error('PipeTarget: ' + this.expected.length + ' unexpected items still in queue.');
   }

}

module.exports = PipeTarget;
