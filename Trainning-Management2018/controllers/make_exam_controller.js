var express = require('express'),
router = express.Router(),
Exam = require('../models/exam'),
Course = require('../models/student'),
Faculty = require('../models/faculty'),
multiparty = require('multiparty'),
Getfile = require('../tools/getfile') ,
util = require('util'),
fs = require('fs'),
Correct_Automatic = require('../tools/correct_automatic'),
ReadExcel = require('../tools/readexcel');
$ = require("cheerio");

var default_examid = "ExamID";

router.get('/new', isLoggedInAsFaculty,
function(req, res) {
    var default_exam = {
        exam_name: "Exam Name",
        exam_code: "Exam Code",
        exam_single: "Exam Single",
        exam_single_pointvalue: "Exam Single Pointvalue",
        exam_adventitious: "Exam Adventitious",
        exam_adventitious_pointvalue: "Exam Adventitious Pointvalue",
        duration_hours: 1,
        duration_minutes: 0,
        course_code: "Course Code",
        faculty_username: "Faculty User Name"
    };
    res.render('exams/new', {
        title: 'Make New Exam',
        exam: default_exam
    });
});

router.get('/get_examid_edit', isLoggedInAsFaculty,
function(req, res) {
    res.render('exams/get_examid_edit', {
        title: "Get Exam ID"
    });
});

router.get('/get_examid_correct', isLoggedInAsFaculty,
function(req, res) {
    res.render('exams/get_examid_correct', {
        title: "Get Exam ID"
    });
});

router.get('/get_operation_correct', isLoggedInAsFaculty,
function(req, res) {
    res.render('exams/get_operation_correct', {
        title: "Get Exam ID"
    });
});

router.post('/correct', isLoggedInAsFaculty,
function(req, res) {

    var exam_code = req.body.exam_code;

    Exam.FacultycheckResponseIsExist(exam_code,
    function(err, doc) {
        if (err) res.send("Some error occured");
        else if (doc) {
            Exam.FacultycheckResponse(exam_code,
            function(err, docs) {
                console.log('reuslt FacultycheckResponse ');
                 res.render('exams/correct_list', {
                    title: 'Take Exam',
                    exam_code: exam_code
                });
            })

        } else {
            res.render('exams/get_examid_result', {
                title: "Get Exam ID",
                courseid: default_examid
            });
        }
    })

});


router.post('/correct_operation', isLoggedInAsFaculty,
function(req, res) {

    var exam_code = req.body.exam_code;
    var d = new Date();
    var time_now = d.getTime() + 1000*60*60*8;

    Exam.FacultycheckResponseIsExist(exam_code,
    function(err, doc) {
        if (err) res.send("Some error occured");
        else if (doc) {
            Exam.FacultycheckResponse(exam_code,
            function(err, docs) {
                console.log('reuslt FacultycheckResponse ');
                 res.render('exams/correct_operation_list', {
                    title: 'Take Exam',
                    exam_code: exam_code
                });
            })

        } else {
            res.render('exams/get_examid_result', {
                title: "Get Exam ID",
                courseid: default_examid
            });
        }
    })

});

router.post('/edit', isLoggedInAsFaculty,
function(req, res) {
    var exam_code = req.body.exam_code;
    console.log('exam_code');
    console.log(exam_code);
    console.log('find exam_code');
    Exam.getByExamCode(exam_code,
    function(err, doc) {
        if (err) res.send("Some error occured");
        else if (doc)

        {
            console.log('no doc find');
            console.log(doc); {
                res.render('exams/question_list', {
                    exam: doc
                })
            };
        } else {
            console.log('no doc find');
            res.render('exams/get_examid_edit');
        }
    });

});

router.get('/get_examid_result', isLoggedInAsFaculty,
function(req, res) {
    res.render('exams/get_examid_result', {
        title: "Get Exam ID",
        courseid: default_examid
    });
});

router.get('/modify_examid_result', isLoggedInAsFaculty,
function(req, res) {
    res.render('exams/modify_examid_result', {
        title: "Get Exam ID",
        courseid: default_examid
    });
});

router.get('/get_operation_result', isLoggedInAsFaculty,
function(req, res) {
    res.render('exams/get_operation_result', {
        title: "Get Exam ID",
        courseid: default_examid
    });
});

