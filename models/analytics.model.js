import mongoose from "mongoose";

const AnalyticsSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        unique: true
    },

    attemptCount: {
        type: Number,
        default: 0
    },

    averageScore: {
        type: Number,
        default: 0
    },

    scoreDistribution: {
        type: Map,
        of: Number
    },

    questionAccuracy: {
        type: Map,
        of: Number
    }
});

module.exports = mongoose.model("Analytics", AnalyticsSchema);