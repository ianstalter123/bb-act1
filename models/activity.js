var mongoose = require("mongoose");
var Baby = require("./baby");
var Task = require("./task");
var Account = require("./account");

var activitySchema = new mongoose.Schema({
                    name: String,
                    completed: String,
                    location: String,
                    image: String,
                    date: String,
                    votes: Number,
                    babies: [{
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "Baby"
                    }],
                     accounts: [{
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "Account"
                    }],
                    tasks: [{
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "Task"
                    }]

                  });

//hook - runs before we delete a zoo and its
//orphan children

activitySchema.pre('remove', function(callback) {
    Baby.remove({activity_id: this._id}).exec();
    callback();
    
});

var Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;