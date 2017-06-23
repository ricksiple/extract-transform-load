var fs = require('fs');
var stream = require('stream');

class Target extends stream.Writable {

   constructor(options) {
     super(options);
   }

   _write(chunk, encoding, write_complete) {
     console.log('_write');
     write_complete();
   }

   _final(final_complete) {
     // not sure why this event isn't firing????
     console.log("_final");
     final_complete();
   }

}
var source = fs.createReadStream('./test.csv', {encoding: 'utf8', decodeStrings:false});

var target = new Target({encoding: 'utf8', decodeStrings: false});
target.on('error', function(err) { console.log(err); } );

source.pipe(target);
