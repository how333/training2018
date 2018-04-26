var express = require('express')
  , router = express.Router()
  , Exam = require('../models/exam')
  , Student = require('../models/student')

router.get('/take_exam', isLoggedInAsStudent, function(req, res) {

    res.render('exams/take_exam_code_entry', {title: "Enter Exam Code", username: req.user.username});

});

router.get('/take_operation_exam', isLoggedInAsStudent, function(req, res) {

    res.render('exams/take_operation_exam_code_entry', {title: "Enter Exam Code", username: req.user.username});

});


router.post('/exam_operation', isLoggedInAsStudent,
function(req, res) {
    var exam_code = req.body.exam_code;
    var username = req.body.username;
    var d = new Date();
    var time_now = d.getTime() + 1000*60*60*8;
    console.log("begin to take exam");
    console.log(exam_code);
    console.log(username);

    
    Student.getByUserName(username,
    function(err, student_info) {
        if (err) res.send("Some error occured");
        else if (student_info) {
            var IDnumber = student_info.IDnumber;
        

    Exam.getByExamCode(exam_code,
    function(err, doc1) {
        if (err) res.send("Some error occured");
        else if (doc1) {
            console.log("find the exam id");
            if(doc1.question_list_operation == undefined)
            {
                res.render('exams/exam_not_ready', {
                    title: 'Take Exam',
                    exam_code: exam_code,
                });
            }
            else
            {
            Student.getBycourseid(username, doc1.course_code,
            function(err, doc)
            {
                if (err) res.send("Some error occured");
                else if (doc) {
                    console.log('get the course no');
                    console.log(doc);
                    Exam.checkResponse(username, exam_code,
                    function(err, doc) {
                        console.log('find in the examcode');

                        if (err) res.send("Some error occured");
                        else if (doc) {

                            if (doc.operation_exam_start_time == undefined)
                            {
                                Exam.addResponses_time_operation(username, exam_code, time_now, function(err,docs){
                                    if(err)
                                        res.send("some error occured");
                                    else
                                    {
                                        console.log('first time to take this exam');
                                        console.log(operation_exam_start_time);
                                        res.render('exams/take_exam_operation', {
                                            title: 'Take Exam',
                                            exam_code: exam_code,
                                            username: username,
                                            operation_exam_start_time:time_now,
                                            IDnumber:IDnumber
                                        });
                                    }
                                });
                            }

                            else{

                            console.log('get in the exam agin');
                            if (doc.exam_taken_operation == true) {


                                //res.redirect('/take_exam_alredy');
                                res.render('exams/take_exam_already', {
                                    exam_code: exam_code,
                                    username: username
                                });

                            } else {
                                var operation_exam_start_time = doc.operation_exam_start_time;
                                    res.render('exams/take_exam_operation', {
                                        title: 'Take Exam',
                                        exam_code: exam_code,
                                        username: username,
                                        operation_exam_start_time:operation_exam_start_time,
                                        IDnumber:IDnumber
                                    });

                            }}
                            //res.redirect('/take_exam');

                        }

                        else {

                            Exam.addResponses_new_operation(username, exam_code, time_now, function(err,docs){
                                if(err)
                                res.send("some error occured");
                                else
                                {
                                    console.log('first time to take this exam');
                                    
                                    res.render('exams/take_exam_operation', {
                                        title: 'Take Exam',
                                        exam_code: exam_code,
                                        username: username,
                                        operation_exam_start_time:time_now,
                                        IDnumber:IDnumber
                                    });
                                }
                                
                           });
                            
                            

                        }
                    });
                } else res.redirect('/take_exam/take_exam');

            });
        }
        } else res.redirect('/take_exam/take_exam');

    });
    }});
//add here
});


