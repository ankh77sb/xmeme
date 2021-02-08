
      const express = require("express");
      const bodyParser = require("body-parser");
      const _ = require("lodash");
      const ejs = require("ejs");
      const mongoose = require("mongoose");
      const cors = require("cors");

      require('dotenv').config();

      const app = express();
      app.set('view engine','ejs');
      app.use(express.static("public"));
      app.use(bodyParser.text());
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({extended:true}));
      var jsonParser = bodyParser.json();
      app.use(cors());


      // connecting to database
      mongoose.connect(process.env.DATABASE,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      },{ useFindAndModify: false }).then(() => {
         console.log("!!--------DB CONNECTED!--------!!");
      });

      // schemas
      const memeSchema = new mongoose.Schema({
        name : {
          type: String,
          required: true
        },
        url :  {
          type: String,
          required: true
        },
        caption : {
          type: String,
          required: true
        },
      },
      { timestamps: true }
      );


      // model
      const Meme = mongoose.model("Meme",memeSchema);

      //routes
      app.route("/memes")
      .get( (req,res) => {
          Meme.find().sort({ createdAt: -1 }).limit(100).exec(function(err, memes) {

            if(err){
               res.status(400).json({
               error:
               "Bad request: Error occured while getting from DB" + err.reason,
                });
            } else{
              let returnMemes = [];
              memes.forEach((meme, i) => {
                    returnMemes.push({"id":meme._id, "name":meme.name, "url":meme.url, "caption":meme.caption});
              });

              res.json(returnMemes);
            }
          });
      })
      .post( (req,res) =>{
        console.log(req.body);
        let fields = req.body;

           if (typeof fields === 'string' || fields instanceof String)
                fields = JSON.parse(req.body);

          const name = fields.name;
          const imageUrl = fields.url;
          const caption = fields.caption;

          const meme = new Meme({
            name: name,
            url: imageUrl,
            caption: caption
          });

          meme.save(function(err,latest){
            if(!err){
              console.log("saved");
              res.json({"id":latest._id});
            }else {
               res.status(400).json({
               error:
               "Bad request: Error occured while posting into DB " + err.reason,
                });
            }
          });

      });

      app.route("/memes/:memeId")
      .get( (req,res) =>{

        const id = req.params.memeId;

        Meme.findById(id).exec(function(err, meme) {
         if(err){
            res.status(400).json({
            error:
            "Bad request: Error occured while getting from DB" + err.reason,
             });
          } else if(meme == null){
               res.status(404).json({
            error: "Not found: No meme with this id:" + id,
           });
         } else{
            console.log(meme);
            res.json({"id":meme._id,"name":meme.name, "url":meme.url, "caption": meme.caption});
          }
        });

      })
      .patch( (req,res) =>{

        console.log(req.body);
        const id = req.params.memeId;

        let fields = req.body;

           if (typeof fields === 'string' || fields instanceof String)
                fields = JSON.parse(req.body);

         const imageUrl = fields.url;
         const caption = fields.caption;

         Meme.findByIdAndUpdate(id, {url:imageUrl,caption:caption}, {returnOriginal:false} , function(err, meme) {
          if(err){
             res.status(400).json({
             error:
             "Bad request: Error occured while getting from DB" + err.reason,
              });
           } else if(meme == null){
                res.status(404).json({
             error: "Not found: No meme with this id:" + id,
            });
          } else{
             res.status(200);
            }
          });
      });

      app.listen(process.env.PORT || 8081,function(){

        console.log(`server established on port ${process.env.PORT}`);
      });
