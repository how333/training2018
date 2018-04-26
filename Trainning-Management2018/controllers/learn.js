var express = require('express')
, router = express.Router()
, os = require('os')
, Exam = require('../models/exam')
, Student = require('../models/student')
,Course = require('../models/course')
,Record = require('../models/learning_record')
,Getfile = require('../tools/getfile')
,Runbat = require('../tools/runbat');
var xml2js = require('xml2js');
var parser = new xml2js.Parser({explicitArray: false});

router.get('/home', isLoggedInAsStudent, function(req, res) {
    res.render('learn/learn_content_choice', {title: "Learn Content Choice", username: req.user.username});
});

router.post('/learn_prepare', isLoggedInAsStudent, function(req, res) {

    if((req.body.Select_Course == '')||(req.body.Select_Charpter == '')||(req.body.Select_Content == '')) {
        res.render('learn/learn_content_choice', {title: "Learn Content Choice", username: req.user.username});
    } else {
        console.log(req.body.Select_Course);
        var username = req.user.username;
        var course_sel = req.body.Select_Course;
        var charpter_sel = req.body.Select_Charpter;
        var content_sel = req.body.Select_Content;
        var record_current = null;
        var doc_of_charpter =null;
        var video_of_charpter = null;
        var scenario_of_charpter = null;
        var courseid_of_doc = new Array();
        var courseid_of_video = new Array();
        var courseid_of_scenario = new Array();
        var docName_of_charpter = new Array();
        var videoName_of_charpter = new Array();
        var scenarioName_of_charpter = new Array();
        var docRecordArray = new Array();
        var videoRecordArray = new Array();
        var scenarioRecordArray = new Array();
        var array1 = new Array();
        var array2 = new Array();
        Record.getByUserName(username, function(err, doc) {
            if(err)
                res.send("Some error occured");
            else if(doc) {
                console.log(doc);
                console.log(course_sel);
                console.log(charpter_sel);
                console.log(content_sel);
                //console.log(index);
                if(content_sel == 'document') {
                    doc_of_charpter = doc.record_list.document;
                    console.log(doc_of_charpter);
                    for(var i=0; i<doc_of_charpter.length; i++) {
                        courseid_of_doc[i] = doc_of_charpter[i].course_id;
                        docName_of_charpter[i] = doc_of_charpter[i].docName;
                        docRecordArray[i] = doc_of_charpter[i].record;
                    }
                    console.log(docName_of_charpter);
                    console.log('------------------------------');
                    res.render('learn/document_list', {title: "Learn Content Choice", array1: docName_of_charpter, array2: docRecordArray, courseid:courseid_of_doc, username: req.user.username});
                } else if(content_sel == 'video') {
                    video_of_charpter = doc.record_list.video;
                    console.log(video_of_charpter);
                    for(var i=0; i<video_of_charpter.length; i++) {
                        courseid_of_video[i] = video_of_charpter[i].course_id;
                        videoName_of_charpter[i] = video_of_charpter[i].docName;
                        videoRecordArray[i] = video_of_charpter[i].record;
                    }
                    console.log(videoName_of_charpter);
                    console.log('------------------------------');
                    res.render('learn/document_list', {title: "Learn Content Choice", array1: videoName_of_charpter, array2: videoRecordArray, courseid:courseid_of_video, username: req.user.username});
                } else if(content_sel == 'operation') {
                    scenario_of_charpter = doc.record_list.scenario;
                    console.log(scenario_of_charpter);
                    for(var i=0; i<scenario_of_charpter.length; i++) {
                        courseid_of_scenario[i] = scenario_of_charpter[i].course_id;
                        scenarioName_of_charpter[i] = scenario_of_charpter[i].docName;
                        scenarioRecordArray[i] = scenario_of_charpter[i].record;
                    }
                    console.log(scenarioName_of_charpter);
                    console.log('------------------------------');
                    res.render('learn/document_list', {title: "Learn Content Choice", array1: scenarioName_of_charpter, array2: scenarioRecordArray, courseid:courseid_of_scenario, username: req.user.username});
                } else {
                    res.send('something wrong');
                }
            }
        });
    }
});

