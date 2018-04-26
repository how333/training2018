var express = require('express'),
router = express.Router(),
Exam = require('../models/exam'),
Course = require('../models/student'),
Getfile = require('../tools/getfile'),
multiparty = require('multiparty'),
util = require('util'),
fs = require('fs'),
Course = require('../models/course'),
Faculty = require('../models/faculty');

var default_examid = "ExamID";

router.get('/data_manage', isLoggedIn,
function(req, res) {
    var back_link = '';
    if (req.user.usertype == 'admin') back_link = '/admin/home';

    else if (req.user.usertype == 'super_admin') back_link = '/super_admin/home';

    res.render('learn/data_home', {
        title: 'Data Manage',
        back_link: back_link
    });
});

router.get('/scenario_manage', isLoggedIn,
function(req, res) {
    var back_link = '';
    if (req.user.usertype == 'admin') back_link = '/admin/home';

    else if (req.user.usertype == 'super_admin') back_link = '/super_admin/home';

    var getfile = new Getfile();
    result = getfile.getscenarios();
    res.render('learn/scenario_manage', {
        title: "Learn Scenario Choice",
        array: result,
        username: req.user.username,
        back_link: back_link
    });
});

router.get('/video_manage', isLoggedIn,
function(req, res) {
    var back_link = '';
    if (req.user.usertype == 'admin') back_link = '/admin/home';

    else if (req.user.usertype == 'super_admin') back_link = '/super_admin/home';

    var getfile = new Getfile();
    result = getfile.getvideos();
    res.render('learn/video_manage', {
        title: "Learn Video Choice",
        array: result,
        username: req.user.username,
        back_link: back_link
    });
});

router.get('/document_manage', isLoggedIn,
function(req, res) {
    var back_link = '';
    if (req.user.usertype == 'admin') back_link = '/admin/home';

    else if (req.user.usertype == 'super_admin') back_link = '/super_admin/home';

    var getfile = new Getfile();
    result = getfile.getdocuments();
    res.render('learn/document_manage', {
        title: "Learn Content Choice",
        array: result,
        username: req.user.username,
        back_link: back_link
    });

});

router.get('/renamedocument', isLoggedIn,
function(req, res) {
    console.log(req.query.oldname, req.query.newname);
    console.log(req);
    var oldname = req.query.oldname.substring(1);
    var newname = req.query.newname;

    var getfile = new Getfile();
    getfile.renamedocument(oldname, newname);
    console.log('renameend');
    //var result = getfile.getdocuments();
    //res.render('learn/document_manage', {title: "Learn Content Choice", array: result,username: req.user.username});
});

router.get('/renamescenario', isLoggedIn,
function(req, res) {
    console.log('renamescenario');
    console.log(req.query.oldname, req.query.newname);
    console.log(req);
    var oldname = req.query.oldname.substring(1);
    var newname = req.query.newname;

    var getfile = new Getfile();
    getfile.renamescenario(oldname, newname);
    console.log('renameend');
    //var result = getfile.getdocuments();
    //res.render('learn/document_manage', {title: "Learn Content Choice", array: result,username: req.user.username});
});

router.get('/renamevideo', isLoggedIn,
function(req, res) {
    console.log('renamevideo');
    console.log(req.query.oldname, req.query.newname);
    console.log(req);
    var oldname = req.query.oldname.substring(1);
    var newname = req.query.newname;

    var getfile = new Getfile();
    getfile.renamevideo(oldname, newname);
    console.log('renameend');
    //var result = getfile.getdocuments();
    //res.render('learn/document_manage', {title: "Learn Content Choice", array: result,username: req.user.username});
});

router.get('/delete_document', isLoggedIn,
function(req, res) {
    console.log(req.query.filepath);

    var filepath = req.query.filepath.substring(1);

    var getfile = new Getfile();
    getfile.delete_document(filepath);
    console.log('filepathfilepath');

    //var result = getfile.getdocuments();
    //res.render('learn/document_manage', {title: "Learn Content Choice", array: result,username: req.user.username});
});

