var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/examdb');
var users = db.get('users');
var students = db.get('students');
var faculties = db.get('faculties');

module.exports = {

  getUsersByName:function(name, cb) {
    users.findOne({'username':name}, {}, cb);
  },

  create_user:function(usertype, username, password) {
    users.insert({'usertype':usertype, 'username':username, 'password':password});
  },

  create_student:function(username, password) {
    students.insert({'username':username, 'password':password});
  },

  create_faculty:function(username, password) {
    faculties.insert({'username':username, 'password':password});
  }
};
