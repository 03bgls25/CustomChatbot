const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const server = require('http').createServer(app);
const io = require('socket.io')(server); 
const bodyparser = require("body-parser");
require("dotenv/config");

const { NlpManager } = require('node-nlp');
const manager = new NlpManager({ languages: ['en'], nlu: { useNoneFeature: false, log: true }});

app.use(bodyparser.json());

require("./model");
const Questions = mongoose.model("Questions");
const Answers = mongoose.model("Answers");

async function chatbot(msg){
    let listQuestions = await Questions.find().exec().then(function(questions){
        return questions;
    }).catch(function (err){
        return err;
    });
    listQuestions.forEach(data => {
        manager.addDocument(data.lang, data.des, data.alias);
    });

    let listAnswers = await Answers.find().exec().then(function(answers){
        return answers;
    }).catch(function (err){
        return err;
    });
    listAnswers.forEach(data => {
        manager.addAnswer(data.lang, data.alias, data.des);
    });
    await manager.train();
    manager.save();
    var response = await manager.process('en', msg);
    console.log(response.answer);
    return response.answer;
}

io.on("connection", function(socket) {
    console.log("user connected");
    socket.on("disconnect", function(){
        console.log("user disconnected");
    });
    socket.on("chatbot_message", function(msg){
        console.log('message: ' + msg);
        io.emit('chatbot_message', msg);
        chatbot(msg).then(result => {
            if(result == null){
              io.emit('chatbot_message', "Sorry Contact to Support team...");
            }
            else{
              io.emit('chatbot_message', result);
            }
        });
    })
});

app.get("/", async (req, res) =>{
    res.sendFile(path.join(__dirname, "/public/index.html"));
});
require("./controllers")(app);

var port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server started at: ${port}`);
});