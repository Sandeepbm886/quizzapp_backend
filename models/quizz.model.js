import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String
        },

        teacherId: {
            type: String,
            required: true,
            index: true
        },

        timeLimit: {
            type: Number,
            default: 600
        },

        totalQuestions: {
            type: Number,
            default: 0
        },

        questionsToShow: {
            type: Number,
            default: 10
        },

        isPublished: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

export const Quiz = mongoose.model("Quiz", QuizSchema);