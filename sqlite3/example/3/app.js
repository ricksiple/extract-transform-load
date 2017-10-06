var express = require('express');
var multer = require('multer');

var app = express();

// setup upload path
var upload = multer({dest: 'uploads'});
app.post('/upload', upload.single('data'),
    function(req, res, next)
    {
      // console.log(req);
      console.log(req.file);
      res.status(200).send("OK");
      next();
    }
  );

// setup static file path
app.use('/', express.static('public'));

// start listening
app.listen(3000, function() { console.log('listening on port 3000...'); });
