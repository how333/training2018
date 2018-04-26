var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/examdb');
var question_bank = db.get('question_bank');

module.exports = {

  getBankByName:function(name, cb) {
    question_bank.finOne({'bankname':name}, {}, cb);
  }


};