router.post('/exam', isLoggedInAsStudent,
function(req, res) {
    var exam_code = req.body.exam_code;
    var username = req.body.username;
    var d = new Date();
    var time_now = d.getTime() + 1000*60*60*8;
    console.log("begin to take exam");
    console.log(exam_code);
    console.log(username);

    Student.getByUserName(username,
    function(err, student_info) {
        if (err) res.send("Some error occured");
        else if (student_info) {
            var IDnumber = student_info.IDnumber;

    Exam.getByExamCode(exam_code,
    function(err, doc1) {
        if (err) res.send("Some error occured");
        else if (doc1) {
            console.log("find the exam id");
            
            exam_duration_hours = parseInt(doc1.duration_hours);
            exam_duration_minutes = parseInt(doc1.duration_minutes);
            exam_duration_millisecond_total = 3600000*exam_duration_hours
                                                                + 60000*exam_duration_minutes;
            exam_single = parseInt(doc1.exam_single);
            exam_adventitious = parseInt(doc1.exam_adventitious);

            if( doc1.question_list == undefined)
                exam_single_length = 0;
            else
                exam_single_length = doc1.question_list.length;

            if(doc1.question_list_adventitious == undefined)
                exam_adventitious_length = 0;
            else
                exam_adventitious_length = doc1.question_list_adventitious.length;

            if(doc1.question_list_subjective == undefined)
                exam_subjective_length = 0;
            else
                exam_subjective_length = doc1.question_list_subjective.length;

            
            console.log('length strict');
            console.log(exam_single_length);
            console.log(exam_single);
            console.log(exam_adventitious_length);
            console.log(exam_adventitious);
            if((exam_single_length==0)&&(exam_adventitious_length==0)&&(exam_subjective_length==0))
            {
                res.render('exams/exam_not_ready', {
                    title: 'Take Exam',
                    exam_code: exam_code,
                });
            }
            else
            {

            if((exam_single_length<exam_single) || (exam_adventitious_length<exam_adventitious) )
            {
                res.render('exams/exam_not_ready', {
                    title: 'Take Exam',
                    exam_code: exam_code,
                });
            }
            else
            {

            Student.getBycourseid(username, doc1.course_code,
            function(err, doc)
            {
                if (err) res.send("Some error occured");
                else if (doc) {
                    console.log('get the course no');
                    console.log(doc);
                    Exam.checkResponse(username, exam_code,
                    function(err, doc) {
                        console.log('find in the examcode');

                        if (err) res.send("Some error occured");
                        else if (doc) {

                            if (doc.exam_start_time == undefined)
                            {
                                Exam.addResponses_time(username, exam_code, time_now, function(err,docs){
                                    if(err)
                                        res.send("some error occured");
                                    else
                                    {
                                        console.log('first time to take this exam');
                                        console.log(exam_start_time);
                                        res.render('exams/take_exam', {
                                            title: 'Take Exam',
                                            exam_code: exam_code,
                                            username: username,
                                            exam_start_time:time_now,
                                            IDnumber:IDnumber
                                        });
                                    }
                                });
                            }

                            else{

                            console.log('get in the exam agin');
                            if (doc.response == undefined) {
                                var exam_start_time = doc.exam_start_time;
                                console.log('response find  not ok');
                                console.log(exam_start_time);
                                console.log(time_now - exam_start_time);
                                console.log(exam_duration_millisecond_total);

                                
                                if( (time_now - exam_start_time) > exam_duration_millisecond_total )
                                {
                                    res.render('exams/take_exam_already', {
                                        exam_code: exam_code,
                                        username: username
                                    });
                                }
                                else
                                {
                                    res.render('exams/take_exam', {
                                        title: 'Take Exam',
                                        exam_code: exam_code,
                                        username: username,
                                        exam_start_time:exam_start_time,
                                        IDnumber:IDnumber
                                    });
                                }



                            } else {

                                console.log('response find ok');
                                res.render('exams/take_exam_already', {
                                    exam_code: exam_code,
                                    username: username
                                });
                            }}
                            //res.redirect('/take_exam');

                        }

                        else {

                            Exam.addResponses_new(username, exam_code, time_now, function(err,docs){
                                if(err)
                                res.send("some error occured");
                                else
                                {
                                    console.log('first time to take this exam');
                                    console.log(exam_start_time);
                                    res.render('exams/take_exam', {
                                        title: 'Take Exam',
                                        exam_code: exam_code,
                                        username: username,
                                        exam_start_time:time_now,
                                        IDnumber:IDnumber
                                    });
                                }
                                
                           });

                        }
                    });
                } else res.redirect('/take_exam/take_exam');

            });
            }}
        } else res.redirect('/take_exam/take_exam');

    });
}});

});






router.get('/list', isLoggedInAsStudent, function(req, res) {

    Exam.getByExamCode(req.query.exam_code, function(err,docs){
        if(err)
        res.send("some error occured");
        else
        {
            console.log('find the list contents');
            console.log(docs);
            res.json(docs);
        }
        
    });
});


router.get('/response_num', isLoggedInAsStudent, function(req, res) {

    var username=req.query.username;
    var exam_code=req.query.exam_code;
    var question_num_total = req.query.question_num_total;
    var exam_start_time = req.query.exam_start_time;
    console.log('list_num');
    console.log(username);
    console.log(exam_code);
    console.log(question_num_total);

    Exam.addResponses_num(username, exam_code, question_num_total,exam_start_time, function(err,docs){
        if(err)
        res.send("some error occured");
        else
        console.log('addResponses_num ok');
   });


});


