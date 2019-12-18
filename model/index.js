const mongoose = require("mongoose");
require("dotenv/config");

mongoose.connect(process.env.DB_CONNECTION, { 
    useNewUrlParser: true,  
    useUnifiedTopology: true
}, (error) => {
    if(!error){
        console.log("Successfully connected database.");
    }else{
        console.log("Error while connecting database.")
    }
})

const Questions = require("./questions.model");
const Answers = require("./answers.model");
const Sync = require("./sync.model");