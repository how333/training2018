var express = require('express')
  , router = express.Router()
  , multiparty = require('multiparty')
  , Student = require('../models/student')
  , Record = require('../models/learning_record')
  , Course = require('../models/course')
  ,util = require('util')
  ,fs = require('fs')
   ,ReadExcel = require('../tools/readexcel');


var default_username = "User Name";

var default_student = {
	  username: "username",
	  password: "Password",
	  rollno: "Job Number"
	};

var default_username = "User Name"; 

var default_courseid = "Course Code";


router.get('/home', isLoggedInAsStudent, function(req, res) {
	res.render('students/home', { title: 'Student Home Page', student: default_student});
});

router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
});
	
router.get('/new', isLoggedIn, function(req, res) {
	var back_link = '';
	if (req.user.usertype=='admin')
		back_link = '/admin/home';
		
	else if(req.user.usertype=='super_admin')
		back_link = '/super_admin/home';
		

	res.render('students/new', { title: 'Add New Student', student: default_student,back_link:back_link});
});

router.get('/batch_new', isLoggedIn, function(req, res) {
	var back_link = '';
	if (req.user.usertype=='admin')
		back_link = '/admin/home';
		
	else if(req.user.usertype=='super_admin')
		back_link = '/super_admin/home';

	res.render('students/batch_new', { title: 'Add New Student', student: default_student,back_link:back_link});
});

router.post('/batch_create', isLoggedIn, function(req, res) {

	//生成multiparty对象，并配置上传目标路径
	  var form = new multiparty.Form({uploadDir: '../public/files/'});
	  //上传完成后处理
	  console.log('got the content2');
	  form.parse(req, function(err, fields, files) {
	    var filesTmp = JSON.stringify(files,null,2);

	    if(err){
	      console.log('parse error: ' + err);
	    } else {
	      
	      var inputFile = files.inputFile[0];
	      var uploadedPath = inputFile.path;
	      var dstPath = '../public/files/' + inputFile.originalFilename;
	      console.log(dstPath);
	      //重命名为真实文件名
	      //fs.unlink(dstPath);//会自动覆盖，不用删除
	      fs.rename(uploadedPath, dstPath, function(err) {
	        if(err){
	        	console.log(err);
	          console.log('rename error: ' + err);
	        } else {
	          console.log('rename ok');
	 var readexcel = new ReadExcel();
	filecontent = readexcel.readexcel(dstPath);
	console.log('got the content');
	console.log(filecontent);

	filecontent.forEach(function(sheetcontent)
	{	
		if (sheetcontent.name == 'students')
		{
			sheetcontent.data.forEach(function(sheetdata)
			{
				console.log(sheetdata);
				var password = sheetdata[2].toString().substr(6, 8);
				console.log(password);
				var student = {
				rollno: sheetdata[0].toString(),
				username: sheetdata[1].toString(),
				IDnumber: sheetdata[2].toString(),
				password: password,
				sexuality:sheetdata[3].toString(),
				birth:sheetdata[4].toString(),
				workunit:sheetdata[5].toString(),
				carrier:sheetdata[6].toString(),
				contact:sheetdata[7].toString(),
				};
				console.log(typeof sheetdata[0]);
				

				Student.findByUserName(student.username, function(err,doc) {
				if(err)
					res.send("Some error occured");
				else if(doc)
					console.log('this name exit');
					else{

					Student.create(student, function(err, doc) {
						if(err)
							res.send("Some error occured");
						else
							console.log('create user success');
					})	}
				})
			})
		}
	})

	        }
	      });
	    }


	if (req.user.usertype=='admin')
		res.redirect('/admin/home');
	else if(req.user.usertype=='super_admin')
		res.redirect('/super_admin/home');
	 });


})

