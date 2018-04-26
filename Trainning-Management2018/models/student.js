var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/examdb');
var student_collection = db.get('students');



module.exports = {
// MAKE VALIDATION FUNCTIONS HERE
// Create new student in the database
create: function(student, cb) {
  console.log(student);
  student_collection.insert(student, cb);
},

findByUserName: function(username, cb) {
  student_collection.findOne({username: username}, {}, cb);
},

findByUserNameAndPassword: function(username, password,cb) {
  student_collection.findOne({username: username,password:password}, {}, cb);
},

findByUserCardID: function(username, cb) {
  student_collection.findOne({IDnumber: username}, {}, cb);
},

findByMobileNumber: function(username, cb) {
  student_collection.findOne({contact: username}, {}, cb);
},

// Retrieve student using username
getByUserName: function(username, cb) {
	console.log(student_collection);
  student_collection.findOne({username: username}, {}, cb);
},

// Update an existing student by username
update: function(prevusername, student, cb) {
	console.log(prevusername);
	console.log(student);
  student_collection.update({username: prevusername},
  { $set: {username: student.username, 
    IDnumber: student.IDnumber, 
    password: student.password, 
    sexuality: student.sexuality,
    birth: student.birth,
    workunit: student.workunit,
    carrier: student.carrier,
    contact: student.contact} },
  cb);
},

change_password: function(username, password, cb) {

  student_collection.update({username: username},
  { $set: {username: username, password: password} },
  cb);
},
getall:function(cb) {
  console.log('getall');
    student_collection.find({}, {}, cb);
},
// Remove an existing student by username
remove: function(username, cb) {
  student_collection.remove({username: username}, cb);
},

// Register student to a course by username and course ID
register: function(username, course_code, cb) {
student_collection.update(
   { username: username },
   { $addToSet: { course_list: { $each: [ course_code] } } }, cb);
},

deregister: function(username, course_code, cb) 
{
student_collection.update(
	{username: username},
	{ $pull: {  course_list: course_code } },cb);
},

getBycourseid: function(username,course_code, cb) {
	console.log("student find course_code");
	console.log(username);
	console.log(course_code);
  student_collection.findOne({username: username, course_list :course_code}, {}, cb);
}

};