router.get('/modify_operation_result', isLoggedInAsFaculty,
function(req, res) {
    res.render('exams/modify_operation_list', {
        title: "Get Exam ID",
        courseid: default_examid
    });
});


router.post('/modify_reuslt', isLoggedInAsFaculty,
function(req, res) {

    console.log('get the courese result');
    var username = req.body.username;
    var exam_code = req.body.exam_code;
    console.log(username, exam_code);

    Exam.FacultycheckResponseIsExist(exam_code,
    function(err, doc) {
        if (err) res.send("Some error occured");
        else if (doc) {
            Exam.FacultycheckResponse(exam_code,
            function(err, docs) {
                console.log('reuslt FacultycheckResponse ');
                 res.render('exams/modify_list', {
                    title: 'Take Exam',
                    exam_code: exam_code,
                    username: username
                });
            });

        } else {
            res.render('exams/get_examid_result', {
                title: "Get Exam ID",
                courseid: default_examid
            });
        }
    });
});

router.post('/reuslt', isLoggedInAsFaculty,
function(req, res) {

    console.log('get the courese result');
    var username = req.body.username;
    var exam_code = req.body.exam_code;
    console.log(username, exam_code);

    Exam.getByExamCode(exam_code,
    function(err, doc1) {
        if (err) res.send("Some error occured");
        else if (doc1) { 
            var exam_name = doc1.exam_name;
            var faculty_username = doc1.faculty_username;



    Exam.FacultycheckResponseIsExist(exam_code,
    function(err, doc) {
        if (err) res.send("Some error occured");
        else if (doc) {
            Exam.FacultycheckResponse(exam_code,
            function(err, docs) {
                console.log('reuslt FacultycheckResponse ');
                 res.render('exams/performance_result', {
                    title: 'Take Exam',
                    exam_code: exam_code,
                    username: username,
                    exam_name:exam_name,
                    faculty_username:faculty_username
                });
            });

        } else {
            res.render('exams/get_examid_result', {
                title: "Get Exam ID",
                courseid: default_examid
            });
        }
    });
        }});
});


router.post('/reuslt_operation', isLoggedInAsFaculty,
function(req, res) {

    console.log('get the courese result');
    var username = req.body.username;
    var exam_code = req.body.exam_code;
    console.log(username, exam_code);

    Exam.getByExamCode(exam_code,
    function(err, doc1) {
        if (err) res.send("Some error occured");
        else if (doc1) { 
            var exam_name = doc1.exam_name;
            var faculty_username = doc1.faculty_username;

    Exam.FacultycheckResponseIsExist(exam_code,
    function(err, doc) {
        if (err) res.send("Some error occured");
        else if (doc) {
            Exam.FacultycheckResponse(exam_code,
            function(err, docs) {
                console.log('reuslt FacultycheckResponse ');
                 res.render('exams/operation_performance_result', {
                    title: 'Take Exam',
                    exam_code: exam_code,
                    username: username,
                    exam_name:exam_name,
                    faculty_username:faculty_username
                });
            });

        } else {
            res.render('exams/get_operation_result', {
                title: "Get Exam ID",
                courseid: default_examid
            });
        }
    });
    }});
});

router.post('/modify_reuslt_operation', isLoggedInAsFaculty,
function(req, res) {

    console.log('get the courese result');
    var username = req.body.username;
    var exam_code = req.body.exam_code;
    console.log(username, exam_code);

    Exam.FacultycheckResponseIsExist(exam_code,
    function(err, doc) {
        if (err) res.send("Some error occured");
        else if (doc) {
            Exam.FacultycheckResponse(exam_code,
            function(err, docs) {
                console.log('reuslt FacultycheckResponse ');
                 res.render('exams/modify_operation', {
                    title: 'Take Exam',
                    exam_code: exam_code,
                    username: username
                });
            });

        } else {
            res.render('exams/get_operation_result', {
                title: "Get Exam ID",
                courseid: default_examid
            });
        }
    });
});