router.post('/update_record', isLoggedInAsStudent, function(req, res) {
    var username = req.body.username;
    var courseid = req.body.courseid;
    var docname = req.body.docname;
    var contenttype = req.body.contenttype;
    var newrecord = req.body.currentrecord;
    console.log(username);
    console.log(docname);
    console.log(contenttype);
    console.log(newrecord);
    if(contenttype == 'document') {
            Record.update_document(username, courseid, docname, newrecord);
            res.end();
    }else if(contenttype == 'video') {
            Record.update_video(username, courseid, docname, newrecord);
            res.end();
    }else if(contenttype == 'operation') {
            Record.update_scenario(username, courseid, docname, newrecord);
            res.end();
    }else {
        res.send("Nothing Happened!");
    }
});

router.post('/learn_start', isLoggedInAsStudent, function(req, res) {
    var username = req.user.username;
    var course_sel = req.body.Select_Course;
});

router.post('/learn_continue', isLoggedInAsStudent, function(req, res) {
    var username = req.user.username;
    var course_sel = req.body.Select_Course;
    // var charpter_sel = req.body.Select_Charpter;
    // var content_sel = req.body.Select_Content;
    var contenttype = null;
    var docname = null;
    var record = null;

    Record.getByUserName(username, function(err, doc) {
        if(err)
            res.send("Some error occured");
        else if(doc) {
            var recordArrays = doc.recordArray;
            for(index in recordArrays) {
                contenttype = recordArrays[index].contentType;
                docname = recordArrays[index].docName;
                record = recordArrays[index].record;
            }
        }

    });

});

// router.post('/learn_continue', isLoggedInAsStudent, function(req, res) {

//     var username = req.user.username;
//     var contenttype = null;
//     var docname = null;
//     Record.getByUserName(username, function(err, doc) {
//         if(err)
//             res.send("Some error occured");
//         else if(doc) {
//             var recordArrays = doc.recordArray;
//             for(index in recordArrays) {
//                 if(recordArrays[index].docname == )
//             }
//         }
//     });
// });

router.get('/document_list', isLoggedInAsStudent, function(req, res) {
    res.render('learn/document_list', {title: "Learn Content Choice", username: req.user.username});
});

router.get('/document', isLoggedInAsStudent, function(req, res) {
    var getfile =  new Getfile();
    result = getfile.getdocuments();
    res.render('learn/document', {title: "Learn Content Choice", array: result,username: req.user.username});

});

router.get('/video', isLoggedInAsStudent, function(req, res) {
    var getfile =  new Getfile();
    result = getfile.getdocuments();
    res.render('learn/video', {title: "Learn Content Choice", array: result,username: req.user.username});

});

router.get('/scenario', isLoggedInAsStudent, function(req, res) {
    var getfile =  new Getfile();
    result = getfile.getdocuments();
    res.render('learn/scenario', {title: "Learn Content Choice", array: result,username: req.user.username});

});

router.post('/checkdoc', isLoggedInAsStudent, function(req, res) {
    console.log('checkdoc111');
    console.log(req.body.docname);
    docname = req.body.docname;

    var runbat = new Runbat();
    runbat.Runbat(docname);


    var getfile =  new Getfile();
    result = getfile.getdocuments(); 
    res.render('learn/document', {title: "Learn Content Choice", array: result,username: req.user.username});

})

router.get('/get_doc_store', isLoggedInAsFaculty, function(req, res) {

    var getfile = new Getfile();
    result = getfile.getdocuments();
    console.log(result);
    res.json(result);
});

router.get('/get_video_store', isLoggedInAsFaculty, function(req, res) {

    var getfile = new Getfile();
    result = getfile.getvideos();
    console.log(result);
    res.json(result);
});

router.get('/get_scenario_store', isLoggedInAsFaculty, function(req, res) {

    var getfile = new Getfile();
    result = getfile.getscenarios();
    console.log(result);
    res.json(result);
});


router.get('/get_scenario_content', isLoggedInAsStudent, function(req, res) {

    var filename = req.query.filename;
    var getfile = new Getfile();
    var result = getfile.get_scenario_content(filename);
    parser.parseString(data, function (err, result) {
        console.log('start');
        console.log(err);
            //console.log(result);
            if(result)
            {
                console.log(result);
                result.Scenario.operation.forEach(function(response_data){
                    console.log(response_data.topic);

                });
                res.json(result);
            }
            else if(err)
            {

                res.json('error');
            }
        });
    
});

router.get('/get_messages_content', isLoggedInAsStudent, function(req, res) {

    var filename = req.query.filename;
    var getfile = new Getfile();
    var result = getfile.get_messages_content(filename);
    parser.parseString(data, function (err, result) {
        console.log('start');
            //console.log(err);
            console.log(result);
            if(result)
            {
                console.log(result.Message);

                res.json(result);
            }
            else if(err)
            {

                res.json('result');
            }
        });
});

