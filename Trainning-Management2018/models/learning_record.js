var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/examdb');
var record_collection = db.get('learning_record');

module.exports = {

getAllUsers:function(cb) {
	record_collection.find({}, cb);
},

// deleteDocByCourseId:function(username, courseid, cb) {
// 	console.log(courseid);
// 	record_collection.update(
// 		{'username':username, 'course_id':courseid},
// 		{$pull:}
// 		);
// },

getByUserName:function(username, cb) {
	record_collection.findOne({username:username}, {}, cb);
},

create_student:function(username) {
	console.log(username);
	record_collection.insert({'username':username, 'record_list':{'document':[], 'video':[], 'scenario':[]}});
},

create_course_doc:function(username, course_code, docname) {
	console.log(docname);
	record_collection.update(
		{'username':username},
		{$addToSet:{'record_list.document':{'course_id':course_code, 'docName':docname, 'record':'0'}}}
	);
},

create_course_video:function(username, course_code, docname) {
	console.log(docname);
	record_collection.update(
		{'username':username},
		{$addToSet:{'record_list.video':{'course_id':course_code, 'docName':docname, 'record':'0'}}}
	);
},

create_course_scenario:function(username, course_code, docname) {
	console.log(docname);
	record_collection.update(
		{'username':username},
		{$addToSet:{'record_list.scenario':{'course_id':course_code, 'docName':docname, 'record':'0'}}}
	);
},

delete_course_doc:function(username, course_code) {
	// console.log(docname);
	record_collection.update(
		{'username':username},
		{$pull:{'record_list.document':{'course_id':course_code}}}
	);
},

delete_course_video:function(username, course_code) {
	// console.log(docname);
	record_collection.update(
		{'username':username},
		{$pull:{'record_list.video':{'course_id':course_code}}}
	);
},

delete_course_scenario:function(username, course_code) {
	// console.log(docname);
	record_collection.update(
		{'username':username},
		{$pull:{'record_list.scenario':{'course_id':course_code}}}
	);
},

update_document:function(prevusername, courseid, docname, new_record) {
	console.log(new_record);
	record_collection.update({'username':prevusername, 'record_list.document.docName':docname, 'record_list.document.course_id':courseid},{
		$set:{
			"record_list.document.$.record":new_record
		}
	});
},

update_video:function(prevusername, courseid, docname, new_record) {
	console.log(new_record);
	record_collection.update({'username':prevusername, 'record_list.video.docName':docname, 'record_list.video.course_id':courseid},{
		$set:{
			"record_list.video.$.record":new_record
		}
	});
},

update_scenario:function(prevusername, courseid, docname, new_record) {
	console.log(new_record);
	record_collection.update({'username':prevusername, 'record_list.scenario.docName':docname, 'record_list.scenario.course_id':courseid},{
		$set:{
			"record_list.scenario.$.record":new_record
		}
	});
}

};

	//Create new record in the database
	// create: function(record, cb) {
	// 	record_collection.insert(record, cb);
	// },

	//getByUserName: function(username, cb) {
		//console.log("weishenmedabuchulai?");
	// 	record_collection.findOne({username: username}, {}, cb);
	// }

// 	getUsername_Docname: function(username,cb) {
// 		record_collection.find({username:username}, cb);
// 	}
// 	// getByUserName_CourseId: function(username, courseid) {
// 	// 	record_collection.findOne({username: username, courseid: courseid}, {}, cb);
// 	// },

// 	// get_courseid_charpters:function(courseid, cb) {
// 	// 	console.log('find course');
// 	// 	console.log(courseid);
// 	// 	console.log('find course end');
// 	// 	record_collection.findOne({courseid: courseid}, {}, cb);
// 	// },
// 	// update: function(username, recordArray, cb) {
// 	// 	record_collection.update({username: username}, 
// 	// 		{$set:{recordArray.$.record}});
// 	// }