router.get('/list', isLoggedInAsFaculty,
function(req, res) {

    console.log('make list');
    Exam.FacultycheckResponse(req.query.exam_code,
    function(err, docs) {
        if (err) res.send("some error occured");
        else {
            console.log('find the list contents');
            console.log(docs);
            res.json(docs);
        }

    });
});

router.get('/list_by_stu', isLoggedInAsStudent,
function(req, res) {

    console.log('make list');
    Exam.FacultycheckResponse(req.query.exam_code,
    function(err, docs) {
        if (err) res.send("some error occured");
        else {
            console.log('find the list contents');
            console.log(docs);
            res.json(docs);
        }

    });
});



router.get('/get_response_by_usernameAndexamcode', isLoggedInAsStudent,
function(req, res) {

    console.log('make list');
    Exam.getResponseByExamCode(req.query.exam_code,req.query.username,
    function(err, docs) {
        if (err) res.send("some error occured");
        else {
            console.log('find the list contents');
            console.log(docs);
            res.json(docs);
        }

    });
});

router.get('/get_response_score_automatic_Cosine', isLoggedInAsStudent,
function(req, res) {
    console.log('get_response_score_automatic');
    var correct_automatic = new Correct_Automatic();
    result = correct_automatic.Cosine(req.query.exam_obj_subjective,req.query.response_content);
    res.json(result);
});

router.get('/get_response_score_automatic_Levenshtein', isLoggedInAsStudent,
function(req, res) {
    console.log('get_response_score_automatic');
    var correct_automatic = new Correct_Automatic();
    result = correct_automatic.Levenshtein(req.query.exam_obj_subjective,req.query.response_content);
    res.json(result);
});

router.get('/update_score', isLoggedInAsFaculty,
function(req, res) {

    console.log('make list');
    Exam.update_score(req.query.exam_code,req.query.username,req.query.score_subject,
    function(err, docs) {
        if (err) res.send("some error occured");
        else {
            console.log('find the list contents');
            console.log(docs);
            res.json(docs);
        }

    });
});

router.get('/update_score_automatic', isLoggedInAsStudent,
function(req, res) {

    console.log('make list');
    Exam.update_score(req.query.exam_code,req.query.username,req.query.score_subject,
    function(err, docs) {
        if (err) res.send("some error occured");
        else {
            console.log('find the list contents');
            console.log(docs);
            res.json(docs);
        }

    });
});


router.get('/update_score_operation', isLoggedInAsFaculty,
function(req, res) {
    var d = new Date();
    var time_now = d.getTime() + 1000*60*60*8;
    
    Exam.update_score_operation(req.query.exam_code,req.query.username,req.query.score_operation,time_now,
    function(err, docs) {
        if (err) res.send("some error occured");
        else {
            console.log('find the list contents');
            console.log(docs);
            res.json(docs);
        }

    });
});


router.post('/create', isLoggedInAsFaculty,
function(req, res) {
    var exam = {
        exam_name: req.body.exam_name,
        exam_code: req.body.exam_code,
        exam_single: req.body.exam_single,
        exam_single_pointvalue:req.body.exam_single_pointvalue,
        exam_adventitious: req.body.exam_adventitious,
        exam_adventitious_pointvalue:req.body.exam_adventitious_pointvalue,
        duration_hours: req.body.duration_hours,
        duration_minutes: req.body.duration_minutes,
        course_code: req.body.course_code,
        faculty_username: req.user.username
    };
    var exam_code = req.body.exam_code;
    var course_code = req.body.course_code;
    var faculty_username = req.user.username;
    Exam.getByExamCode(exam_code,
    function(err, doc) {
        if (err) res.send("Some error occured");
        else if (doc)

        {
            console.log(doc);
            console.log("doc exit");
            res.redirect('/make_exam/new');
        } else {
            console.log(doc);
            console.log("exam doc no exit");
            Faculty.getBycourseid(faculty_username, course_code,
            function(err, doc) {
                console.log(faculty_username);
                console.log(course_code);
                console.log('faculty no course now');
                console.log(doc);
                if (err) {
                    console.log('err');
                    res.send("Some error occured");
                }

                else if (doc) {
                    console.log('back to make exam');
                    console.log(doc);
                    Exam.create(exam,
                    function(err, doc) {
                        if (err) res.send("Some error occured");
                        else if (doc) {
                            res.render('exams/question_list', {
                                exam: exam
                            })
                        };

                    })

                } else {
                    console.log(doc);
                    res.redirect('/make_exam/new');
                }
            })
        }

    })
});

