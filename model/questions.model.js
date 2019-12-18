const mongoose = require("mongoose");

var QuestionsSchema = new mongoose.Schema({
    lang: {
        type: String,
        required: "Required"
    },
    des: {
        type: String,
        required: "Required",
    },
    alias: {
        type: String,
        required: "Required",
    },
    status: {
        type: String
    }
});
module.exports = mongoose.model("Questions", QuestionsSchema)
