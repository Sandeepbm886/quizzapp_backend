import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema(
    {
        quizId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz",
            index: true
        },

        studentId: {
            type: String,
            required: true,
            index: true
        },

        answers: {
            type: Map,
            of: String
        },

        score: Number,

        percentage: Number,

        timeTaken: Number,

        tabSwitchCount: {
            type: Number,
            default: 0
        },

        violations: {
            type: [String],
            default: []
        },

        submittedAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

SubmissionSchema.index({ quizId: 1, studentId: 1 });

module.exports = mongoose.model("Submission", SubmissionSchema);