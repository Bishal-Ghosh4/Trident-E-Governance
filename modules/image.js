var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/egov',{useNewUrlParser:true,useCreateIndex:true});
var conn=mongoose.connection;
var uploadSchema=new mongoose.Schema({
 imagename:  String,
 name:String,
 
});
var imageModel=mongoose.model('images',uploadSchema);
module.exports=imageModel;