router.get('/question_list', isLoggedInAsFaculty,
function(req, res) {
    Exam.getByExamCode(req.body.exam_code,
    function(err, docs) {
        if (err) res.send("some error occured");
        else res.render('exams/question_list', {
            exam: docs
        });
    });
});

router.get('/add_question', isLoggedInAsFaculty,
function(req, res) {
    var exam_code = req.body.exam_code;
    var default_question_full = {
        question: "Question",
        optionA: "option A",
        optionB: "option B",
        optionC: "option C",
        optionD: "option D",
        key: "Key"
    };
    res.render('exams/new_question', {
        title: 'Add New Question',
        question_full: default_question_full,
        exam_code: exam_code
    });
});

router.post('/add_question', isLoggedInAsFaculty,
function(req, res) {
    var exam_code = req.body.exam_code;
    var default_question_full = {
        question: "Question",
        optionA: "option A",
        optionB: "option B",
        optionC: "option C",
        optionD: "option D",
        key: "Key"
    };
    res.render('exams/new_question', {
        title: 'Add New Question',
        question_full: default_question_full,
        exam_code: exam_code
    });
});



router.post('/add_question_batch', isLoggedInAsFaculty,
function(req, res) {
    var exam_code = req.body.exam_code;
    res.render('exams/new_question_batch', {
        title: 'Add New Question',
        exam_code: exam_code
    });

});

router.post('/add_question_adventitious_batch', isLoggedInAsFaculty,
function(req, res) {
    var exam_code = req.body.exam_code;
    res.render('exams/new_question_adventitious_batch', {
        title: 'Add New Question',
        exam_code: exam_code
    });

});

router.post('/add_question_subjective_batch', isLoggedInAsFaculty,
function(req, res) {
    var exam_code = req.body.exam_code;
    res.render('exams/new_question_subjective_batch', {
        title: 'Add New Question',
        exam_code: exam_code
    });

});

router.post('/add_question_operation_batch', isLoggedInAsFaculty,
function(req, res) {
    var exam_code = req.body.exam_code;
    res.render('exams/new_question_operation_batch', {
        title: 'Add New Question',
        exam_code: exam_code
    });

});

router.post('/batch_add_question', isLoggedInAsFaculty,
function(req, res) {

    console.log('batch_add_question');
    console.log(req);
    console.log(req.body.exam_code);

    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({
        uploadDir: '../public/files/'
    });
    //上传完成后处理
    console.log('got the content2');
    form.parse(req,
    function(err, fields, files) {
        var filesTmp = JSON.stringify(files, null, 2);

        if (err) {
            console.log('parse error: ' + err);
        } else {

            var inputFile = files.inputFile[0];
            var uploadedPath = inputFile.path;
            var dstPath = '../public/files/' + inputFile.originalFilename;
            //重命名为真实文件名
            //fs.unlink(dstPath);//会自动覆盖，不用删除
            fs.rename(uploadedPath, dstPath,
            function(err) {
                if (err) {
                    console.log(err);
                    console.log('rename error: ' + err);
                } else {
                    console.log('rename ok');
                    var readexcel = new ReadExcel();
                    filecontent = readexcel.readexcel(dstPath);
                    console.log('got the content in batch_add_question');
                    console.log(filecontent);
                    var no_ok = false;
                    filecontent.forEach(function(sheetcontent) {
                        console.log('look for exam');
                        if (sheetcontent.name.indexOf("exam") != -1) {
                            console.log('look for exam end');
                            var exam_code = sheetcontent.name.slice(5);
                            console.log(exam_code);
                            Exam.getByExamCode(exam_code,
                            function(err, docs) {
                                console.log(docs);
                                if (err) res.send("some error occured");
                                else if (docs) {
                                    console.log('start to read sheetcontent');
                                    Exam.clearQuestion(exam_code,
                                        function(err,docs1)
                                        {


                                    sheetcontent.data.forEach(function(sheetdata) {
                                        var question_full = {
                                            question: "Question",
                                            optionA: "option A",
                                            optionB: "option B",
                                            optionC: "option C",
                                            optionD: "option D",
                                            key: "Key"
                                        };
                                    try
                                    {
                                        console.log(sheetdata);
                                        console.log(typeof sheetdata[0]);
                                        question_full.question = sheetdata[0];
                                        question_full.optionA = sheetdata[1];
                                        question_full.optionB = sheetdata[2];
                                        question_full.optionC = sheetdata[3];
                                        question_full.optionD = sheetdata[4];
                                        question_full.key = sheetdata[5];
                                        
                                        if (sheetdata[4] == null)
                                        {
                                            
                                            no_ok = true;
                                        }
                                        else
                                        {
                                            Exam.addQuestion(exam_code, question_full,
                                            function(err, docs) {
                                                if (err) res.send("some error occured");
                                                else {
                                                    console.log('add one question successfully');
                                                }
                                            });
                                        }



                                    }
                                    catch(err)
                                    {
                                        no_ok = true;
                                        console.log('some error occured');
                                    }

                                    });
                                    });
                                    if(no_ok == false)
                                        res.redirect('/faculties/home');
                                    else
                                        res.render('exams/questions_wrong', {
                                            exam_code: exam_code
                                        });

                                } else {
                                    console.log('no such exam');
                                    res.send("no such exam number");
                                }
                            });
                        }

                    });

                }
            });
        }

    });
});



