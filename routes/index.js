var express = require('express');
var bycrypt = require('bcrypt');
var router = express.Router();
var path = require('path');
var multer  = require('multer')
var jwt = require('jsonwebtoken');
var userModule = require('../modules/user');
var imageModule=require("../modules/image");
const bodyParser = require("body-parser");
const { render } = require('ejs');

router.use(express.static(__dirname+"./public/"));


var Storage=multer.diskStorage({
  destination:"./public/uploads/",
  filename:(req,file,cb)=>{
cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }
});

var upload=multer({
  storage:Storage,
}).single('file');



if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

function checkname(req, res, next) {
  var username = req.body.username;
  var checkexistname = userModule.findOne({ username: username });
  checkexistname.exec((err, data) => {
    if (err) throw err;
    if (data) {
      return res.render('index', { title: 'Signup', msg: ' alerady exist name' });
    }
    next();
  });

}
function checkemail(req, res, next) {
  var email = req.body.email;
  var checkexistemail = userModule.findOne({ email: email });
  checkexistemail.exec((err, data) => {
    if (err) throw err;
    if (data) {
      return res.render('index', { title: 'Signup', msg: ' alerady exist email' });
    }
    next();
  });

}
/* GET home page. */
router.get('/sign', function (req, res, next) {
  var getuser = localStorage.getItem('loginuser');
  console.log(getuser);
  if (getuser) {
    res.redirect('/account');
  }
  else {
    res.render('index', { title: 'Express', msg: '' });
  }

});
router.post('/sign', checkemail, checkname, function (req, res, next) {
  var fname = req.body.fname;
  var lname = req.body.lname;
  var email = req.body.email;
    console.log(email);
  var username = req.body.username;
  var ten = req.body.ten;
  var twelve = req.body.twelve;
  var branch = req.body.branch;
  var no = req.body.no;

  var password = req.body.password;

  var userDetails = new userModule({
    firstname: fname,
    lastname: lname,
    email: email,
    username: username,
    password: password,
    ten: ten,
    twelve: twelve,
    branch: branch,
    no: no,



  });
  userDetails.save((err, doc) => {
    if (err) throw err;
    res.render('index', { title: 'Signup', msg: 'registed' });
  })

});
router.get('/login', function (req, res, next) {
  var getuser = localStorage.getItem('loginuser');
  console.log(getuser);
  if (getuser) {
    res.redirect('/account');
  }
  else {
    res.render('login', { title: 'Express' });
  }

});
router.post('/login', function (req, res, next) {
  var user = req.body.username;
  var pass = req.body.password;
  var checkuser = userModule.findOne({ username: user });
  checkuser.exec((err, doc) => {
    if (err) throw err;
    var id = doc._id;
    console.log(id);
    if (doc.password == pass) {
      var token = jwt.sign({ userid: id }, 'logintoken');
      localStorage.setItem('usertoken', token);
      localStorage.setItem('loginuser', user);
      res.redirect('/account');
    }
    else {
      res.render('login', { title: 'Express', msg: 'incorrect password' });
    }

  })

});
router.get('/account', function (req, res, next) {
  var getuser = localStorage.getItem('loginuser');
  var image=imageModule.findOne({name:getuser});
  image.exec((err,doc)=>{
    if(err) throw err;
    if(doc)
    {
      console.log(doc);
      
  res.render('account', { title: 'Express', user: getuser,img:doc  });
     
    }
    else
    {
      res.render('account', { title: 'Express', user: getuser,img:' ' });
    }
  
  })
;
});
router.get('/details', function (req, res, next) {
  var getuser = localStorage.getItem('loginuser');
  var user = userModule.findOne({ username: getuser });
  user.exec((err, doc) => {
    if (err) throw err;
    console.log(doc);
    res.render('details', {
      title: 'Express', user: getuser,
      fname: doc.firstname,
      lname: doc.lastname,
      no: doc.no,
      email: doc.email
    });
  });

});

