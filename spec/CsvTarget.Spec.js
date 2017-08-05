var CsvTarget = require('../CsvTarget');
var PipeSource = require('../util/PipeSource');
var PipeTarget = require('../util/PipeTarget');

describe('CsvTarget', () => {

  it('should convert objects to lines of comma separated text.', (done) => {

    var source = new PipeSource({objectMode: true});
    source.arrange({name: 'John', id: 2, title: 'Software Developer'});
    source.arrange({name: 'Betty', id:1, title: 'Software Tester'});
    source.arrange({name: 'Joan', id:3, title: 'Director'});
    source.on('error', (error) => { fail('SOURCE: ' + error); done(); });

    var target = new PipeTarget({objectMode: true});
    target.arrange('"Employee Id","Employee Name","Employee Title"');
    target.arrange('2,"John","Software Developer"');
    target.arrange('1,"Betty","Software Tester"');
    target.arrange('3,"Joan","Director"');
    target.on('error', (error) => { fail('TARGET: ' + error); done(); });
    target.on('finish', done);

    var csv = new CsvTarget({objectMode: true}, ['id', 'name', 'title'], ['Employee Id', 'Employee Name', 'Employee Title'], [Intl.NumberFormat(), CsvTarget.quoteString, CsvTarget.quoteString]);
    csv.on('error', (error) => { fail('CsvTarget: ' + error); done(); });

    source.pipe(csv).pipe(target);

  });

  it('default to using fields name for headers.', (done) => {

    var source = new PipeSource({objectMode: true});
    source.arrange({name: 'John', id: 2, title: 'Software Developer'});
    source.arrange({name: 'Betty', id:1, title: 'Software Tester'});
    source.arrange({name: 'Joan', id:3, title: 'Director'});
    source.on('error', (error) => { fail('SOURCE: ' + error); done(); });

    var target = new PipeTarget({objectMode: true});
    target.arrange('"id","name","title"');
    target.arrange('2,"John","Software Developer"');
    target.arrange('1,"Betty","Software Tester"');
    target.arrange('3,"Joan","Director"');
    target.on('error', (error) => { fail('TARGET: ' + error); done(); });
    target.on('finish', done);

    var csv = new CsvTarget({objectMode: true}, ['id', 'name', 'title'], null, [Intl.NumberFormat(), CsvTarget.quoteString, CsvTarget.quoteString]);
    csv.on('error', (error) => { fail('CsvTarget: ' + error); done(); });

    source.pipe(csv).pipe(target);

  });

  it('should throw an error if the header count does not match the field count.', () => {

    expect( () => {
      var csv = new CsvTarget({objectMode: true}, ['id', 'name', 'title'], ['Employee_Id', 'Employee_Name'], [Intl.NumberFormat(), CsvTarget.quoteString, CsvTarget.quoteString]);
    }).toThrowError();

  });

  it('should throw an error if the formatter count does not match the field count.', () => {

    expect( () => {
      var csv = new CsvTarget({objectMode: true}, ['id', 'name', 'title'], ['Employee_Id', 'Employee_Name', 'Employee_Title'], [Intl.NumberFormat(), CsvTarget.quoteString]);
    }).toThrowError();

  });

});
