var stream = require('stream');

class PipeTarget extends stream.Writable {

   constructor(options) {
     super(options);
     this.expected = [];
   }

   _write(chunk, encoding, write_complete) {
     var value = this.expected.shift();
     if (chunk !== value) {
       console.log(chunk + ' (' + chunk.length + ') !== ' + value + ' (' + value.length + ')');
       write_complete(new Error(chunk + ' !== ' + value));
     } else {
       write_complete();
     }
   }

   _final(final_complete) {
     // not sure why this event isn't firing????
     final_complete();
   }

   arrange(value) {
     this.expected.push(value);
   }

   assert() {
     if (this.expected.length > 0) throw new Error('PipeTarget: ' + this.expected.length + ' unexpected items still in queue.');
   }

}

module.exports = PipeTarget;
