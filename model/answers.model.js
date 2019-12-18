const mongoose = require("mongoose");

var AnswersSchema = new mongoose.Schema({
    lang: {
        type: String,
        required: "Required"
    },
    des: {
        type: String,
        required: "Required",
    },
    user: {
        type: String
    },
    alias: {
        type: String,
        required: "Required",
    },
    status: {
        type: String
    }
});
module.exports = mongoose.model("Answers", AnswersSchema)
