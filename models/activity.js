var mongoose = require("mongoose");
var Baby = require("./baby");

var activitySchema = new mongoose.Schema({
                    name: String,
                    location: String,
                    image: String,
                    date: String,
                    babies: [{
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "Baby"
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