router.get('/response_save', isLoggedInAsStudent, function(req, res) {

    var username=req.query.username;
    var exam_code=req.query.exam_code;
    var response_save = req.query.response_save;
    console.log('list_num');
    console.log(username);
    console.log(exam_code);
    console.log(response_save);

    Exam.saveResponses(username, exam_code, response_save, function(err,docs){
        if(err)
        res.send("some error occured");
        else
        console.log('addResponses  ok');
   });


});

router.get('/get_response', isLoggedInAsStudent,
function(req, res) {

    console.log('make list');
    Exam.checkResponse(req.query.username,req.query.exam_code,
    function(err, docs) {
        if (err) res.send("some error occured");
        else {
            console.log('find the list contents');
            console.log(docs);
            res.json(docs);
        }


    });
});


router.post('/submit', isLoggedInAsStudent, function(req, res) {
    
    var username=req.body.username;
    var exam_code=req.body.exam_code;
    var exam_start_time = req.body.exam_start_time;
    var IDnumber = req.body.IDnumber;

    var object=req.body;
    console.log('start to submit');
    console.log(JSON.stringify(object));
    var response = [];
    
    for(var key in object) {
            response.push(object[key]);
	}
	response.pop();
	response.pop();
           response.pop();
           response.pop();

    Exam.addResponses(username, exam_code, IDnumber, response, function(err,docs){
        if(err)
        res.send("some error occured");
        else
        res.render('exams/exam_submit', { title: 'Response Submitted Successfully', response: response, username: username, exam_code: exam_code});
    });

});


router.post('/submit_operation', isLoggedInAsStudent, function(req, res) {
    
    var username=req.body.username;
    var exam_code=req.body.exam_code;
    var exam_start_time = req.body.exam_start_time;
    var IDnumber = req.body.IDnumber;
  


    Exam.addResponses_operation(username, exam_code, IDnumber,function(err,docs){
        if(err)
        res.send("some error occured");
        else
        res.render('exams/exam_submit_operation', { title: 'Response Submitted Successfully', username: username, exam_code: exam_code});
    });

});

router.get('/performance', isLoggedInAsStudent, function(req, res) {

    res.render('exams/view_performance_code_entry', {title: "Enter Exam Code", username: req.user.username});

});

router.get('/performance_operation', isLoggedInAsStudent, function(req, res) {

    res.render('exams/view_performance_operation_code_entry', {title: "Enter Exam Code", username: req.user.username});

});



router.post('/performance_operation_view', isLoggedInAsStudent, function(req, res) {

    var username=req.body.username;
    var exam_code=req.body.exam_code;

    Student.findByUserName(username, function(err, student_info) 
    {
        if(err)
            res.send("Some error occured");
        else if(student_info)
            {
                var IDnumber = student_info.IDnumber;
            


    Exam.checkResponse(username, exam_code, function(err, doc) 
                    {
                        if(err)
                            res.send("Some error occured");
                        else if(doc)
                            {
    if(doc.exam_taken_operation == undefined)
    {
        res.render('exams/view_performance_code_entry', {title: "Enter Exam Code", username: req.user.username});      
    }
    else
    {
    Exam.getByExamCode(exam_code, function(err,docs){
        if(err)
        res.send("some error occured");
        else
        {

           var exam_name = docs.exam_name;
           var faculty_username = docs.faculty_username;

            Exam.getResponseByExamCode(exam_code, username, function(err, docs){
                if(err)
                    res.send("some error occured");
                else
                {

                    var response_obj = docs.response;
                    var exam_start_time = JSON.stringify(new Date(docs.operation_exam_start_time));
                    exam_start_time= exam_start_time.slice(1,-6);
                    var total_questions = 0;
                    var attempted = 0;
                    var correct_single = 0;
                    var correct_adventitious = 0;
                    var score = 0;
                    var score_operation = 0;
                    var result_detail = '';
                    
                    if(docs.score_operation == undefined)
                    {
                        score_operation = '';
                    }
                    else
                    {
                        for(var temp in docs.score_operation) 
                        {
                            score_operation += parseInt(docs.score_operation[temp]);
                        }
                    }
                    total_score = score_operation;
                    res.render('exams/performance_operation',{title: 'Result', username: username, IDnumber: IDnumber, 
                        exam_name: exam_name,total_score:total_score,exam_code:exam_code,
                        exam_start_time:exam_start_time,faculty_username:faculty_username});
                }
            });
        }
    });}
}
    else
    {
        console.log('exams/view_performance_operation_code_entry');
        res.render('exams/view_performance_operation_code_entry', {title: "Enter Exam Code", username: req.user.username});
    }                       
    });

}});
});

