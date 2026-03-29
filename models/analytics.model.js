import mongoose from "mongoose";

const QuestionAccuracySchema = new mongoose.Schema(
    {
        attempts: {
            type: Number,
            default: 0
        },
        correct: {
            type: Number,
            default: 0
        }
    },
    { _id: false }
);

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
        of: QuestionAccuracySchema
    }
});

export const Analytics = mongoose.model("Analytics", AnalyticsSchema);
