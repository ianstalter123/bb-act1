var mongoose = require("mongoose");
mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost/baby_app")

module.exports.Baby = require("./baby");
module.exports.Activity = require("./activity");
module.exports.Task = require("./task");