router.post('/create', isLoggedIn, function(req, res) {
	// TO DO: Ensure that the student and course exists
	// TO DO: Add failure cases
	var student = {
	rollno: req.body.rollno,
	username: req.body.username,
	IDnumber: 'IDnumber',
	password: req.body.password,
	sexuality:'sexuality',
	birth:'birth',
	workunit:'workunit',
	carrier:'carrier',
	contact:'contact'
	};
	var username = req.body.username;
	console.log(typeof username);
	Student.getByUserName(username, function(err,doc) {
	if(err)
		res.send("Some error occured");
	else if(doc)
		res.redirect('/students/new');
		else{

		Record.create_student(username, function(err, doc) {
			if(err)
				res.send("Some error occured");
			else {}
		});

		Student.create(student, function(err, doc) {
			if(err)
				res.send("Some error occured");
			else {
					if (req.user.usertype=='admin')
						res.redirect('/admin/home');
					else if(req.user.usertype=='super_admin')
						res.redirect('/super_admin/home');
			}
		});
	}
});
});

router.get('/password_change',isLoggedInAsStudent, function(req, res) {
	var username = req.user.username;
	res.render('students/password_change', { title: "Get Username", username: username});
});

router.post('/password_change',isLoggedInAsStudent, function(req,res) {

	console.log('password_change');
	console.log(req);
	console.log(req.body.username);
	console.log(req.body.passwordold);
	console.log(req.body.passwordnew);
	console.log(req.body.passwordnewagin);
	var student = {
	username: req.body.username,
	password_old: req.body.passwordold,
	password_new: req.body.passwordnew,
	password_new_agin: req.body.passwordnewagin
	};
	var username = req.body.username;
	var passwordold = req.body.passwordold;
	var passwordnew = req.body.passwordnew;
	if(student.password_new!=student.password_new_agin)
	{
		res.render('students/password_change', { title: "Get Username", username: default_username});
	}
	else
	{
			console.log('getByUserName');
			Student.getByUserName(username, function(err,doc) {
			if(err)
				res.send("Some error occured");
			else if(doc)
			{
				console.log('oldpassword');
				console.log(passwordold);
				console.log(doc.password);
				var oldpassword = doc.password;
				if(oldpassword != passwordold)
				{
					res.render('students/password_change', { title: "Get Username", username: default_username});
				}
				else
				{
						Student.change_password(username, passwordnew, function(err, doc) {
						console.log(doc);
						console.log("update doc");
							if(err)
								res.render('students/password_change', { title: "Get Username", username: default_username});
							else
								
								res.redirect('/students/home');
							
						});


				}

			}
		});

	}

});

router.get('/personal_info',isLoggedInAsStudent, function(req, res) {
	var username = req.user.username;
    Student.getByUserName(username, function(err,doc) {
		if(err)
			res.send("Some error occured");
		else
		{
			console.log(doc);
			console.log('doc');
			if(doc)
			res.render('students/personal_info', {title: 'Edit Student',student: doc});
		}
	});
});

router.get('/student_info',isLoggedInAsFaculty, function(req, res) {

	res.render('students/view_student_info', { title: "Get Username", username: default_username});
});

router.get('/get_student_info',isLoggedInAsFaculty, function(req, res) {
	console.log('req.query.username');
	console.log(req.query.username);
    Student.getByUserName(req.query.username, function(err,docs) {
		if(err)
			res.send("Some error occured");
		else
		{
			console.log(docs);
			console.log('docs');
			res.json(docs);
		}
	});
    });

router.get('/get_username_edit', isLoggedIn, function(req, res) {
	var back_link = '';
	if (req.user.usertype=='admin')
		back_link = '/admin/home';
		
	else if(req.user.usertype=='super_admin')
		back_link = '/super_admin/home';

	res.render('students/get_username_edit', { title: "Get Username", username: default_username,back_link:back_link});
});


