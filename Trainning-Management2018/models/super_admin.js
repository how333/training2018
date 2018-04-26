var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/examdb');
var super_admin_collection = db.get('super_admin');

super_admin_collection.insert({"username":"luder","password":"luder"});

module.exports = {
    
findByUserName: function(username, cb) {
  super_admin_collection.findOne({username: username}, cb);
},

};







