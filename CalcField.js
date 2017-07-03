var stream = require('stream');

class CalcField extends stream.Transform {

  constructor(options, calculator) {
    super(options);
    this.calculator = calculator;
  }

  _transform(chunk, encoding, chunk_complete) {
    this.push(this.calculator(chunk));
    chunk_complete();
  }
}

module.exports = CalcField;