router.post('/performance_view', isLoggedInAsStudent, function(req, res) {

    var username=req.body.username;
    var exam_code=req.body.exam_code;
    Student.findByUserName(username, function(err, student_info) 
    {
        if(err)
            res.send("Some error occured");
        else if(student_info)
            {
                var IDnumber = student_info.IDnumber;


    Exam.checkResponse(username, exam_code, function(err, doc) 
                    {
                        if(err)
                            res.send("Some error occured");
                        else if(doc)
                            {
    if(doc.exam_taken == undefined)
    {
        res.render('exams/view_performance_code_entry', {title: "Enter Exam Code", username: req.user.username});      
    }
    else
    {

    var exam_start_time = JSON.stringify(new Date(doc.exam_start_time));
    exam_start_time= exam_start_time.slice(1,-6);

    Exam.getByExamCode(exam_code, function(err,docs){
        if(err)
        res.send("some error occured");
        else
        {
            //console.log('getByExamCodegetByExamCodegetByExamCode');
            //console.log(doc);
           var exam_obj = docs.question_list;
           var exam_adventitious_obj = docs.question_list_adventitious;

           var exam_single = parseInt(docs.exam_single);
           var exam_adventitious = parseInt(docs.exam_adventitious);
           var exam_single_pointvalue = parseInt(docs.exam_single_pointvalue);
           var exam_adventitious_pointvalue = parseInt(docs.exam_adventitious_pointvalue);
           var exam_name = docs.exam_name;
           var faculty_username = docs.faculty_username;

            Exam.getResponseByExamCode(exam_code, username, function(err, docs){
                if(err)
                    res.send("some error occured");
                else
                {
                    console.log('exam detail');
                    console.log(JSON.stringify(docs));
                    var response_obj = docs.response;
                    var response_num_obj = docs.response_num;
                    var total_questions = 0;
                    var attempted = 0;
                    var correct_single = 0;
                    var correct_adventitious = 0;
                    var score = 0;
                    var score_subject = 0;
                    
                    var result_detail = '';
                    
                    if(docs.score_subject == undefined)
                    {
                        score_subject = 0;
                    }
                    else
                    {
                        for(var temp in docs.score_subject) 
                        {
                            score_subject += parseInt(docs.score_subject[temp]);
                        }
                    }

                    for(var temp in response_obj) {
                        console.log(temp);
                        //console.log(response_obj[temp]);
                        total_questions++;
                        result_detail += response_obj[temp];
                        result_detail += '/n/r';
                        if (temp<exam_single)
                        {

                            if(response_obj[temp] == exam_obj[response_num_obj[0][temp]].key)
                            {
                                    correct_single++;
                            }
                        }
                        else if(temp< (exam_adventitious+exam_single) )
                        {
                            var correct_temp = 1;
                            if(response_obj[temp].length == exam_adventitious_obj[response_num_obj[1][temp-exam_single]].key.length)
                            {
                                for(var temp2 in response_obj[temp])
                                {
                                    if(response_obj[temp][temp2] != exam_adventitious_obj[response_num_obj[1][temp-exam_single]].key[temp2])
                                    {
                                        correct_temp = 0;
                                        break;
                                    }
                                }
                            }
                            else
                            {
                                correct_temp = 0;
                            }
                            
                            //if(response_obj[temp] == exam_adventitious_obj[response_num_obj[1][temp-exam_single]].key)
                            if(correct_temp == 1)
                            {

                                    correct_adventitious++;
                            }
                        }
                    }

                    score = exam_single_pointvalue*correct_single + exam_adventitious_pointvalue*correct_adventitious;
                    total_score = score + score_subject;
                    res.render('exams/performance',{title: 'Result', username: username, IDnumber: IDnumber, 
                        exam_name: exam_name,total_score:total_score,exam_code:exam_code,
                        exam_start_time:exam_start_time,faculty_username:faculty_username});
                }
            });
        }
    });}
}
    else
    {
        console.log('exams/view_performance_code_entry');
        res.render('exams/view_performance_code_entry', {title: "Enter Exam Code", username: req.user.username});
    }                       
    });
            }
    });

});

module.exports = router;


function isLoggedInAsStudent(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()&&req.user.usertype=='student')
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}