router.get('/changeno', function (req, res, next) {
  var getuser = localStorage.getItem('loginuser');
  var change = userModule.findOne({ username: getuser });
  change.exec((err, doc) => {
    if (err) throw err;
    var no = doc.no;
    console.log(no);
    res.render('changeno', { title: 'Express', user: getuser, nos: no });
  })

});

router.post('/changeno', function (req, res, next) {
  var getuser = localStorage.getItem('loginuser');
  var num = req.body.no;
  console.log(num);
  var change = userModule.findOne({ username: getuser });
  change.exec((err, doc)=> {
    if (err) throw err;
    var ids = doc._id;
    console.log(ids);
    var changeno = userModule.findByIdAndUpdate(ids, { no: num });
    changeno.exec((err, da) => {
      if (err) throw err;
      res.redirect('/details');
    });
  });

});


router.get('/changepass', function (req, res, next) {
  var getuser = localStorage.getItem('loginuser');
  var change = userModule.findOne({ username: getuser });
  change.exec((err, doc) => {
    if (err) throw err;
    var no = doc.password;
    console.log(no);
    res.render('changepass', { title: 'Express', user: getuser, nos: no });
  })
});
router.post('/changepass', function (req, res, next) {
  var getuser = localStorage.getItem('loginuser');
  var pass = req.body.password;
  var change = userModule.findOne({ username: getuser });
  change.exec((err, doc)=> {
    if (err) throw err;
    var ids = doc._id;
    console.log(ids);
    var changeno = userModule.findByIdAndUpdate(ids, { password: pass });
    changeno.exec((err, da) => {
      if (err) throw err;
      res.redirect('/details');
    });
  });
});


router.get('/upload',upload, function (req, res, next) {
  var getuser = localStorage.getItem('loginuser');
var data=imageModule.findOne({name:getuser});
data.exec((err,doc)=>{
  if(doc)
  {
    res.redirect('/edit');
  }
  else{

    res.render('upload', { title: 'Express',sucess:''});
  }
})

  

});
router.post('/upload',upload, function (req, res, next) {
 
  var imagefile = req.file.filename;
  var name=req.body.username;
  console.log(imagefile);
  var sucess = req.file.filename + "uplaodedd";
  var imagedetails = new imageModule({
    imagename: imagefile,
    name:name,
  });
  imagedetails.save((err, doc) => {
    if (err) throw err;
   
     res.redirect('/account');

  });

});
router.get('/sem',function(req,res,next){
  var getuser = localStorage.getItem('loginuser');
  var user=userModule.findOne({username:getuser});
  user.exec((err,doc)=>{
    if(err) throw err;
    res.render('semester',{ten:doc.ten,marks:doc.twelve,   fname: doc.firstname,
      lname: doc.lastname,});
  }) 

});

router.get('/edit',upload,function(req,res,next){
res.render('edit');
});
router.post('/edit',upload,function(req,res,next){
  var img=req.file.filename;
  var getuser = localStorage.getItem('loginuser');
  var update=imageModule.findOne({name:getuser});
  update.exec((err,doc)=>{
    if(err) throw err;
    var ids=doc._id;
    console.log(doc);
    var changeimg=imageModule.findByIdAndUpdate(ids,{imagename:img});
    changeimg.exec((err,da)=>{
      if(err ) throw err;
      res.redirect('/account');
    })

  })

  });

  router.get('/carrer',function(req,res,next){
    var getuser = localStorage.getItem('loginuser');
    var user=userModule.findOne({username:getuser});
    user.exec((err,doc)=>{
      if(err) throw err;
      res.render('carrer',{ten:doc.ten,marks:doc.twelve ,   fname: doc.firstname,
        lname: doc.lastname,});
    }) 

  })
router.get('/logout', function (req, res, next) {
  localStorage.removeItem('loginuser');
  localStorage.removeItem('usertoken');
  res.redirect('/login');
});
router.get('/',function(req,res,next){
  res.render('MainPage');
});

module.exports = router;
