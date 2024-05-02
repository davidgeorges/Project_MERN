import mongoose, { Schema } from 'mongoose';
const ObjectId = require('mongodb').ObjectId

const userSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
  },
  subscribedEvent: {
    type: [ObjectId],
  },
  eventHeld: {
    type: [ObjectId],
  },
  role: {
    type: String,
    enum: ["ADMIN", "MANAGER", "USER"],
    default: "USER"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },

});

export const User = mongoose.model('User', userSchema);