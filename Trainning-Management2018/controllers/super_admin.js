var express = require('express')
  , router = express.Router()
  , SuperAdmin = require('../models/super_admin');

router.get('/home', isLoggedInAsSuper, function(req, res) {
    console.log('super admin home');
	res.render('super_admin/home', { title: 'Options'});
});

router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
});

router.get('/wrongformat', isLoggedInAsSuper, function(req, res) {
      console.log('admin wrongformat');
  res.render('super_admin/wrongformat', { title: 'Options'});
});


module.exports = router;

function isLoggedInAsSuper(req, res, next) {

    // if user is authenticated in the session, carry on 
    console.log(req.isAuthenticated());
    console.log(req.user.usertype);
    if (req.isAuthenticated()&&req.user.usertype=='super_admin')
        {return next();}

    // if they aren't redirect them to the home page
    res.redirect('/');
}