router.get('/edit', isLoggedIn, function(req,res) {
	//Failure renders edit if update is incorrect
	    var back_link = '';
    if (req.user.usertype=='admin')
        back_link = '/admin/home';
        
    else if(req.user.usertype=='super_admin')
        back_link = '/super_admin/home';

	var username = req.query.username;
    Student.getByUserName(username, function(err,doc) {
		if(err)
			res.send("Some error occured");
		else
		{
			console.log(doc);
			console.log('doc');
			if(doc)
			res.render('students/edit', {title: 'Edit Student', back_link:back_link,student: doc});
			else
			res.redirect('/students/get_username_edit');
		}
	});
});

router.post('/update', isLoggedInAsStudent, function(req, res) {
	// TO DO: Ensure that the student and course exists
	// TO DO: Add failure cases
	var student = {
	  username: req.body.username,
	  IDnumber: req.body.IDnumber,
	  password: req.body.password,
	sexuality:req.body.sexuality,
	birth:req.body.birth,
	workunit:req.body.workunit,
	carrier:req.body.carrier,
	contact:req.body.contact
	};
	var prevusername = req.body.prevusername;

	Student.update(prevusername, student, function(err, doc) {
			if(err)
				res.render('students/edit', { title: 'Edit Student', student: student});
			else
			{
				if (req.user.usertype=='admin')
					res.redirect('/admin/home');
				else if(req.user.usertype=='super_admin')
					res.redirect('/super_admin/home');
				else if(req.user.usertype=='student')
					res.render('students/personal_info_change_successful');

			}
		});
});

router.get('/get_username_delete', isLoggedIn, function(req, res) {
	var back_link = '';
	if (req.user.usertype=='admin')
		back_link = '/admin/home';
		
	else if(req.user.usertype=='super_admin')
		back_link = '/super_admin/home';

	var default_username = "User Name";
	res.render('students/get_username_delete', { title: "Get Username", username: default_username,back_link:back_link});
});

router.post('/delete', isLoggedIn, function(req, res) {
	// TO DO: Ensure that the student and course exists
	// TO DO: Add failure cases
	var username = req.body.username;

	Student.getByUserName(username, function(err,doc) {
	if(err)
		res.send("Some error occured");
	else if(doc)
	{
	Student.remove(username, function(err, doc) {
		if(err)
			res.send("Some error occured");
		else
			{
				if (req.user.usertype=='admin')
					res.redirect('/admin/home');
				else if(req.user.usertype=='super_admin')
					res.redirect('/super_admin/home');
			}
	})}
	else
		res.redirect('../students/get_username_delete');	
	})
});

router.get('/register_form', isLoggedIn, function(req, res) {
	var back_link = '';
	if (req.user.usertype=='admin')
		back_link = '/admin/home';
		
	else if(req.user.usertype=='super_admin')
		back_link = '/super_admin/home';
	res.render('students/register', { title: "Register", username: default_username,
	courseid: default_courseid,back_link:back_link});
});

router.post('/register', isLoggedIn, function(req, res) {
	var username = req.body.username;
	var course_code = req.body.courseid;

	Student.getByUserName(username, function(err,doc) 
	{
		if(err)
			res.send("Some error occured");
		else if(doc)
		{
			Course.getBycourseid(course_code, function(err,doc)
			{
				if(err)
					res.send("Some error occured");
				else if(doc)
				{
					console.log(doc);
					var doc_of_charpter = new Array();
					var video_of_charpter = new Array();
					var scenario_of_charpter = new Array();
					var charpters = null;
					charpters = doc.charpter;
					for(index in charpters) {
						doc_of_charpter = charpters[index].doc;
						video_of_charpter = charpters[index].video;
						scenario_of_charpter = charpters[index].scenario;
					}
					for(var i=0; i<doc_of_charpter.length; i++) {
						Record.create_course_doc(username, course_code, doc_of_charpter[i]);
					}
					for(var i=0; i<video_of_charpter.length; i++) {
						Record.create_course_video(username, course_code, video_of_charpter[i]);
					}
					for(var i=0; i<scenario_of_charpter.length; i++) {
						Record.create_course_scenario(username, course_code,scenario_of_charpter[i]);
					}
					Student.getBycourseid(username, course_code, function(err, doc) 
					{
						if(err)
							res.send("Some error occured");
						else if(doc)
							{res.redirect('/students/register_form');}
						else
						{

							Student.register(username, course_code, function(err, doc)
							{
								if(err)
									res.send("Some error occured");
								else if(doc)
									{
										if (req.user.usertype=='admin')
											res.redirect('/admin/home');
										else if(req.user.usertype=='super_admin')
											res.redirect('/super_admin/home');
									}
							})
						}
					})
				}
				else
					res.redirect('/students/register_form');
					
			})
		}
		else
			res.redirect('/students/register_form');
		
	})
});

