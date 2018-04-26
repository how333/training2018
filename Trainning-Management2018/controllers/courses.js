var express = require('express'),
router = express.Router(),
Faculty = require('../models/faculty'), 
Record = require('../models/learning_record'),
Course = require('../models/course');

var default_courseid = "CourseID";

var default_course = {
    courseid: "CourseID",
    coursename: "coursename"
};

router.get('/new', isLoggedIn,
function(req, res) {
    var back_link = '';
    if (req.user.usertype == 'admin') back_link = '/admin/home';

    else if (req.user.usertype == 'super_admin') back_link = '/super_admin/home';

    res.render('courses/new', {
        title: 'Add New course',
        course: default_course,
        back_link: back_link
    });
});

router.post('/create', isLoggedIn,
function(req, res) {
    var charpter = [{ name: 'Charpter One', id: '1', doc: [], video: [],scenario:[] }] ;

    var course = {
        courseid: req.body.courseid,
        coursename: req.body.coursename,
        charpter: charpter
    };
    var courseid = req.body.courseid;

    Course.getBycourseid(courseid,
    function(err, doc) {
        if (err) res.send("Some error occured");
        else if (doc) res.redirect('/courses/new');
        else {
            Course.create(course,
            function(err, doc) {
                if (err) res.send("Some error occured");
                else {
                    console.log('course create');
                    console.log(req.user.usertype);
                    if (req.user.usertype == 'admin') res.redirect('/admin/home');

                    else if (req.user.usertype == 'super_admin') res.redirect('/super_admin/home');
                }
            })
        }
    })
});

router.get('/get_courseid_edit', isLoggedInAsFaculty,
function(req, res) {
    var back_link = '';
    if (req.user.usertype == 'admin') back_link = '/admin/home';

    else if (req.user.usertype == 'super_admin') back_link = '/super_admin/home';
    res.render('courses/get_courseid_edit', {
        title: "Get course ID",
        courseid: default_courseid,
        back_link: back_link
    });
});

router.get('/get_coursename_edit', isLoggedIn,
function(req, res) {
    var back_link = '';
    if (req.user.usertype == 'admin') back_link = '/admin/home';

    else if (req.user.usertype == 'super_admin') back_link = '/super_admin/home';
    res.render('courses/get_coursename_edit', {
        title: "Get course ID",
        courseid: default_courseid,
        back_link: back_link
    });
});

router.get('/edit_name', isLoggedIn,
function(req, res) {
    var back_link = '';
    if (req.user.usertype == 'admin') back_link = '/admin/home';

    else if (req.user.usertype == 'super_admin') back_link = '/super_admin/home';

    var courseid = req.query.courseid;
    Course.getBycourseid(courseid,
    function(err, doc) {
        if (err) res.send("Some error occured");
        else {
            if (doc) res.render('courses/edit_name', {
                title: 'Edit Course',
                course: doc,
                back_link: back_link
            });
            else res.render('courses/get_coursename_edit', {
                title: "Get course ID",
                courseid: default_courseid,
                back_link: back_link
            });
        }
    });
});


router.get('/edit', isLoggedInAsFaculty,
function(req, res) {
    var back_link = '';
    if (req.user.usertype == 'admin') back_link = '/admin/home';

    else if (req.user.usertype == 'super_admin') back_link = '/super_admin/home';

    var courseid = req.query.courseid;

    console.log('edit course now');
    console.log(req.user.course_list);
    course_list = req.user.course_list;
    //Faculty.getByUserName(req.username)
    console.log( course_list.indexOf('222'));
    console.log (course_list.indexOf(courseid) );
    if( course_list.indexOf(courseid) <0)
    {
        res.render('courses/get_courseid_edit', {
                    title: "Get course ID",
                    courseid: default_courseid,
                    back_link: back_link
                });
    }
    else
    {
        Course.getBycourseid(courseid,
        function(err, doc) {
            if (err) res.send("Some error occured");
            else {
                if (doc) res.render('courses/edit', {
                    title: 'Edit Course',
                    course: doc,
                    back_link: back_link
                });
                else res.render('courses/get_courseid_edit', {
                    title: "Get course ID",
                    courseid: default_courseid,
                    back_link: back_link
                });
            }
        });

    }


});

router.post('/update', isLoggedIn,
function(req, res) {
    var course = {
        courseid: req.body.courseid,
        coursename: req.body.coursename
    };
    var prevcourseid = req.body.prevcourseid;
    Course.update(prevcourseid, course,
    function(err, doc) {
        if (err) res.render('courses/edit', {
            title: 'Edit Course',
            course: doc
        });
        else {
            if (req.user.usertype == 'admin') res.redirect('/admin/home');

            else if (req.user.usertype == 'super_admin') res.redirect('/super_admin/home');
        }
    });
});