router.post('/batch_add_question_adventitious', isLoggedInAsFaculty,
function(req, res) {

    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({
        uploadDir: '../public/files/'
    });
    //上传完成后处理
    console.log('got the content2');
    form.parse(req,
    function(err, fields, files) {
        var filesTmp = JSON.stringify(files, null, 2);

        if (err) {
            console.log('parse error: ' + err);
        } else {

            var inputFile = files.inputFile[0];
            var uploadedPath = inputFile.path;
            var dstPath = '../public/files/' + inputFile.originalFilename;
            //重命名为真实文件名
            //fs.unlink(dstPath);//会自动覆盖，不用删除
            fs.rename(uploadedPath, dstPath,
            function(err) {
                if (err) {
                    console.log(err);
                    console.log('rename error: ' + err);
                } else {
                    console.log('rename ok');
                    var readexcel = new ReadExcel();
                    filecontent = readexcel.readexcel(dstPath);
                    console.log('got the content in batch_add_question');
                    console.log(filecontent);
                    var no_ok = false;
                    filecontent.forEach(function(sheetcontent) {
                        
                        console.log('look for exam');
                        if (sheetcontent.name.indexOf("exam") != -1) {
                            console.log('look for exam end');
                            var exam_code = sheetcontent.name.slice(5);
                            console.log(exam_code);
                            Exam.getByExamCode(exam_code,
                            function(err, docs) {
                                console.log(docs);
                                if (err) res.send("some error occured");
                                else if (docs) {

                                    Exam.clearQuestion_adventitious(exam_code,
                                        function(err,docs1)
                                        {
                                    console.log('start to read sheetcontent');
                                    sheetcontent.data.forEach(function(sheetdata) {
                                        var question_full = {
                                            question: "Question",
                                            optionA: "option A",
                                            optionB: "option B",
                                            optionC: "option C",
                                            optionD: "option D",
                                            optionE: "option E",
                                            key: "Key"
                                        };

                            try { 
                                        console.log(sheetdata);
                                        console.log(typeof sheetdata[0]);
                                        question_full.question = sheetdata[0];
                                        question_full.optionA = sheetdata[1];
                                        question_full.optionB = sheetdata[2];
                                        question_full.optionC = sheetdata[3];
                                        question_full.optionD = sheetdata[4];
                                        question_full.optionE = sheetdata[5];
                                        var key= new Array(); //定义一数组 
                                        key=sheetdata[6].split(","); //字符分割 
                                        question_full.key = key;

                                        
                                        if(sheetdata[5] == null)
                                        {
                                            no_ok = true 
                                        }
                                        else
                                        {
                                            Exam.addQuestion_adventitious(exam_code, question_full,
                                            function(err, docs) {
                                                if (err) res.send("some error occured");
                                                else {
                                                    console.log('add one question successfully');
                                                }
                                            });                                            
                                        }


            


        } catch (err) {
            no_ok = true;
            console.log('some error occured');

        }




                                    });
                                    });
                                    if(no_ok == false)
                                        res.redirect('/faculties/home');
                                    else
                                        res.render('exams/questions_wrong', {
                                            exam_code: exam_code
                                        });
                                } else {
                                    console.log('no such exam');
                                    res.send("no such exam number");
                                }
                            });
                        }
                    });

                }
            });
        }

    });
});

