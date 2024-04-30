import mongoose, { Schema } from 'mongoose';

const eventSchema = new Schema({
    title: {
      type: String,
  },
  description: {
      type: String,
  },
  date: {
      type: Date,
  },
  city: {
      type: String,
  },
  createdAt: {
      type: Date,
      default: Date.now
  },

});

const Event = mongoose.model('Event', eventSchema);

module.exports = { Event }
