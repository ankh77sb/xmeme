
      const express = require("express");
      const bodyParser = require("body-parser");
      const mongoose = require("mongoose");
      const cors = require("cors");

      const swaggerUi = require("swagger-ui-express");
      const swaggerDocument = require("./swagger.json");
      const swaggerPort = 8080;

      require('dotenv').config();

      const app = express();
      const swaggerApp = express();

      app.set('view engine','ejs');
      app.use(express.static("public"));
      app.use(bodyParser.text());
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({extended:true}));
      var jsonParser = bodyParser.json();

      app.use(cors());
      swaggerApp.use(cors());


      // connecting to database
      mongoose.connect("mongodb://localhost:27017/memeDB",{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      },{ useFindAndModify: false }).then(() => {
         console.log("!!--------DB CONNECTED!--------!!");
      });



      // schemas for the database
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
      app.route("/")
      .get( (req,res) => {
        res.redirect("/memes");
      });
      app.route("/memes") // gets 100 memes
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
      .post( (req,res) =>{ // adds new meme
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
      // gets a particular meme of given id
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

      }) // to edit meme
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

      swaggerApp.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

      app.listen(process.env.PORT || 8081,function(){
        let port = process.env.PORT || 8081;
        console.log(`server established on port ${port}`);
      });

      swaggerApp.listen(swaggerPort, () => {
        console.log('Swagger up and running on '+swaggerPort);
      })
