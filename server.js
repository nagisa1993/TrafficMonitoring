var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/views/';

//we have defined the Router middle layer, 
//which will be executed before any other routes. 
//This route will be used to print the type of HTTP request the particular Route is referring to.
router.use(function (req,res,next) {
  console.log("/" + req.method);
  //Once the middle layer is defined, you must pass "next()" so that next router will get executed.
  next();
});

router.get("/",function(req,res){
  res.sendFile(path + "index.html");
});

//tell Express to use the Routes we have defined above.
app.use("/",router);

//we can assign the routes in order
//so the last one will get executed when the incoming request is not matching any route. 
//in this case, it is 404.
app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

app.listen(3000,function(){
  console.log("Live at Port 3000");
});