const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv/config");
const router = express.Router();

const auth = require("../auth");

const Questions = mongoose.model("Questions");
const Answers = mongoose.model("Answers");
const Sync = mongoose.model("Sync");

router.get("/", auth, async (req, res) => {
    try{
        // res.json(req.user);
        let sync = await Sync.findOne().sort({ _id: -1 });
        res.json(sync);
    }catch(err){
        res.status(400).json({message: err});
    }
});
router.post("/", (req, res) => {
    let arrQuestions = [];
    req.body.questions.forEach(data => {
        let questions = new Questions();
        questions.lang = data.lang;
        questions.des = data.des;
        questions.alias = data.alias;
        arrQuestions.push(questions);
    });
    Questions.collection.insertMany(arrQuestions, function(err, docs){
        if(!err){
            let arrAnswers = [];
            req.body.answers.forEach(data =>{
                let answers = new Answers();
                answers.lang = data.lang;
                answers.des = data.des;
                answers.user = data.user;
                answers.alias = data.alias;
                arrAnswers.push(answers);
            });

             Answers.collection.insertMany(arrAnswers, function(err, docs){
                if(!err){
                    let sync = new Sync();
                    sync.datetime = Date.now();
                    sync.save().then(data => {
                        res.json(data);
                    });
                }else{
                    res.status(400).json({message: err})
                }
            })
        }else{
            res.status(400).json({message: err})
        }
    })
});
router.post("/auth/", async (req, res) =>{
    if(req.body.authuser === process.env.AUTH_USER && req.body.password === process.env.AUTH_PWD){
        let token = jwt.sign({_id: req.body.authuser}, process.env.TOKEN_SECRET);
        res.header('auth-token', token).json({token: token});
    }else{
        res.status(400).json({message: "Invalid Authentication"});
    }
});
module.exports = router;