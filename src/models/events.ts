import mongoose, { Schema } from 'mongoose';
const ObjectId = require('mongodb').ObjectId

const eventSchema = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String
    },
    city: {
        type: String
    },
    date: {
        type: Date
    },
    type: {
        type: String,
        enum: ["CONFERENCE", "CONCERT", "PRIVATE MEETING"],
        default: "CONFERENCE"
    },
    link: {
        type: [String],
    },
    owner:{
        type: ObjectId
    },
    subscriber:{
        type: [ObjectId]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

});

export const Event = mongoose.model('Event', eventSchema);