import mongoose from "mongoose";

// Define the feedback schema
const feedbackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", // Refers to the User model
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "event", // Refers to the Event model
        required: true
    },
    review: {
        type: String,
        trim: true,
        required: true
    },
    dateTime: {
        type: Date,
        required: true
    }
}, { timestamps: true }); // Adds createdAt and updatedAt fields

// Create the Feedback model
export const FeedbackModel = mongoose.model("feedback", feedbackSchema);
