var fs = require('fs');
var stream = require('stream');
var PipeSource = require('../util/PipeSource');
var PipeTarget = require('../util/PipeTarget');
var LineReader = require('../LineReader');

// class PipeTarget extends stream.Writable {
//
//    constructor(options) {
//      super(options);
//      this.expected = [];
//    }
//
//    _write(chunk, encoding, callback) {
//      expect(chunk).toBe(this.expected.shift());
//      callback();
//    }
//
//    arrange(value) {
//      this.expected.push(value);
//    }
//
//    assert(callback) {
//      expect(this.expected.length).toBe(0);
//      callback();
//    }
//
// }
//
describe("LineReader", function() {

  it("should convert block reads to a series strings", function(done) {

    var src = new PipeSource({ encoding: 'utf8', decodeStrings: false });
    src.arrange('"code","name","currency');
    src.arrange('Id","id"\r\n"NDX Inde');
    src.arrange('x","NASDAQ 10');
    src.arrange('0","USD",3\r\n"SPX Index","S&P 5');
    src.arrange('00","USD",1\r\n"MXWO Inde');
    src.arrange('x","MSCI World","USD",2');

    var tgt = new PipeTarget({ encoding: 'utf8', decodeStrings: false });
    tgt.arrange('"code","name","currencyId","id"');
    tgt.arrange('"NDX Index","NASDAQ 100","USD",3');
    tgt.arrange('"SPX Index","S&P 500","USD",1');
    tgt.arrange('"MXWO Index","MSCI World","USD",2');
    // tgt.arrange('test');
    tgt.on('finish', function() { tgt.assert(done); });

    var lineReader = new LineReader({ encoding: 'utf8', decodeStrings: false })
      .on("error", function(err) { throw "toStringTransform: " + err; });

    src.pipe(lineReader).pipe(tgt);

  });

});

// describe("Entity.Memory", function() {
//
//     var modelFactory = require("../routes/models/entity.memory");
//     var model;
//
//     beforeEach(function() {
//       model = modelFactory();
//     });
//
//     it("should be able to retrieve all entities", function(done) {
//       model.read(function(err, rows) {
//         expect(err).toBeFalsy();
//         expect(rows.length).toBe(4);
//         // tell Jasmine we're done
//         done();
//       })
//     });
//
//     it("should be able to retrieve a single entity", function(done) {
//       model.read(2, function(err, rows) {
//         expect(err).toBeFalsy();
//         expect(rows.length).toBe(1);
//         expect(rows[0].id).toBe(2);
//         expect(rows[0].code).toBe("MXWO Index");
//         expect(rows[0].name).toBe("MSCI World");
//         expect(rows[0].currencyId).toBe("USD");
//         // tell Jasmine we're done
//         done();
//       })
//     });
//
//     it("should be able to add an entity", function(done) {
//       model.insert({$code: 'NDX entity', $name: 'NASDAQ 100', $currencyId: 'USD'},
//           function(err) {
//               expect(err).toBeFalsy();
//               expect(this.lastID).toBe(5);
//               expect(this.changes).toBe(1);
//               // tell Jasmine we're done
//               done();
//             }
//       )
//     });
//
//     it("should be able to update an entity", function(done) {
//       model.update({$id: 3, $code: 'NDX Index', $name: 'NASDAQ 100', $currencyId: 'USD'},
//           function(err) {
//               expect(err).toBeFalsy();
//               expect(this.lastID).toBe(4);
//               expect(this.changes).toBe(1);
//               // tell Jasmine we're done
//               done();
//             }
//       )
//     });
//
//     it("should be able to delete an entity", function(done) {
//       model.delete(3,
//           function(err) {
//               expect(err).toBeFalsy();
//               expect(this.lastID).toBe(4);
//               expect(this.changes).toBe(1);
//               // tell Jasmine we're done
//               done();
//             }
//       )
//     });
//
// });
