const mongoose = require("mongoose");

var SyncSchema = new mongoose.Schema({
    datetime: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model("Sync", SyncSchema)