router.get('/delete_video', isLoggedIn,
function(req, res) {
    console.log(req.query.filepath);

    var filepath = req.query.filepath.substring(1);

    var getfile = new Getfile();
    getfile.delete_video(filepath);
    console.log('filepathfilepath');

    //var result = getfile.getdocuments();
    //res.render('learn/document_manage', {title: "Learn Content Choice", array: result,username: req.user.username});
});

router.get('/delete_scenario', isLoggedIn,
function(req, res) {
    console.log(req.query.filepath);

    var filepath = req.query.filepath.substring(1);

    var getfile = new Getfile();
    getfile.delete_scenario(filepath);
    console.log('filepathfilepath');

    //var result = getfile.getdocuments();
    //res.render('learn/document_manage', {title: "Learn Content Choice", array: result,username: req.user.username});
});

router.get('/delete_document_batch', isLoggedIn,
function(req, res) {
    console.log('delete_document_batch');
    console.log(req.query.filepath);
    var getfile = new Getfile();
    getfile.delete_document(filepath);
    console.log('filepathfilepath');

    //var result = getfile.getdocuments();
    //res.render('learn/document_manage', {title: "Learn Content Choice", array: result,username: req.user.username});
});

router.get('/data_upload', isLoggedIn,
function(req, res) {
    var back_link = '';
    if (req.user.usertype == 'admin') back_link = '/admin/home';

    else if (req.user.usertype == 'super_admin') back_link = '/super_admin/home';

    res.render('learn/data_upload_home', {
        title: 'Data Upload',
        back_link: back_link
    });

});

router.get('/document_upload', isLoggedIn,
function(req, res) {
    var back_link = '';
    if (req.user.usertype == 'admin') back_link = '/admin/home';

    else if (req.user.usertype == 'super_admin') back_link = '/super_admin/home';

    res.render('learn/document_upload', {
        title: 'Data Upload',
        back_link: back_link
    });

});

router.get('/video_upload', isLoggedIn,
function(req, res) {
    var back_link = '';
    if (req.user.usertype == 'admin') back_link = '/admin/home';

    else if (req.user.usertype == 'super_admin') back_link = '/super_admin/home';

    res.render('learn/video_upload', {
        title: 'Data Upload',
        back_link: back_link
    });

});

router.get('/scenario_upload', isLoggedIn,
function(req, res) {
    var back_link = '';
    if (req.user.usertype == 'admin') back_link = '/admin/home';

    else if (req.user.usertype == 'super_admin') back_link = '/super_admin/home';

    res.render('learn/scenario_upload', {
        title: 'Data Upload',
        back_link: back_link
    });

});



router.post('/document_upload', isLoggedIn,
function(req, res) {
    console.log('document_upload');
    console.log('req.body.exam_code');

    console.log(req.body.exam_code);
    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({
        uploadDir: '../public/files/documents/'
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
                console.log('inputFile');
                console.log(inputFile);
                console.log(inputFile.originalFilename);
                
                if ( (inputFile.originalFilename.indexOf('.pdf')<0) && (inputFile.originalFilename.indexOf('.PDF')<0) )
                {
                            fs.unlink(inputFile.path);
                        var back_link = 'document_upload';
                        
                        if (req.user.usertype == 'admin') 
                            res.render('admin/wrongformat', { back_link: back_link});
                        else if (req.user.usertype == 'super_admin') res.render('super_admin/wrongformat', { back_link: back_link});
                }
                else
                {
                if (inputFile.originalFilename == '') {
                    console.log('file is empty');
                    if (req.user.usertype == 'admin') res.redirect('/admin/home');
                    else if (req.user.usertype == 'super_admin') res.redirect('/super_admin/home');
                } else {

                    var uploadedPath = inputFile.path;
                    var dstPath = '../public/files/documents/' + inputFile.originalFilename;
                    //重命名为真实文件名
                    //fs.unlink(dstPath);//会自动覆盖，不用删除
                    fs.rename(uploadedPath, dstPath,
                    function(err) {
                        if (err) {
                            console.log(err);
                            console.log('rename error: ' + err);
                        } else {
                            console.log('rename ok');
                            if (req.user.usertype == 'admin') res.redirect('/admin/home');
                            else if (req.user.usertype == 'super_admin') res.redirect('/super_admin/home');
                        }
                    });

                }
            }


        }

    });

});