router.get('/deregister_form', isLoggedIn, function(req, res) {
	var back_link = '';
	if (req.user.usertype=='admin')
		back_link = '/admin/home';
		
	else if(req.user.usertype=='super_admin')
		back_link = '/super_admin/home';
	res.render('students/deregister', { title: "Deregister", username: default_username,
	courseid: default_courseid,back_link:back_link});
});

router.post('/deregister', isLoggedIn, function(req, res) {
	// TO DO: Ensure that the student and course exists
	// TO DO: Add failure cases
	var username = req.body.username;
	var course_code = req.body.courseid;

	Student.getByUserName(username, function(err,doc) 
	{
		if(err)
			res.send("Some error occured");
		else if(doc)
		{
			Course.getBycourseid(course_code, function(err,doc)
			{
				if(err)
					res.send("Some error occured");
				else if(doc)
				{
					// console.log(doc);
					// var doc_of_charpter = new Array();
					// var video_of_charpter = new Array();
					// var scenario_of_charpter = new Array();
					// var charpters = null;
					// charpters = doc.charpter;
					// for(index in charpters) {
					// 	doc_of_charpter = charpters[index].doc;
					// 	video_of_charpter = charpters[index].video;
					// 	scenario_of_charpter = charpters[index].scenario;
					// }
					// for(var i=0; i<doc_of_charpter.length; i++) {
						Record.delete_course_doc(username, course_code);
					// }
					// for(var i=0; i<video_of_charpter.length; i++) {
						Record.delete_course_video(username, course_code);
					// }
					// for(var i=0; i<scenario_of_charpter.length; i++) {
						Record.delete_course_scenario(username, course_code);
					// }
					Student.getBycourseid(username, course_code, function(err, doc) 
					{
						if(err)
							res.send("Some error occured");
						else if(doc)
						{
							Student.deregister(username, course_code, function(err, doc)
							{
								if(err)
									res.send("Some error occured");
								else if(doc)
								{
									if (req.user.usertype=='admin')
										res.redirect('/admin/home');
									else if(req.user.usertype=='super_admin')
										res.redirect('/super_admin/home');		
								}

							});
						}
						else
						{
							res.redirect('/students/register_form');
						}

					});
				}
				else
					res.redirect('/students/register_form');		
			});
		}
		else
			res.redirect('/students/register_form');
	});
});

router.get('/getstudents', isLoggedInAsFaculty, function(req, res) {

	console.log('getstudents');
	Student.getall( function(err,docs){
	//Student.find()(function(err,docs){
	        if(err)
	        res.send("some error occured");
	        else
	        {
	        	console.log(docs);
	        	res.json(docs);
	    	}
	            }); 

});

module.exports = router;


function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()&&((req.user.usertype=='admin')||(req.user.usertype=='super_admin')))
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

function isLoggedInAsStudent(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()&&((req.user.usertype=='admin')||(req.user.usertype=='super_admin')||(req.user.usertype=='student')))
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

function isLoggedInAsFaculty(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()&&req.user.usertype=='faculty')
        {return next();}

    // if they aren't redirect them to the home page
    res.redirect('/');
}