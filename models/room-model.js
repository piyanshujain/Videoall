var mongoose = require("mongoose");
var roomSchema = new mongoose.Schema({
    title: String,
   // id : String,
    chats: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Chat"
      }
   ],
    created:  {type: Date, default: Date.now}
});

module.exports = mongoose.model("Room", roomSchema);
