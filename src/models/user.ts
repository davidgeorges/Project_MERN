import mongoose, { Schema } from 'mongoose';

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
  role: {
      type: String,
      enum: ["ADMIN","MANAGER","USER"],
      default: "USER"
  },
  createdAt: {
      type: Date,
      default: Date.now
  },

});

const User = mongoose.model('User', userSchema);

module.exports = { User }