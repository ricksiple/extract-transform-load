var stream = require('stream');

class UnionAll extends stream.Readable {

  constructor(streams, streamOptions) {
    super(streamOptions || { objectMode: true });

    this.streams = streams;
    this.streamCount = streams.length;
    this.isPaused = false;

    this._pauseStreams();
    this._configureStreams();
  }

  _read(size) {
    this._resumeStreams();
  }

  _pauseStreams() {
    if (this.isPaused) return;
    this.streams.forEach(function(v, i) {
      v.pause();
    });
    this.isPaused = true;
  }

  _configureStreams() {
    var me = this;
    this.streams.forEach(function(v, i) {
      v.on('data', function(chunk) {
        if (!me.push(chunk)) {
          me._pauseStreams();
        }
      });
      v.on('end', function() {
        me.streamCount--;
        if (me.streamCount === 0) { me.push(null); }
      });
    }, this);
  }

  _resumeStreams() {
    if (!this.isPaused) return;
    this.streams.forEach(function(v,i) { v.resume(); });
    this.isPaused = false;
  }

}

module.exports = UnionAll;
