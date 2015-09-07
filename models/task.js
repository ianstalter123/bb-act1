var mongoose = require("mongoose");

var taskSchema = new mongoose.Schema({
                   name: {type: String, required: true},
                   completed: String,
                    activity: {
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "Activity"
                    }
                  });

var Task = mongoose.model("Task", taskSchema);

module.exports = Task;