var stream = require('stream');

class UnionAll extends stream.Readable {

  constructor(options, streams, verbose = false) {
    super(options);

    this.verbose = verbose;

    this.streams = streams;
    this.streamCount = streams.length;
    this.isPaused = false;

    this._pauseStreams();
    this._configureStreams();
  }

  _read(size) {
    if (this.verbose) console.log('UnionAll._read()');
    this._resumeStreams();
  }

  _pauseStreams() {
    if (this.verbose) console.log('UnionAll._pauseStreams;this.isPaused=' + this.isPaused);
    if (this.isPaused) return;
    this.streams.forEach(function(v, i) {
      v.pause();
    });
    this.isPaused = true;
  }

  _configureStreams() {
    if (this.verbose) console.log('UnionAll._configureStreams');
    var me = this;
    this.streams.forEach(function(v, i) {
      v.on('data', function(chunk) {
        if (me.verbose) console.log('UnionAll.stream.data event')
        if (!me.push(chunk)) {
          me._pauseStreams();
        }
      });
      v.on('end', function() {
        if (me.verbose) console.log('UnionAll.stream.end event')
        me.streamCount--;
        if (me.streamCount === 0) { me.push(null); }
      });
    }, this);
  }

  _resumeStreams() {
    if (this.verbose) console.log('UnionAll._resumeStreams;this.isPaused=' + this.isPaused);
    if (!this.isPaused) return;
    this.streams.forEach(function(v,i) { v.resume(); });
    this.isPaused = false;
  }

}

module.exports = UnionAll;