router.post('/batch_add_question_subjective', isLoggedInAsFaculty,
function(req, res) {

    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({
        uploadDir: '../public/files/'
    });
    //上传完成后处理
    console.log('got the content2');
    form.parse(req,
    function(err, fields, files) {
        var filesTmp = JSON.stringify(files, null, 2);

        if (err) {
            console.log('parse error: ' + err);
        } else {

            var inputFile = files.inputFile[0];
            var uploadedPath = inputFile.path;
            var dstPath = '../public/files/' + inputFile.originalFilename;
            //重命名为真实文件名
            //fs.unlink(dstPath);//会自动覆盖，不用删除
            fs.rename(uploadedPath, dstPath,
            function(err) {
                if (err) {
                    console.log(err);
                    console.log('rename error: ' + err);
                } else {
                    console.log('rename ok');
                    var readexcel = new ReadExcel();
                    filecontent = readexcel.readexcel(dstPath);
                    console.log('got the content in batch_add_question');
                    console.log(filecontent);

                    var no_ok = false;
                    filecontent.forEach(function(sheetcontent) {
                        console.log('look for exam');
                        if (sheetcontent.name.indexOf("exam") != -1) {
                            console.log('look for exam end');
                            var exam_code = sheetcontent.name.slice(5);
                            console.log(exam_code);
                            Exam.getByExamCode(exam_code,
                            function(err, docs) {
                                console.log(docs);
                                if (err) res.send("some error occured");
                                else if (docs) {

                                    Exam.clearQuestion_subjective(exam_code,
                                        function(err,docs1)
                                        {

                                    console.log('start to read sheetcontent');
                                    sheetcontent.data.forEach(function(sheetdata) {
                                        var question_full = {
                                            question: "Question",
                                            answer:'answer',
                                            figures: "Figures"
                                        };
                                        try
                                        {
                                        console.log(sheetdata);
                                        console.log(typeof sheetdata[0]);
                                        question_full.question = sheetdata[0];
                                        question_full.answer = sheetdata[1]
                                        question_full.figures = sheetdata[2];

                                        if(sheetdata[2] == null)
                                        {
                                            no_ok = true;
                                        }
                                        else
                                        {
                                            Exam.addQuestion_subjective(exam_code, question_full,
                                            function(err, docs) {
                                                if (err) res.send("some error occured");
                                                else {
                                                    console.log('add one question successfully');
                                                }
                                            });                                                
                                        }
                                        
                                        }
                                        catch(err)
                                        {
                                            no_ok = true;
                                            console.log('some error occured');
                                        }


                                    });
                                    });
                                    if(no_ok == false)
                                        res.redirect('/faculties/home');
                                    else
                                        res.render('exams/questions_wrong', {
                                            exam_code: exam_code
                                        });

                                } else {
                                    console.log('no such exam');
                                    res.send("no such exam number");
                                }
                            });
                        }

                    });

                }
            });
        }

    });
});


