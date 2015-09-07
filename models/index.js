var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/baby_app")

module.exports.Baby = require("./baby");
module.exports.Activity = require("./activity");
module.exports.Task = require("./task");