
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

      mongoose.connect(process.env.DATABASE,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      }).then(() => {
         console.log("!!--------DB CONNECTED!--------!!");
      });

      const memeSchema = new mongoose.Schema({
        name : {
          type: String,
          required: true
        },
        caption : {
          type: String,
          required: true
        },
        url :  {
          type: String,
          required: true
        }
      },
      { timestamps: true }
      );

      const Meme = mongoose.model("Meme",memeSchema);


      app.route("/memes")
      .get( (req,res) => {
          Meme.find().sort({ createdAt: -1 }).limit(100).exec(function(err, memes) {


            if(err){
               res.status(400).json({
               error:
               "Bad request: Error occured while getting from DB" + err.reason,
                });
            } else{
              res.json(memes);
            }
          });
      })
      .post( (req,res) =>{
        console.log(req.body);
          let fields = JSON.parse(req.body);
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
              res.json({_id:latest._id});
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
            res.send(meme);
          }
        });

      });

      app.listen(process.env.PORT,function(){

        console.log(`server established on port ${process.env.PORT}`);
      });
