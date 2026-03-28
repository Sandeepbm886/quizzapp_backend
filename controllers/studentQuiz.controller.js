import { Quiz } from "../models/quizz.model.js";
import { Question } from "../models/questions.model.js";
import { Submission } from "../models/submissions.model.js";

import { shuffleArray } from "../utils/shuffle.js";
import { calculateScore } from "../services/scoring.service.js";

import { calculateScore } from "../services/scoring.service.js";
import { updateAnalytics } from "../services/analytics.service.js";

import { io } from "../app/index.js";
import { getLeaderboard } from "../services/leaderboard.service.js";
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

        const quizId = req.params.id;

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

        const quizId = req.params.id;
        const studentId = req.headers.userid;

        const { answers, timeTaken, tabSwitchCount, violations } = req.body;

        const existing = await Submission.findOne({
            quizId,
            studentId
        });

        if (existing) {
            return res.status(400).json({
                message: "You have already attempted this quiz"
            });
        }

        const questions = await Question.find({ quizId });

        const { score, percentage } = calculateScore(questions, answers);

        const submission = await Submission.create({
            quizId,
            studentId,
            answers,
            score,
            percentage,
            timeTaken,
            tabSwitchCount,
            violations
        });

        await updateAnalytics(quizId, score, percentage);

        const leaderboard = await getLeaderboard(quizId);

        io.to(quizId).emit("leaderboardUpdate", leaderboard);

        res.json({
            success: true,
            score,
            percentage,
            submissionId: submission._id
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Submission failed"
        });

    }

};