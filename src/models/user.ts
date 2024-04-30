import mongoose from "mongoose";
import Joi from "joi";

const userSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  age: Number,
});

export const User = mongoose.model("User", userSchema);

export const userJoiSchema = Joi.object({
  nom: Joi.string().required(),
  prenom: Joi.string().required(),
  age: Joi.number().integer().min(0),
});
