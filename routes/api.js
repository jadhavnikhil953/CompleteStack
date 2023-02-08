// Dependencies
var express = require('express');
var router = express.Router();
const Posts = require ( '../backend/models/post');
const Orders = require('../backend/models/orders');
var CryptoJS = require('../node_modules/crypto-js');


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
    var bytes  = CryptoJS.AES.decrypt(req.body.cipher, "MySecretKey");
    var originalPassword = bytes.toString(CryptoJS.enc.Utf8);
    console.log(originalPassword)

    var hash = CryptoJS.HmacSHA256(originalPassword, "decryptThisBitch");
    //var hash = CryptoJS.SHA256(password);
    var hashedString = hash.toString(CryptoJS.enc.Base64);
    //console.log(hash)
    res.send({hashedString:hashedString});
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