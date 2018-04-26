var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/examdb');
var faculty_collection = db.get('faculties');
var question_bank = db.get('question_bank');

module.exports = {
// MAKE VALIDATION FUNCTIONS HERE
// Create new student in the database
create: function(faculty, cb) {
  faculty_collection.insert(faculty, cb);
},

// Retrieve faculty using username
getByUserName: function(username, cb) {
  faculty_collection.findOne({username: username}, {}, cb);
},

findByUserName: function(username, cb) {
  faculty_collection.findOne({username: username}, {}, cb);
},

findByUserNameAndPassword: function(username,password, cb) {
  faculty_collection.findOne({username: username,password:password}, {}, cb);
},

findByUserCardID: function(username, cb) {
  faculty_collection.findOne({IDnumber: username}, {}, cb);
},

findByMobileNumber: function(username, cb) {
  faculty_collection.findOne({contact: username}, {}, cb);
},

// Update an existing faculty by username
update: function(prevusername, faculty, cb) {
  console.log('update');
    console.log(prevusername);
	console.log(faculty);

  faculty_collection.update({username: prevusername},
  { $set: {username: faculty.username, 
    IDnumber: faculty.IDnumber, 
    password: faculty.password, 
    sexuality: faculty.sexuality,
    birth: faculty.birth,
    workunit: faculty.workunit,
    carrier: faculty.carrier,
    contact: faculty.contact} },
  cb);
},

change_password: function(username, password, cb) {

  faculty_collection.update({username: username},
  { $set: {username: username, password: password} },
  cb);
},

// Remove an existing faculty by username
remove: function(username, cb) {
  faculty_collection.remove({username: username}, cb);
},

// Assign faculty to a course by username and course ID
assign: function(username, course_code, cb) {
faculty_collection.update(
   { username: username },
   { $addToSet: { course_list: { $each: [ course_code] } } }, cb);
},

unassign: function(username, course_code, cb) 
{
faculty_collection.update(
	{username: username},
	{ $pull: {  course_list: course_code } },cb);
},

getBycourseid: function(username,course_code, cb) {
	console.log('find course');
	console.log(username);
	console.log(course_code);
	console.log(faculty_collection);
  faculty_collection.findOne({username: username, course_list :course_code}, {}, cb);
},

getByBankName: function(bankname, cb) {
  question_bank.findOne({bankname: bankname}, {}, cb);
},

createNewQuestionBank: function(bankname, banknumber, banktype, singlechoice, multichoice, shortanswer) {
  question_bank.insert({'bankname':bankname, 'banknumber':banknumber, 'banktype':banktype, 'singlechoice':singlechoice, 'multichoice':multichoice, 'shortanswer':shortanswer});
},

getQuestionBanks: function(cb) {
  question_bank.find({}, {}, cb);
},

addSingleChoice: function(bankname, subject, choice_A, choice_B, choice_C, choice_D, answer, cb) {
  question_bank.update({'bankname':bankname}, {$addToSet:{
    'singlechoice':{'subject':subject, 
        'choice_A':choice_A, 
        'choice_B':choice_B, 
        'choice_C':choice_C, 
        'choice_D':choice_D, 
        'answer':answer}
  }}, cb);
},

addMultiChoice: function(bankname, subject, choice_A, choice_B, choice_C, choice_D, choice_E, answer, cb) {
  question_bank.update({'bankname':bankname}, {$addToSet:{
    'multichoice':{'subject':subject, 
        'choice_A':choice_A, 
        'choice_B':choice_B, 
        'choice_C':choice_C, 
        'choice_D':choice_D, 
        'choice_E':choice_E, 
        'answer':answer}
  }}, cb);

},

addShortAnswer: function(bankname, subject, answer, cb) {
  question_bank.update({'bankname':bankname},{$addToSet:{
    'shortanswer':{'subject':subject, 
        'answer':answer}
  }}, cb);

}

};







