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

export const Event = mongoose.model('Event', eventSchema);