router.post('/scenario_upload', isLoggedIn,
function(req, res) {
    console.log('document_upload');
    console.log('req.body.exam_code');

    console.log(req.body.exam_code);
    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({
        uploadDir: '../public/files/scenarios/'
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
            console.log('inputFile');
            console.log(inputFile);
            console.log(inputFile.originalFilename);
            console.log(inputFile.originalFilename.indexOf('.XML'));
            
            if ( (inputFile.originalFilename.indexOf('.xml')<0) && (inputFile.originalFilename.indexOf('.XML')<0) )
            
            {           
                        fs.unlink(inputFile.path);
                        var back_link = 'scenario_upload';
                        
                        if (req.user.usertype == 'admin') 
                            res.render('admin/wrongformat', { back_link: back_link});
                        else if (req.user.usertype == 'super_admin') res.render('super_admin/wrongformat', { back_link: back_link});
            }
            else
            {
                    if (inputFile.originalFilename == '') {
                        console.log('file is empty');
                        if (req.user.usertype == 'admin') res.redirect('/admin/home');
                        else if (req.user.usertype == 'super_admin') res.redirect('/super_admin/home');
                    } else {

                        var uploadedPath = inputFile.path;
                        var dstPath = '../public/files/scenarios/' + inputFile.originalFilename;
                        //重命名为真实文件名
                        //fs.unlink(dstPath);//会自动覆盖，不用删除
                        fs.rename(uploadedPath, dstPath,
                        function(err) {
                            if (err) {
                                console.log(err);
                                console.log('rename error: ' + err);
                            } else {
                                console.log('rename ok');
                                if (req.user.usertype == 'admin') res.redirect('/admin/home');
                                else if (req.user.usertype == 'super_admin') res.redirect('/super_admin/home');
                            }
                        });

                    }
            }


        }

    });

});

router.post('/video_upload', isLoggedIn,
function(req, res) {
    console.log('document_upload');
    console.log('req.body.exam_code');

    console.log(req.body.exam_code);
    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({
        uploadDir: '../public/files/videos/'
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
            console.log('inputFile');
            console.log(inputFile);
            console.log(inputFile.originalFilename);
            if ( (inputFile.originalFilename.indexOf('.mp4')<0) && (inputFile.originalFilename.indexOf('.MP4')<0) )
            {           
                        fs.unlink(inputFile.path);
                        var back_link = 'video_upload';
                        
                        if (req.user.usertype == 'admin') 
                            res.render('admin/wrongformat', { back_link: back_link});
                        else if (req.user.usertype == 'super_admin') res.render('super_admin/wrongformat', { back_link: back_link});
            }
            else
            {
                    if (inputFile.originalFilename == '') {
                        console.log('file is empty');
                        if (req.user.usertype == 'admin') res.redirect('/admin/home');
                        else if (req.user.usertype == 'super_admin') res.redirect('/super_admin/home');
                    } else {

                        var uploadedPath = inputFile.path;
                        var dstPath = '../public/files/videos/' + inputFile.originalFilename;
                        //重命名为真实文件名
                        //fs.unlink(dstPath);//会自动覆盖，不用删除
                        fs.rename(uploadedPath, dstPath,
                        function(err) {
                            if (err) {
                                console.log(err);
                                console.log('rename error: ' + err);
                            } else {
                                console.log('rename ok');
                                if (req.user.usertype == 'admin') res.redirect('/admin/home');
                                else if (req.user.usertype == 'super_admin') res.redirect('/super_admin/home');
                            }
                        });

                    }
            }


        }

    });

});

//以下为原有

module.exports = router;

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated() && ((req.user.usertype == 'admin') || (req.user.usertype == 'super_admin'))) return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}