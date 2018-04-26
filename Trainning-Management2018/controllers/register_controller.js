var express = require('express')
  , router = express.Router()
  , Register = require('../models/register');

router.get('/', function(req, res) {
  res.render('register', {title: "register"});
});

router.post('/', function(req, res) {

  var usertype = req.body.usertype;
  var username = req.body.username;
  var password = req.body.password;
  var passwordagain = req.body.passwordagain;

  Register.getUsersByName(username, function(err, doc) {
    if(err)
      res.send("Some error occured");
    else if(doc)
      res.send("用户名已存在！");
    else if(password == "")
      res.send("密码不能为空！");
    else if(passwordagain != password)
      res.send("两次输入的密码不同！");
    else {
      Register.create_user(usertype, username, password);
      if(usertype == "student")
        Register.create_student(username, password);
      else if(usertype == "faculty")
        Register.create_faculty(username, password);
      res.send("注册成功！ ");
    }
  });
});

module.exports = router;