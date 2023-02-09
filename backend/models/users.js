const mongoose = require('mongoose'); 

const userSchema = mongoose.Schema({  
    uname: {type: String},  
    firstName: {type: String} ,  
    lastName: {type: String} ,  
    isTempPw: {type: Boolean},  
    pw: {type: String}
  }); 

module.exports = mongoose.model('Users',userSchema);  