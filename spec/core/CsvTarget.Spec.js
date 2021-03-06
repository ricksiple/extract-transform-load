var CsvTarget = require('../../core/CsvTarget');
var PipeSource = require('../../util/PipeSource');
var PipeTarget = require('../../util/PipeTarget');

describe('CsvTarget', () => {

  var source;
  var target;
  var csv;

  beforeEach(() => {

    source = new PipeSource();
    source.arrange({name: 'John', id: 2, title: 'Software Developer'});
    source.arrange({name: 'Betty', id:1, title: 'Software Tester'});
    source.arrange({name: 'Joan', id:3, title: 'Director'});

    target = new PipeTarget();

  });

  it('should convert objects to lines of comma separated text.', (done) => {

    source.on('error', (error) => { fail('SOURCE: ' + error); done(); });

    target.arrange('"Employee Id","Employee Name","Employee Title"\r\n');
    target.arrange('2,"John","Software Developer"\r\n');
    target.arrange('1,"Betty","Software Tester"\r\n');
    target.arrange('3,"Joan","Director"\r\n');
    target.on('error', (error) => { fail('TARGET: ' + error); done(); });
    target.on('finish', done);

    var csv = new CsvTarget(['id', 'name', 'title'], [Intl.NumberFormat(), CsvTarget.quoteString, CsvTarget.quoteString], ['Employee Id', 'Employee Name', 'Employee Title']);
    csv.on('error', (error) => { fail('CsvTarget: ' + error); done(); });

    source.pipe(csv).pipe(target);

  });

  it('default to using fields name for headers.', (done) => {

    source.on('error', (error) => { fail('SOURCE: ' + error); done(); });

    target.arrange('"id","name","title"\r\n');
    target.arrange('2,"John","Software Developer"\r\n');
    target.arrange('1,"Betty","Software Tester"\r\n');
    target.arrange('3,"Joan","Director"\r\n');
    target.on('error', (error) => { fail('TARGET: ' + error); done(); });
    target.on('finish', done);

    var csv = new CsvTarget(['id', 'name', 'title'], [Intl.NumberFormat(), CsvTarget.quoteString, CsvTarget.quoteString]);
    csv.on('error', (error) => { fail('CsvTarget: ' + error); done(); });

    source.pipe(csv).pipe(target);

  });

  it('should throw an error if the header count does not match the field count.', () => {

    expect( () => {
      var csv = new CsvTarget(['id', 'name', 'title'], [Intl.NumberFormat(), CsvTarget.quoteString, CsvTarget.quoteString], ['Employee_Id', 'Employee_Name']);
    }).toThrowError();

  });

  it('should throw an error if the formatter count does not match the field count.', () => {

    expect( () => {
      var csv = new CsvTarget(['id', 'name', 'title'], [Intl.NumberFormat(), CsvTarget.quoteString], ['Employee_Id', 'Employee_Name', 'Employee_Title']);
    }).toThrowError();

  });

  it('should default all formats to quoteString if an array is not provided.', (done) => {

    source.on('error', (error) => { fail('SOURCE: ' + error); done(); });

    target.arrange('"id","name","title"\r\n');
    target.arrange('"2","John","Software Developer"\r\n');
    target.arrange('"1","Betty","Software Tester"\r\n');
    target.arrange('"3","Joan","Director"\r\n');
    target.on('error', (error) => { fail('TARGET: ' + error); done(); });
    target.on('finish', done);

    var csv = new CsvTarget(['id', 'name', 'title']);
    csv.on('error', (error) => { fail('CsvTarget: ' + error); done(); });

    source.pipe(csv).pipe(target);

  });

});
