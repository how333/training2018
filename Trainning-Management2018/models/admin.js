var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/examdb');
var admin_collection = db.get('admin');
admin_collection.insert({"username":"luder","password":"luder"});

module.exports = {
    
findByUserName: function(username, cb) {
  console.log('admin find in db');
  admin_collection.findOne({username: username}, {}, cb);
},

create: function(admin, cb) {
  console.log(admin);
  admin_collection.insert(admin, cb);
  
},


// Retrieve admin using username
getByUserName: function(username, cb) {
	//console.log(admin_collection);
  admin_collection.findOne({username: username}, {}, cb);
},

// Update an existing admin by username
update: function(prevusername, admin, cb) {
	console.log(prevusername);
	console.log(admin);
  admin_collection.update({username: admin.username},
  { $set: {username: admin.username, password: admin.password,
   rollno: admin.rollno} },
  cb);
},

// Remove an existing admin by username
remove: function(username, cb) {
  admin_collection.remove({username: username}, cb);
},

};