router.post('/update_name', isLoggedIn,
function(req, res) {
    var course = {
        courseid: req.body.courseid,
        coursename: req.body.coursename
    };
    var prevcourseid = req.body.prevcourseid;
    Course.update_name(prevcourseid, course,
    function(err, doc) {
        if (err) res.render('courses/edit', {
            title: 'Edit Course',
            course: doc
        });
        else {
            if (req.user.usertype == 'admin') res.redirect('/admin/home');

            else if (req.user.usertype == 'super_admin') res.redirect('/super_admin/home');
        }
    });
});


router.get('/get_courseid_delete', isLoggedIn,
function(req, res) {
    var back_link = '';
    if (req.user.usertype == 'admin') back_link = '/admin/home';

    else if (req.user.usertype == 'super_admin') back_link = '/super_admin/home';

    var default_courseid = "User Name";
    res.render('courses/get_courseid_delete', {
        title: "Get course ID",
        courseid: default_courseid,
        back_link: back_link
    });
});

router.post('/delete', isLoggedIn,
function(req, res) {
    var courseid = req.body.courseid;
    Course.getBycourseid(courseid,
    function(err, doc) {
        if (err) res.send("Some error occured");
        else if (doc) {
            Course.remove(courseid,
            function(err, doc) {
                if (err) res.send("Some error occured");
                else {
                    if (req.user.usertype == 'admin') res.redirect('/admin/home');

                    else if (req.user.usertype == 'super_admin') res.redirect('/super_admin/home');
                }
            });

            Record.getAllUsers(function(err, doc) {
                if (err) res.send("Some error occured");
                else {
                    for(index in doc) {
                        username = doc[index].username;
                        // for(var i=0; i<doc[index].record_list.document.length; i++) {
                        //     courseid = doc[index].record_list.document[i].course_id;
                        // }
                        Record.delete_course_doc(username, courseid);
                        Record.delete_course_video(username, courseid);
                        Record.delete_course_scenario(username, courseid);
                    }
                }
            });

        } else res.render('courses/get_courseid_delete', {
            title: "Get course ID",
            courseid: default_courseid
        });
    })
});

router.get('/get_courses', isLoggedIn,
function(req, res) {

    console.log('start get_courses');
    Course.get_courses(function(err, docs) {
        console.log(' router getExamCode');
        console.log(docs);
        if (err) res.send("some error occured");
        else res.json(docs);
    });
});

router.get('/get_courses_by_student', isLoggedInAsStudent,
function(req, res) {

    console.log('start get_courses');
    Course.get_courses(function(err, docs) {
        console.log(' router getExamCode');
        console.log(docs);
        if (err) res.send("some error occured");
        else res.json(docs);
    });
});

router.get('/get_student_courses', isLoggedInAsStudent,
function(req, res) {

    console.log('start get_courses now');
    console.log(req.user);
    res.json(req.user.course_list);

});

router.get('/get_courseid_charpters', isLoggedInAsFaculty,
function(req, res) {
    console.log('req.query.courseid');
    console.log(req.query.courseid);
    Course.get_courseid_charpters(req.query.courseid,
    function(err, docs) {
        console.log(' router getExamCode');
        console.log(docs);
        if (err) res.send("some error occured");
        else res.json(docs);
    });
});

router.get('/get_courseid_charpters_by_student', isLoggedInAsStudent,
function(req, res) {
    console.log('req.query.courseid');
    console.log(req.query.courseid);
    Course.get_courseid_charpters(req.query.courseid,
    function(err, docs) {
        console.log(' router getExamCode');
        console.log(docs);
        if (err) res.send("some error occured");
        else res.json(docs);
    });
});

router.get('/update_courseid_charpters', isLoggedInAsFaculty,
function(req, res) {
    console.log('update_courseid_charpters');
    console.log(req.query.courseid);
    console.log(req.query.charpters);

    Course.update_courseid_charpters(req.query.courseid, req.query.charpters,
    function(err, docs) {
        console.log(' router getExamCode');
        console.log(docs);
        if (err) res.send("some error occured");
        else res.json('ok');
    });
});

module.exports = router;

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated() && ((req.user.usertype == 'admin') || (req.user.usertype == 'super_admin'))) return next();

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

function isLoggedInAsFaculty(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()&&req.user.usertype=='faculty')
        {return next();}

    // if they aren't redirect them to the home page
    res.redirect('/');
}