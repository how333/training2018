var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/examdb');
var exam_collection = db.get('exams');
var student_collection = db.get('students');
var response_collection = db.get('responses');


module.exports = {
// MAKE VALIDATION FUNCTIONS HERE
// Create new student in the database
create: function(exam, cb) {
  exam_collection.insert(exam, cb);
},

getByExamCode: function(exam_code, cb) {
  console.log("db exam find getByExamCode");
  console.log(exam_code);
  exam_collection.findOne({exam_code: exam_code}, cb);
},

getResponseByExamCode: function(exam_code, username, cb) {
  console.log('getResponseByExamCode');
	console.log(exam_code);
	console.log('username');
	console.log(username);
  response_collection.findOne({exam_code: exam_code, username: username}, cb);
},

addQuestion: function(exam_code, question_full, cb) {
exam_collection.update(
   { exam_code: exam_code },
   { $push: { question_list: { $each: [ 
     {question: question_full.question,
     optionA: question_full.optionA,
     optionB: question_full.optionB,
     optionC: question_full.optionC,
     optionD: question_full.optionD,
     key: question_full.key
    } ] } } }, cb);
},

clearQuestion: function(exam_code, cb) {
  exam_collection.update({exam_code: exam_code},
  { $set: {question_list: []} },
  cb);
},


addQuestion_adventitious: function(exam_code, question_full, cb) {
exam_collection.update(
   { exam_code: exam_code },
   { $push: { question_list_adventitious: { $each: [ 
     {question: question_full.question,
     optionA: question_full.optionA,
     optionB: question_full.optionB,
     optionC: question_full.optionC,
     optionD: question_full.optionD,
     optionE: question_full.optionE,
     key: question_full.key
    } ] } } }, cb);
},

clearQuestion_adventitious: function(exam_code, cb) {
  exam_collection.update({exam_code: exam_code},
  { $set: {question_list_adventitious: []} },
  cb);
},

update_score: function(exam_code, username,score_subject, cb) {
  response_collection.update({exam_code: exam_code,username:username},
  { $set: {score_subject: score_subject} },
  cb);
},

update_time: function(exam_code, duration_hours,duration_minutes, cb) {
  exam_collection.update({exam_code: exam_code},
  { $set: {duration_hours: duration_hours,duration_minutes:duration_minutes} },
  cb);
},

update_score_operation: function(exam_code, username,score_operation,modify_time, cb) {
  response_collection.update({exam_code: exam_code,username:username},
  { $set: {score_operation: score_operation,modify_time:modify_time} },
  cb);
},

addQuestion_subjective: function(exam_code, question_full, cb) {
exam_collection.update(
   { exam_code: exam_code },
   { $push: { question_list_subjective: { $each: [ 
     {question: question_full.question,
      answer: question_full.answer,
     figures: question_full.figures
    } ] } } }, cb);
},

clearQuestion_subjective: function(exam_code, cb) {
  exam_collection.update({exam_code: exam_code},
  { $set: {question_list_subjective: []} },
  cb);
},

addQuestion_operation: function(exam_code, question_full, cb) {
  console.log('add operation');
  console.log(question_full);
exam_collection.update(
   { exam_code: exam_code },
   { $push: { question_list_operation: { $each: [ 
     {question: question_full.question,
     figures: question_full.figures,
     scenario:question_full.scenario
    } ] } } }, cb);
},

clearQuestion_operation: function(exam_code, cb) {
  exam_collection.update({exam_code: exam_code},
  { $set: {question_list_operation: []} },
  cb);
},

addResponses_time: function(username, exam_code, exam_start_time,cb) {


  //response_collection.insert(temp_response, cb);
  response_collection.update({username: username, exam_code: exam_code},
  { $set: {exam_start_time:exam_start_time} },
  cb);
},

addResponses_time_operation: function(username, exam_code, operation_exam_start_time,cb) {


  //response_collection.insert(temp_response, cb);
  response_collection.update({username: username, exam_code: exam_code},
  { $set: {operation_exam_start_time:operation_exam_start_time} },
  cb);
},

addResponses_num: function(username, exam_code, question_num_total, exam_start_time,cb) {

  //response_collection.insert(temp_response, cb);
  response_collection.update({username: username, exam_code: exam_code},
  { $set: {response_num:question_num_total} },
  cb);
},

addResponses_new: function(username, exam_code, exam_start_time,cb) {

  var temp_response = 
  {
      username: username,
      exam_code: exam_code,
      exam_start_time:exam_start_time
  };
  response_collection.insert(temp_response, cb);
},

addResponses_new_operation: function(username, exam_code, operation_exam_start_time,cb) {

  var temp_response = 
  {
      username: username,
      exam_code: exam_code,
      operation_exam_start_time:operation_exam_start_time
  };
  response_collection.insert(temp_response, cb);
},

// Submit Responses
addResponses: function(username, exam_code, IDnumber, response, cb) {

  var temp_response = 
  {
      username: username,
      exam_code: exam_code,
      response: response
  };
  response_collection.update({username: username, exam_code: exam_code},
  { $set: {response: response,IDnumber:IDnumber,exam_taken:true} },
  cb);

},

addResponses_operation: function(username, exam_code,IDnumber, cb) {


  response_collection.update({username: username, exam_code: exam_code},
  { $set: {IDnumber:IDnumber,exam_taken_operation:true} },
  cb);

},

saveResponses: function(username, exam_code, response_save, cb) {

  console.log('act in db');
  console.log(username);
  console.log(exam_code);
  console.log(response_save);
  response_collection.update({username: username, exam_code: exam_code},
  { $set: {response_save: response_save} },
  cb);

},

checkResponse: function(username, exam_code, cb) {
	console.log('find exam in dbbbbbbbbbbbb');
	console.log(username);
	console.log(exam_code);
  response_collection.findOne({username:username, exam_code: exam_code}, cb);

},

removeResponse: function(username, exam_code, cb) {
  console.log('find exam in db');
  
  console.log(exam_code);
  response_collection.remove({username:username, exam_code: exam_code}, cb);
},

FacultycheckResponseIsExist: function( exam_code, cb) {
  console.log('find exam in db');
  
  console.log(exam_code);
  response_collection.findOne({exam_code: exam_code}, cb);
},

FacultycheckResponse: function( exam_code, cb) {
  console.log('find exam in db');
  
  console.log(exam_code);
  response_collection.find({exam_code: exam_code}, cb);
}

};