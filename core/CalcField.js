var stream = require('stream');

class CalcField extends stream.Transform {

  constructor(calculator, streamOptions) {
    super(streamOptions || { objectMode: true });
    this.calculator = calculator;
  }

  _transform(chunk, encoding, chunk_complete) {
    this.push(this.calculator(chunk));
    chunk_complete();
  }
}

module.exports = CalcField;
