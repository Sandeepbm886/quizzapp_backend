import { Quiz } from "../models/quizz.model.js";
import { Question } from "../models/questions.model.js";
import { shuffleArray } from "../utils/shuffle.js";
import { calculateScore } from "../services/scoring.service.js";
import {
    quizIdParamsSchema,
    submitQuizBodySchema
} from "../validation/quiz.schema.js";
import { userHeaderSchema } from "../validation/common.schema.js";
import { parseRequest, sendValidationError } from "../validation/validate.js";
import {
    createSubmission,
    ensureQuizNotPreviouslyAttempted
} from "./submission.controller.js";

const validatePayload = (schema, payload, res) => {
    const result = parseRequest(schema, payload);

    if (!result.success) {
        sendValidationError(res, result.error);
        return null;
    }

    return result.data;
};
export const getAvailableQuizzes = async (req, res) => {

    try {

        const quizzes = await Quiz.find({
            isPublished: true
        })
            .select("title description timeLimit totalQuestions createdAt");

        res.json({
            success: true,
            quizzes
        });

    } catch (err) {

        res.status(500).json({
            message: "Failed to fetch quizzes"
        });

    }

};
export const startQuiz = async (req, res) => {

    try {

        const params = validatePayload(quizIdParamsSchema, req.params, res);

        if (!params) {
            return;
        }

        const quizId = params.id;

        const quiz = await Quiz.findById(quizId);

        if (!quiz || !quiz.isPublished) {
            return res.status(404).json({
                message: "Quiz not available"
            });
        }

        const questions = await Question.find({ quizId });

        const shuffled = shuffleArray(questions);

        const selectedQuestions = shuffled.slice(0, quiz.questionsToShow);

        const safeQuestions = selectedQuestions.map(q => ({
            _id: q._id,
            questionText: q.questionText,
            options: q.options
        }));

        res.json({
            success: true,
            quiz: {
                title: quiz.title,
                timeLimit: quiz.timeLimit
            },
            questions: safeQuestions
        });

    } catch (err) {

        res.status(500).json({
            message: "Failed to start quiz"
        });

    }

};
export const submitQuiz = async (req, res) => {

    try {

        const params = validatePayload(quizIdParamsSchema, req.params, res);
        const headers = validatePayload(userHeaderSchema, req.headers, res);
        const body = validatePayload(submitQuizBodySchema, req.body, res);

        if (!params || !headers || !body) {
            return;
        }

        const quizId = params.id;
        const { userid: studentId } = headers;
        const { answers, timeTaken, tabSwitchCount, violations } = body;

        const quiz = await Quiz.findById(quizId);

        if (!quiz || !quiz.isPublished) {
            return res.status(404).json({
                message: "Quiz not available"
            });
        }

        const existing = await ensureQuizNotPreviouslyAttempted(quizId, studentId);

        if (existing) {
            return res.status(400).json({
                message: "You have already attempted this quiz"
            });
        }

        const questions = await Question.find({ quizId });

        const { score, percentage } = calculateScore(questions, answers);

        const submission = await createSubmission({
            quizId,
            studentId,
            answers,
            questions,
            score,
            percentage,
            timeTaken,
            tabSwitchCount,
            violations
        });

        res.json({
            success: true,
            score,
            percentage,
            submissionId: submission._id
        });

    } catch (err) {

        if (err?.statusCode) {
            return res.status(err.statusCode).json({
                message: err.message
            });
        }

        console.error(err);

        res.status(500).json({
            message: "Submission failed"
        });

    }

};