router.get('/get_ip_addr', isLoggedInAsStudent, function(req, res) {
    console.log('get dip addr')
    var ifaces = os.networkInterfaces();
    var ip = '';
    for (var dev in ifaces) {
        ifaces[dev].forEach(function (details) {
          if (ip === '' && details.family === 'IPv4' && !details.internal) {
            ip = details.address;
            console.log(ip);
            return;
        }
    });
    }
    console.log(ip || "127.0.0.1");
    res.json(ip || "127.0.0.1");
});

router.post('/exam', isLoggedInAsStudent, function(req, res) {
	var exam_code = req.body.exam_code;
	var username = req.body.username;
	console.log("begin to take exam");
    console.log(exam_code);
    console.log(username);
    Exam.getByExamCode(exam_code, function(err,doc1) 
    {
        if(err)
            res.send("Some error occured");
        else if(doc1)
        {
         console.log("find the exam id");
         console.log(doc1);
         Student.getBycourseid(username, doc1.course_code, function(err,doc)

         {
            if(err)
                res.send("Some error occured");
            else if(doc)
            {
               console.log('get the course no');
               console.log(doc);
               Exam.checkResponse(username, exam_code, function(err, doc) 
               {
                  console.log('find in the examcode');

                  if(err)
                    res.send("Some error occured");
                else if(doc)
                {
                 console.log("doc no empty");
                 console.log(doc);
							//res.redirect('/take_exam');
							res.render('exams/take_exam', { title: 'Take Exam', exam_code: exam_code, username: username});
						}

                        else
                        {
                         console.log("enter the exam");
                         res.render('exams/take_exam', { title: 'Take Exam', exam_code: exam_code, username: username}); 
                     }                       
                 })
           }
           else
            res.redirect('/take_exam');

    })
     }
     else
        res.redirect('/take_exam');


})
});

router.get('/list', isLoggedInAsStudent, function(req, res) {

    Exam.getByExamCode(req.query.exam_code, function(err,docs){
        if(err)
            res.send("some error occured");
        else
            res.json(docs);
    });
});


router.post('/submit', isLoggedInAsStudent, function(req, res) {

    var username=req.body.username;
    var exam_code=req.body.exam_code;

    var object=req.body
    var response = [];

    for(var key in object) {
        response.push(object[key]);
    }
    response.pop();
    response.pop();

    Exam.addResponses(username, exam_code, response, function(err,docs){
        if(err)
            res.send("some error occured");
        else
            res.render('exams/exam_submit', { title: 'Response Submitted Successfully', response: response, username: username, exam_code: exam_code});
    });

});

router.get('/performance', isLoggedInAsStudent, function(req, res) {

    res.render('exams/view_performance_code_entry', {title: "Enter Exam Code", username: req.user.username});

});

router.post('/performance_view', isLoggedInAsStudent, function(req, res) {

    var username=req.body.username;
    var exam_code=req.body.exam_code;

    Exam.checkResponse(username, exam_code, function(err, doc) 
    {
        if(err)
            res.send("Some error occured");
        else if(doc)
        {


            Exam.getByExamCode(exam_code, function(err,docs){
                if(err)
                    res.send("some error occured");
                else
                {
                 var exam_obj = docs.question_list;

                 Exam.getResponseByExamCode(exam_code, username, function(err, docs){
                    if(err)
                        res.send("some error occured");
                    else
                    {
                        var response_obj = docs.response;
                        var total_questions = 0;
                        var attempted = 0;
                        var correct = 0;

                        for(var temp in exam_obj) {

                            if(response_obj[total_questions] != ' ')
                                attempted++;
                            if(exam_obj[total_questions].key == response_obj[total_questions])
                                correct++;
                            total_questions++;
                        }

                        res.render('exams/performance',{title: 'Result', total_questions: total_questions, attempted: attempted, correct: correct});
                    }
                });
             }
         })}
            else
            {
                res.render('exams/view_performance_code_entry', {title: "Enter Exam Code", username: req.user.username});
            }                       
        })
});

module.exports = router;


function isLoggedInAsStudent(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()&&((req.user.usertype=='admin')||(req.user.usertype=='super_admin')||(req.user.usertype=='student')))
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    console.log(req.user.usertype);
    if (req.isAuthenticated() && ((req.user.usertype == 'admin') || (req.user.usertype == 'super_admin'))) return next();

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