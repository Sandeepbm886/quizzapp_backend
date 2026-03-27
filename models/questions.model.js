import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
    {
        quizId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz",
            required: true,
            index: true
        },

        questionText: {
            type: String,
            required: true
        },

        options: {
            type: [String],
            required: true
        },

        correctAnswer: {
            type: String,
            required: true
        },

        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            default: "medium"
        },

        points: {
            type: Number,
            default: 1
        }
    },
    { timestamps: true }
);

export const Question = mongoose.model("Question", QuestionSchema);