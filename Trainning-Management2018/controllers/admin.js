var express = require('express')
  , router = express.Router()
  , Admin = require('../models/admin');

var default_username = "User Name";

var default_admin = {
    username: "username",
    password: "Password",
    rollno: "Job Number"
  };

router.get('/home', isLoggedIn, function(req, res) {
      console.log('admin home');
	res.render('admin/home', { title: 'Options'});
});

router.get('/wrongformat', isLoggedIn, function(req, res) {
      console.log('admin wrongformat');
  res.render('admin/wrongformat', { title: 'Options'});
});

router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
});

router.get('/new', isLoggedInAsSuper, function(req, res) {
    res.render('admin/new', { title: 'Add New Admin', admin: default_admin});
});

router.post('/create', isLoggedInAsSuper, function(req, res) {

  var admin = {
  username: req.body.username,
  password: req.body.password,
  rollno: req.body.rollno
  };
  var username = req.body.username;
  console.log(typeof username);
  Admin.getByUserName(username, function(err,doc) {
  if(err)
    res.send("Some error occured");
  else if(doc)
    res.redirect('/admin/new');
    else{

    Admin.create(admin, function(err, doc) {
      if(err)
        res.send("Some error occured");
      else
        res.redirect('/super_admin/home');
    })  }
  })
});

router.get('/get_username_edit', isLoggedInAsSuper, function(req, res) {
  res.render('admin/get_username_edit', { title: "Get Username", username: default_username});
});


router.get('/edit', isLoggedInAsSuper, function(req,res) {
  //Failure renders edit if update is incorrect
  var username = req.query.username;
    Admin.getByUserName(username, function(err,doc) {
    if(err)
      res.send("Some error occured");
    else
    {
      console.log(doc);
      console.log('doc');
      if(doc)
      res.render('admin/edit', {title: 'Edit Admin', admin: doc});
      else
      res.redirect('/admin/get_username_edit');
    }
  });
});

router.post('/update', isLoggedInAsSuper, function(req, res) {
  // TO DO: Ensure that the adminand course exists
  // TO DO: Add failure cases
  var admin = {
  username: req.body.username,
  password: req.body.password,
  rollno: req.body.rollno
  };
  var prevusername = req.body.prevusername;

  Admin.update(prevusername, admin, function(err, doc) {
      if(err)
        res.render('admin/edit', { title: 'Edit Admin', admin: admin});
      else
        res.redirect('../super_admin/home');
    });
});

router.get('/get_username_delete', isLoggedInAsSuper, function(req, res) {
  var default_username = "User Name";
  res.render('admin/get_username_delete', { title: "Get Username", username: default_username});
});

router.post('/delete', isLoggedInAsSuper, function(req, res) {
  // TO DO: Ensure that the admin and course exists
  // TO DO: Add failure cases
  var username = req.body.username;

  Admin.getByUserName(username, function(err,doc) {
  if(err)
    res.send("Some error occured");
  else if(doc)
  {
  Admin.remove(username, function(err, doc) {
    if(err)
      res.send("Some error occured");
    else
      res.redirect('../super_admin/home');
  })}
  else
    res.redirect('../admin/get_username_delete');  
  })
});
module.exports = router;

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    console.log('admin check');
    console.log(req.user.usertype);
    if (req.isAuthenticated()&&((req.user.usertype=='admin')||(req.user.usertype=='super_admin')))
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

function isLoggedInAsSuper(req, res, next) {

    // if user is authenticated in the session, carry on 
    console.log(req.isAuthenticated());
    console.log(req.user.usertype);
    if (req.isAuthenticated()&&req.user.usertype=='super_admin')
        {return next();}

    // if they aren't redirect them to the home page
    res.redirect('/');
}