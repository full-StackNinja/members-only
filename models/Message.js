const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const { Schema } = mongoose;
const MessageSchema = new Schema({
  title: { type: String, required: true, length: { max: 100 } },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  detail: {
    type: String,
    required: true,
    length: {
      max: 1000,
    },
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

MessageSchema.virtual("date_formatted").get(() => {
  // Display time in local time zone of the user as per ISO 8601 format.
  return DateTime.local().setZone(timeZone).toLocal().toISO();
});

module.exports = mongoose.model("Message", MessageSchema);