router.post('/batch_add_question_operation', isLoggedInAsFaculty,
function(req, res) {

    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({
        uploadDir: '../public/files/'
    });
    //上传完成后处理
    console.log('got the content2');
    form.parse(req,
    function(err, fields, files) {
        var filesTmp = JSON.stringify(files, null, 2);

        if (err) {
            console.log('parse error: ' + err);
        } else {

            var inputFile = files.inputFile[0];
            var uploadedPath = inputFile.path;
            var dstPath = '../public/files/' + inputFile.originalFilename;
            //重命名为真实文件名
            //fs.unlink(dstPath);//会自动覆盖，不用删除
            fs.rename(uploadedPath, dstPath,
            function(err) {
                if (err) {
                    console.log(err);
                    console.log('rename error: ' + err);
                } else {
                    console.log('rename ok');
                    var readexcel = new ReadExcel();
                    filecontent = readexcel.readexcel(dstPath);
                    console.log('got the content in batch_add_question');
                    console.log(filecontent);
                    var no_ok = false;
                    filecontent.forEach(function(sheetcontent) {
                        console.log('look for exam');
                        if (sheetcontent.name.indexOf("exam") != -1) {
                            console.log('look for exam end');
                            var exam_code = sheetcontent.name.slice(5);
                            console.log(exam_code);
                            Exam.getByExamCode(exam_code,
                            function(err, docs) {
                                console.log(docs);
                                if (err) res.send("some error occured");
                                else if (docs) {

                                    Exam.clearQuestion_operation(exam_code,
                                        function(err,docs1)
                                        {

                                    console.log('start to read sheetcontent');
                                    sheetcontent.data.forEach(function(sheetdata) {
                                        var question_full = {
                                            question: "Question",
                                            figures: "Figures",
                                            scenario:"Scenario"
                                        };
                                    try
                                    {
                                        console.log(sheetdata);
                                        console.log(typeof sheetdata[0]);
                                        question_full.question = sheetdata[0];
                                        question_full.figures = sheetdata[1];
                                        question_full.scenario = sheetdata[2];

                                        if( sheetdata[2]== null)
                                        {
                                            no_ok = true;
                                        }
                                        else
                                        {
                                            Exam.addQuestion_operation(exam_code, question_full,
                                            function(err, docs) {
                                                if (err) res.send("some error occured");
                                                else {
                                                    console.log('add one question successfully');
                                                }
                                            });                                            
                                        }


                                    }
                                    catch(err)
                                    {
                                            no_ok = true;
                                            console.log('some error occured');                                        
                                    }

                                    });
                                    });
                                    if(no_ok == false)
                                        res.redirect('/faculties/home');
                                    else
                                        res.render('exams/questions_wrong', {
                                            exam_code: exam_code
                                        });

                                } else {
                                    console.log('no such exam');
                                    res.send("no such exam number");
                                }
                            });
                        }

                    });

                }
            });
        }

    });
});


router.post('/create_question', isLoggedInAsFaculty,
function(req, res) {
    console.log(req.body);
    var question_full = {
        question: req.body.question,
        optionA: req.body.optionA,
        optionB: req.body.optionB,
        optionC: req.body.optionC,
        optionD: req.body.optionD,
        key: req.body.key
    };

    var exam_code = req.body.exam_code;

    Exam.addQuestion(exam_code, question_full,
    function(err, docs) {
        if (err) res.send("some error occured");
        else {
            Exam.getByExamCode(exam_code,
            function(err, docs) {
                if (err) res.send("some error occured");
                else res.render('exams/question_list', {
                    exam: docs
                });
            });
        }
    });
});


router.post('/add_question_adventitious', isLoggedInAsFaculty,
function(req, res) {
    var exam_code = req.body.exam_code;
    var default_question_full = {
        question: "Question",
        optionA: "option A",
        optionB: "option B",
        optionC: "option C",
        optionD: "option D",
        optionE: "option E",
        key: "Key"
    };
    res.render('exams/new_question_adventitious', {
        title: 'Add New Question',
        question_full: default_question_full,
        exam_code: exam_code
    });
});

router.post('/add_question_subjective', isLoggedInAsFaculty,
function(req, res) {
    var exam_code = req.body.exam_code;
    var default_question_full = {
        question: "Question",
        figures: "Figures"
    };
    res.render('exams/new_question_subjective', {
        title: 'Add New Question',
        question_full: default_question_full,
        exam_code: exam_code
    });
});

router.post('/add_question_operation', isLoggedInAsFaculty,
function(req, res) {
    var exam_code = req.body.exam_code;
    var default_question_full = {
        question: "Question",
        figures: "Figures"
    };
    res.render('exams/new_question_operation', {
        title: 'Add New Question',
        question_full: default_question_full,
        exam_code: exam_code
    });
});

