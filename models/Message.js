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

MessageSchema.virtual("date_formatted").get(function () {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log("time zone", timeZone);
  // Display time in local time zone of the user as per ISO 8601 format.
  const localTime = DateTime.fromJSDate(this.timestamp, {
    zone: timeZone,
  }).toLocaleString(DateTime.DATETIME_MED);
  return localTime;
});

module.exports = mongoose.model("Message", MessageSchema);
