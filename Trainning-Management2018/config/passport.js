var LocalStrategy = require('passport-local').Strategy;
var SuperAdminUser = require('../models/super_admin.js');
var AdminUser = require('../models/admin.js');
var StudentUser = require('../models/student.js');
var FacultyUser = require('../models/faculty.js');
var StringOperation = require('../tools/string_operation.js');

module.exports = function(passport) {
    
    passport.serializeUser(function (user, done) {
        done(null, JSON.stringify(user));
    });

    passport.deserializeUser(function (user, done) {
        done(null, JSON.parse(user));
    });

    passport.use('local-login-super_admin', new LocalStrategy({
        passReqToCallback : true
    },
    function(req, username, password, done) {


        SuperAdminUser.findByUserName(username, function(err, user) {
            if (err)
                return done(err);
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.'));        
            if (user.password!=password)
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            user.usertype='super_admin';
            console.log('super admin login end');
            console.log(user);
            return done(null, user);
        });

    }));

    passport.use('local-login-admin', new LocalStrategy({
        passReqToCallback : true
    },
    function(req, username, password, done) {
        console.log('admin login');
        AdminUser.findByUserName(username, function(err, user) {
            console.log(user);
            console.log(err);
            if (err)
                return done(err);
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.'));        
            if (user.password!=password)
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            user.usertype='admin';
            console.log('admin login end');
            console.log(user);
            return done(null, user);
        });

    }));
    
    passport.use('local-login-student', new LocalStrategy({
        passReqToCallback : true
    },
    function(req, username, password, done) {
        var string_operation = new StringOperation();
        if (string_operation.is_card_id(username) == true)
        {
            StudentUser.findByUserCardID(username, function(err, user) {
                if (err)
                    return done(err);
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));        
                if (user.password!=password)
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                user.usertype='student';
                return done(null, user);

            });
        }
        else if (string_operation.is_mobile_number(username) == true)
        {
            StudentUser.findByMobileNumber(username, function(err, user) {
                if (err)
                    return done(err);
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));        
                if (user.password!=password)
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                user.usertype='student';
                return done(null, user);

            });
        }
        else
        {
            StudentUser.findByUserName(username, function(err, user) {
                if (err)
                    return done(err);
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));        
                if (user.password!=password)
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            user.usertype='student';
            return done(null, user);

            });
        }



    }));
    
    passport.use('local-login-faculty', new LocalStrategy({
        passReqToCallback : true
    },
    function(req, username, password, done) {
        var string_operation = new StringOperation();
        if (string_operation.is_card_id(username) == true)
        {
            FacultyUser.findByUserCardID(username, function(err, user) {
                if (err)
                    return done(err);
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));        
                if (user.password!=password)
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                user.usertype='faculty';
                return done(null, user);
            });
        }
        else if (string_operation.is_mobile_number(username) == true)
        {
            FacultyUser.findByMobileNumber(username, function(err, user) {
                if (err)
                    return done(err);
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));        
                if (user.password!=password)
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                user.usertype='faculty';
                return done(null, user);
            });
        }
        else
        {
            FacultyUser.findByUserName(username, function(err, user) {
                if (err)
                    return done(err);
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));        
                if (user.password!=password)
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                user.usertype='faculty';
                return done(null, user);
            });
        }


    }));

};
