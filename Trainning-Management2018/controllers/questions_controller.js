var express = require('express')
  , router = express.Router()
  , Questions = require('../models/questions');

router.get('/', function(req, res) {
  res.render('faculties/questions', {title:"Questions"});
});

module.exports = router;
