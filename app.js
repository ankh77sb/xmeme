
      const express = require("express");
      const bodyParser = require("body-parser");
      const _ = require("lodash");


      const app = express();

      var meme = {
        name : String,
        caption : String,
        imgUrl : String
      };

      app.set('view engine','ejs');

      app.use(express.static("public"));

      app.use(bodyParser.urlencoded({extended:true}));

      app.get("/",function(){

        console.log("get done!");
      });

      app.listen(8080,function(){

        console.log("server established on 8080");
      });
