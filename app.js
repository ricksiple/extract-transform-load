var stream = require('stream');
var PipeSource = require('./util/PipeSource');
var PipeTarget = require('./util/PipeTarget');

var source = new PipeSource({objectMode: true});
source.arrange(['Column1','Column2','Column3']);
source.on('error', function(error) { console.log(error); });

var target = new PipeTarget({objectMode: true});
target.arrange(['Column1','Column2','Column3']);
target.on('error', function(error) { console.log(error); });

source.pipe(target);
