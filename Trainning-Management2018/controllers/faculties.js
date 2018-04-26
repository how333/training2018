var express = require('express')
  , router = express.Router()
    , multiparty = require('multiparty')
  , Faculty = require('../models/faculty')
  , Course = require('../models/course')
  ,util = require('util')
  ,fs = require('fs')
   ,ReadExcel = require('../tools/readexcel');


var default_faculty = {
	  username: "username",
	  password: "Password",
	  rollno: "Job Number"
	};
	
var default_username = "User Name";

var default_courseid = "Course Code";



router.get('/home', isLoggedInAsFaculty, function(req, res) {
	res.render('faculties/home', { title: 'Faculty Home Page', faculty: default_faculty});
});

router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
});

router.get('/new',isLoggedIn, function(req, res) {
	res.render('faculties/new', { title: 'Add New faculty', faculty: default_faculty});
});

router.get('/batch_new', isLoggedIn, function(req, res) {
	var back_link = '';
	if (req.user.usertype=='admin')
	    back_link = '/admin/home';
	    
	else if(req.user.usertype=='super_admin')
	    back_link = '/super_admin/home';
	res.render('faculties/batch_new', { title: 'Add New faculties', faculty: default_faculty,back_link:back_link});
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
		if (sheetcontent.name == 'faculty')
		{
			sheetcontent.data.forEach(function(sheetdata)
			{
				console.log(sheetdata);
				var password = sheetdata[2].toString().substr(6, 8);
				console.log(password);
				var faculty = {
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
				

				Faculty.findByUserName(faculty.username, function(err,doc) {
				if(err)
					res.send("Some error occured");
				else if(doc)
					console.log('this name exit');
					else{

					Faculty.create(faculty, function(err, doc) {
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


});


router.post('/create',isLoggedIn, function(req, res) {
	var faculty = {
	rollno:req.body.rollno,
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

	Faculty.getByUserName(username, function(err,doc) {
	if(err)
		res.send("Some error occured");
	else if(doc)
		res.redirect('/faculties/new');
		else{
		Faculty.create(faculty, function(err, doc) {
			
			console.log(doc);
			console.log('facility add');
			if(err)
				res.send("Some error occured");
			else
				{
					if (req.user.usertype=='admin')
						res.redirect('/admin/home');
					else if(req.user.usertype=='super_admin')
						res.redirect('/super_admin/home');
				}
		})	}
	})
});

router.get('/password_change',isLoggedInAsFaculty, function(req, res) {
	var username = req.user.username;
	res.render('faculties/password_change', { title: "Get Username", username: username});
});

router.post('/password_change',isLoggedInAsFaculty, function(req,res) {

	console.log('password_change');
	console.log(req);
	console.log(req.body.username);
	console.log(req.body.passwordold);
	console.log(req.body.passwordnew);
	console.log(req.body.passwordnewagin);
	var faculty = {
	username: req.body.username,
	password_old: req.body.passwordold,
	password_new: req.body.passwordnew,
	password_new_agin: req.body.passwordnewagin
	};
	var username = req.body.username;
	var passwordold = req.body.passwordold;
	var passwordnew = req.body.passwordnew;
	if(faculty.password_new!=faculty.password_new_agin)
	{
		res.render('faculties/password_change', { title: "Get Username", username: default_username});
	}
	else
	{
			console.log('getByUserName');
			Faculty.getByUserName(username, function(err,doc) {
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
					res.render('faculties/password_change', { title: "Get Username", username: default_username});
				}
				else
				{
						Faculty.change_password(username, passwordnew, function(err, doc) {
						console.log(doc);
						console.log("update doc");
							if(err)
								res.render('faculties/password_change', { title: "Get Username", username: default_username});
							else
								
								res.redirect('/faculties/home');
							
						});


				}

			}
		});

	}

});

router.get('/personal_info',isLoggedInAsFaculty, function(req, res) {
	//Failure renders edit if update is incorrect

	var username = req.user.username;
	console.log('personal_info');
	console.log(username);
    Faculty.getByUserName(username, function(err,doc) {
		if(err)
			res.send("Some error occured");
		else
		{
			res.render('faculties/personal_info', {title: 'Edit faculty', faculty: doc});

		}
	});
});

router.get('/question_bank',isLoggedInAsFaculty, function(req, res) {
	//Failure renders edit if update is incorrect

	var username = req.user.username;
	console.log(username);
	res.render('faculties/question_bank', {title: 'Question bank'});
});

router.post('/question_bank',isLoggedInAsFaculty, function(req, res) {
	//Failure renders edit if update is incorrect

	var bankname = req.body.bank_name;
	var banknumber = req.body.bank_number;
	var banktype = req.body.bank_type;
	var bankselect = req.body.bank_select;

	if(bankname != null && bankselect == null) 
	{
		Faculty.getByBankName(bankname, function(err, doc) {
			if(err)
			{
				res.send("Some error occured");
			}
			else if(doc)
			{
				res.send("该题库已存在！");
			}
			else
			{
				Faculty.createNewQuestionBank(bankname, banknumber, banktype, [], [], []);
				res.render('faculties/questions', {bankname:bankname});
			}
		});
	}
	else if(bankname == null && bankselect != null)
	{
		Faculty.getByBankName(bankselect, function(err, doc) {
			if(err)
			{
				res.send("Some error occured");
			}
			else
			{
				res.render('faculties/questions', {bankname:bankselect});
			}
		});
	}
});

router.get('/get_question_banks', isLoggedInAsFaculty, function(req, res) {
	Faculty.getQuestionBanks(function(err, docs) {
		if(err)
			res.send("some error occured");
		else
			res.json(docs);
	});
});

router.post('/add_single_choice', isLoggedInAsFaculty, function(req, res) {

	var bankname = req.body.bankname1;
	var subject = req.body.SC_subject;
	var choice_A = req.body.SC_A;
	var choice_B = req.body.SC_B;
	var choice_C = req.body.SC_C;
	var choice_D = req.body.SC_D;
	var answer = req.body.SC_answer;

	Faculty.addSingleChoice(bankname, subject, choice_A, choice_B, choice_C, choice_D, answer, function(err, doc) {
		if(err)
		{
			res.send('Some error occured');
		}
		else
		{
			res.render('faculties/questions', {bankname:bankname});
		}
	});
});

router.post('/add_multi_choice', isLoggedInAsFaculty, function(req, res) {

	var bankname = req.body.bankname2;
	var subject = req.body.MC_subject;
	var choice_A = req.body.MC_A;
	var choice_B = req.body.MC_B;
	var choice_C = req.body.MC_C;
	var choice_D = req.body.MC_D;
	var choice_E = req.body.MC_E;
	var answer = req.body.MC_answer;

	Faculty.addMultiChoice(bankname, subject, choice_A, choice_B, choice_C, choice_D, choice_E, answer, function(err, doc) {
		if(err)
			res.send('Some error occured');
		else
		{
			res.render('faculties/questions', {bankname:bankname});
		}
	});
});

router.post('/add_short_answer', isLoggedInAsFaculty, function(req,res) {

	var bankname = req.body.bankname3;
	var subject = req.body.SA_subject;
	var answer = req.body.SA_answer;

	Faculty.addShortAnswer(bankname, subject, answer, function(err, doc) {
		if(err)
			res.send('Some error occured');
		else
		{
			res.render('faculties/questions', {bankname:bankname});
		}
	});
});

router.get('/get_username_edit',isLoggedIn, function(req, res) {
	    var back_link = '';
    if (req.user.usertype=='admin')
        back_link = '/admin/home';
        
    else if(req.user.usertype=='super_admin')
        back_link = '/super_admin/home';

	res.render('faculties/get_username_edit', { title: "Get Username", back_link:back_link,username: default_username});
});



router.get('/edit',isLoggedIn, function(req,res) {
	//Failure renders edit if update is incorrect
	    var back_link = '';
    if (req.user.usertype=='admin')
        back_link = '/admin/home';
        
    else if(req.user.usertype=='super_admin')
        back_link = '/super_admin/home';

	var username = req.query.username;
    Faculty.getByUserName(username, function(err,doc) {
		if(err)
			res.send("Some error occured");
		else
		{
			console.log(doc);
			console.log("doc");
			if(doc)
			res.render('faculties/edit', {title: 'Edit faculty', back_link:back_link,faculty: doc});
			else
			res.redirect('/faculties/get_username_edit');
		}
	});
});

router.post('/update',isLoggedInAsFaculty, function(req,res) {
	var faculty = {
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
	console.log(prevusername);
	console.log(faculty);
	Faculty.update(prevusername, faculty, function(err, doc) {
		
		console.log(doc);
		console.log("update doc");
			if(err)
				res.render('faculties/edit', { title: 'Edit faculties', faculty: faculty});
			else
				
				if (req.user.usertype=='admin')
					res.redirect('/admin/home');
				else if(req.user.usertype=='super_admin')
					res.redirect('/super_admin/home');
				else if(req.user.usertype=='faculty')
					//res.redirect('/faculties/personal_info_change_successful');
					res.render('faculties/personal_info_change_successful');

		});
});

router.get('/get_username_delete',isLoggedIn, function(req, res) {
	var back_link = '';
	if (req.user.usertype=='admin')
		back_link = '/admin/home';
		
	else if(req.user.usertype=='super_admin')
		back_link = '/super_admin/home';

	res.render('faculties/get_username_delete', { title: "Get Username", back_link:back_link,username: default_username});
});

router.post('/delete',isLoggedIn, function(req, res) {
	var username = req.body.username;

	Faculty.getByUserName(username, function(err,doc) {
	if(err)
		res.send("Some error occured");
	else if(doc)
	{
	Faculty.remove(username, function(err, doc) {
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
		res.redirect('../faculties/get_username_delete');	
	})
});

router.get('/assign_form',isLoggedIn, function(req, res) {
	var back_link = '';
	if (req.user.usertype=='admin')
		back_link = '/admin/home';
		
	else if(req.user.usertype=='super_admin')
		back_link = '/super_admin/home';
	res.render('faculties/assign', { title: "Assign", username: default_username,
	courseid: default_courseid,back_link:back_link});
});

router.post('/assign',isLoggedIn, function(req, res) {
	var username = req.body.username;
	var course_code = req.body.courseid;
	console.log('course_code');
	console.log(course_code);

	Faculty.getByUserName(username, function(err,doc) 
	{
		if(err)
			res.send("Some error occured");
		else if(doc)
		{
			//Course.getBycourseid(courseid, function(err,doc) {
			Course.getBycourseid(course_code, function(err,doc)
			{
				if(err)
					res.send("Some error occured");
				else if(doc)
				{
					Faculty.getBycourseid(username, course_code, function(err, doc) 
					{
						if(err)
							res.send("Some error occured");
						else if(doc)
							{res.redirect('/faculties/assign_form');}
						else
						{
							Faculty.assign(username, course_code, function(err, doc)
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
					res.redirect('/faculties/assign_form');
					
			})
		}
		else
			res.redirect('/faculties/assign_form');
		
	})
});


router.get('/unassign_form',isLoggedIn, function(req, res) {
	var back_link = '';
	if (req.user.usertype=='admin')
		back_link = '/admin/home';
		
	else if(req.user.usertype=='super_admin')
		back_link = '/super_admin/home';
	res.render('faculties/unassign', { title: "unassign", username: default_username,
	courseid: default_courseid,back_link:back_link});
});

router.post('/unassign',isLoggedIn, function(req, res) {
	var username = req.body.username;
	var course_code = req.body.courseid;

	Faculty.getByUserName(username, function(err,doc) 
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
					Faculty.getBycourseid(username, course_code, function(err, doc) 
					{
						if(err)
							res.send("Some error occured");
						else if(doc)
						{
							Faculty.unassign(username, course_code, function(err, doc)
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
						else
						{
							res.redirect('/faculties/unassign_form');
						}

					})
				}
				else
					res.redirect('/faculties/unassign_form');		
			})
		}
		else
			res.redirect('/faculties/unassign_form');
	})
});

module.exports = router;


function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()&&((req.user.usertype=='admin')||(req.user.usertype=='super_admin')))
        return next();


    // if they aren't redirect them to the home page
    res.redirect('/');
}

function isLoggedInAsFaculty(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()&&((req.user.usertype=='admin')||(req.user.usertype=='super_admin')||(req.user.usertype=='faculty')))
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}