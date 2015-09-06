var mongoose = require("mongoose");

var babySchema = new mongoose.Schema({
                   name: {type: String, required: true},
                   age: Number,
                   image: String,
                    activity: {
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "Activity"
                    }
                  });

var Baby = mongoose.model("Baby", babySchema);

module.exports = Baby;