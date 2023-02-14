// Dependencies
var express = require('express');
var router = express.Router();
const Posts = require ( '../backend/models/post');
const Orders = require('../backend/models/orders');
var CryptoJS = require('../node_modules/crypto-js');
const Users = require('../backend/models/users');


// Routes
router.post('/products',(req, res) => {
   //console.log(req.body);
   Posts.find({postName:req.body.postName}, (error, result) => {
      if(error) {
          return res.status(500).send(error);
      }
      res.send(result);
  });
});

router.post('/login',(req, res) => {
    var uname = req.body.uname;
    var savedPw = "";

    var bytes  = CryptoJS.AES.decrypt(req.body.cipher, "MySecretKey");
    var originalPassword = bytes.toString(CryptoJS.enc.Utf8);

    var hash = CryptoJS.HmacSHA256(originalPassword, "decryptThisBitch");
    var hashedString = hash.toString(CryptoJS.enc.Base64);

    var user = {
        email:"",
        firstName:"",
        lastName:""
    }

    Users.find({uname:uname}, (error, result) => {
        if(error) {
            return res.send(error);
        }
        if(result.length == 0){
            return res.send({ success:false,message:"User not found"});
        }
        savedPw = result[0].pw;
        if(hashedString == savedPw){
            user.email = result[0].uname;
            user.firstName = result[0].firstName;
            user.lastName = result[0].lastName; 
            return res.send({success:true,message:"Login Successful",user:user});
        }
        else{
            return res.send({success:false,message:"Incorrect Password"});
        }
    });
 });

 router.post('/signUp',(req, res) => {
    //console.log(req.body);
    Users.find({uname:req.body.uname}, (error, result) => {
       if(error) {
           return res.status(500).send(error);
       }
       if(result.length>0)
       {
        res.send({success:false,message:"User already exists"});
       }
       else{
        //insert into Users table
        var bytes  = CryptoJS.AES.decrypt(req.body.cipher, "MySecretKey");
        var originalPassword = bytes.toString(CryptoJS.enc.Utf8);

        var hash = CryptoJS.HmacSHA256(originalPassword, "decryptThisBitch");
        var hashedString = hash.toString(CryptoJS.enc.Base64);
        Users.insertMany({uname:req.body.uname,firstName:"Temp",lastName:"User",pw:hashedString,isTempPw:true}, (error, result) => {
            res.send({success:true,message:"User create successfully"});
        });
       }
   });
 });

 router.post('/getAllOrders',(req, res) => {
    //console.log(req.body);
    Orders.find({}, (error, result) => {
       if(error) {
           return res.status(500).send(error);
       }
       res.send(result);
   });
 });

 router.post('/mapReduce',(req, res) => {
        var order = {},
        self = this;
        order.map = function () {
            emit(this.cust_id, this.price);
        };
        order.reduce = function (key, val) {
            return Array.sum(val);
        };
    
        Orders.mapReduce(order, function (err, results) {
            if(err){
                return res.status(500).send(err);
            }
            res.send(results)
        });
 });

// Return router
module.exports = router;