router.post('/create_question_operation', isLoggedInAsFaculty,
function(req, res) {

    console.log(req.body);
    var question_full = {
        question: req.body.question,
        figures: req.body.figures,
        scenario:req.body.scenario
    };

    var exam_code = req.body.exam_code;
    console.log('req.body.question');
    console.log(req.body.question);

    Exam.addQuestion_operation(exam_code, question_full,
    function(err, docs) {
        if (err) res.send("some error occured");
        else {
            Exam.getByExamCode(exam_code,
            function(err, docs) {
                if (err) res.send("some error occured");
                else res.render('exams/question_list', {
                    exam: docs
                });
            });
        }
    });
});


router.post('/create_question_subjective', isLoggedInAsFaculty,
function(req, res) {

    console.log(req.body);
    var question_full = {
        question: req.body.question,
        answer:req.body.answer,
        figures: req.body.figures
    };

    var exam_code = req.body.exam_code;
    console.log('req.body.question');
    console.log(req.body.question);

    Exam.addQuestion_subjective(exam_code, question_full,
    function(err, docs) {
        if (err) res.send("some error occured");
        else {
            Exam.getByExamCode(exam_code,
            function(err, docs) {
                if (err) res.send("some error occured");
                else res.render('exams/question_list', {
                    exam: docs
                });
            });
        }
    });
});

router.post('/create_question_adventitious', isLoggedInAsFaculty,
function(req, res) {

    console.log(req.body);
    var question_full = {
        question: req.body.question,
        optionA: req.body.optionA,
        optionB: req.body.optionB,
        optionC: req.body.optionC,
        optionD: req.body.optionD,
        optionE: req.body.optionE,
        key: req.body.key
    };

    var exam_code = req.body.exam_code;

    Exam.addQuestion_adventitious(exam_code, question_full,
    function(err, docs) {
        if (err) res.send("some error occured");
        else {
            Exam.getByExamCode(exam_code,
            function(err, docs) {
                if (err) res.send("some error occured");
                else res.render('exams/question_list', {
                    exam: docs
                });
            });
        }
    });
});

router.get('/submit', isLoggedInAsFaculty,
function(req, res) {
    res.send("exam successfully created");
});

router.get('/list', isLoggedInAsFaculty,
function(req, res) {
    Exam.getByExamCode(req.query.exam_code,
    function(err, docs) {
        if (err) res.send("some error occured");
        else res.json(docs);
    });
});

router.get('/getExamCode', isLoggedInAsFaculty,
function(req, res) {
    Exam.getByExamCode(req.query.exam_code,
    function(err, docs) {
        console.log(' router getExamCode');
        console.log(docs);
        if (err) res.send("some error occured");
        else res.json(docs);
    });
});

router.get('/getExamCode_by_stu', isLoggedInAsStudent,
function(req, res) {
    Exam.getByExamCode(req.query.exam_code,
    function(err, docs) {
        console.log(' router getExamCode');
        console.log(docs);
        if (err) res.send("some error occured");
        else res.json(docs);
    });
});

router.get('/getscenarios', isLoggedInAsFaculty, function(req, res) {

    var getfile = new Getfile();
    result = getfile.getscenarios();
    console.log(result);
    res.json(result);
});

router.post('/edit_exam_time', isLoggedInAsFaculty, function(req, res) {
    console.log('edit_exam_time');
    var exam_code = req.body.exam_code;
    res.render('exams/edit_exam_time', {
        title: 'Add New Question',
        exam_code: exam_code
    });
});


router.post('/submit_new_time', isLoggedInAsFaculty,
function(req, res) {

    var duration_hours= req.body.duration_hours;
    var duration_minutes = req.body.duration_minutes;
    var exam_code = req.body.exam_code;
    
    Exam.update_time(exam_code,duration_hours,duration_minutes,
    function(err, docs) {

        if (err) res.send("some error occured");
        else res.render('exams/question_list', {
            exam: docs
        });
    });


});

module.exports = router;

function isLoggedInAsFaculty(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated() && req.user.usertype == 'faculty') {
        return next();
    }

    // if they aren't redirect them to the home page
    res.redirect('/');
}

function isLoggedInAsStudent(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()&&req.user.usertype=='student')
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}