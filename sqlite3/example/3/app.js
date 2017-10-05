var express = require('express');
var multer = require('multer');

var app = express();

// setup upload path
var upload = multer({dest: 'uploads'});
var router = express.Router();
router.route('/upload')
  .post(upload.single('perf_file'),
    function(req, res, next)
    {
      console.log(req.file);
      next();
    }
  );
app.use('/upload', router);

// setup static file path
app.use(express.static('public'));

// start listening
app.listen(3000, function() { console.log('listening on port 3000...'); });
