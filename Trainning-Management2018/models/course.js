var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/examdb');
var course_collection = db.get('courses');
var record_collection = db.get('learning_record');

module.exports = {
// MAKE VALIDATION FUNCTIONS HERE
// Create new course in the database
create: function(course, cb) {
  course_collection.insert(course, cb);
},

// Retrieve course using courseid
getBycourseid: function(courseid, cb) {
	console.log('find course');
	console.log(courseid);
	console.log('find course end');
  course_collection.findOne({courseid: courseid}, {}, cb);
},

// Update an existing course by courseid
update: function(prevcourseid, course, cb) {
  course_collection.update({courseid: prevcourseid},
  { $set: {courseid: course.courseid, coursename: course.coursename} },
  cb);
},

update_name: function(prevcourseid, course, cb) {
  course_collection.update({courseid: prevcourseid},
  { $set: {courseid: course.courseid, coursename: course.coursename} },
  cb);
},

get_courses:function(cb) {
  course_collection.find({}, {}, cb);
},

get_courseid_charpters:function(courseid, cb) {
  console.log('find course');
  console.log(courseid);
  console.log('find course end');
  course_collection.findOne({courseid: courseid}, {}, cb);
},

update_courseid_charpters:function(courseid,charpters,cb) {
  console.log('update_courseid_charpters in mdb');
  console.log(courseid);
  console.log(charpters);
  course_collection.update({courseid: courseid},
  { $set: {courseid: courseid, charpter: charpters} },
  cb);
},


// Remove an existing course by courseid
remove: function(courseid, cb) {
  console.log(courseid);
  course_collection.remove({courseid: courseid}, cb);
}

};







