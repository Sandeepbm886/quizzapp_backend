import mongoose from "mongoose";
import { Quiz } from "../models/quizz.model.js";
import { Question } from "../models/questions.model.js";
import { generateQuizQuestions } from "../services/aiQuiz.service.js";
import {
    addQuestionsBodySchema,
    createQuizBodySchema,
    generateAiQuizBodySchema,
    quizIdParamsSchema
} from "../validation/quiz.schema.js";
import {
    userRoleHeaderSchema
} from "../validation/common.schema.js";
import { parseRequest, sendValidationError } from "../validation/validate.js";

const validatePayload = (schema, payload, res) => {
    const result = parseRequest(schema, payload);

    if (!result.success) {
        sendValidationError(res, result.error);
        return null;
    }

    return result.data;
};



export const createQuiz = async (req, res) => {
    try {

        const body = validatePayload(createQuizBodySchema, req.body, res);
        const headers = validatePayload(userRoleHeaderSchema, req.headers, res);

        if (!body || !headers) {
            return;
        }

        const { title, description, timeLimit, questionsToShow } = body;
        const { userid: teacherId } = headers;

        const quiz = await Quiz.create({
            title,
            description,
            teacherId,
            timeLimit,
            questionsToShow
        });

        res.status(201).json({
            success: true,
            quiz
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Quiz creation failed"
        });

    }
};




export const addQuestions = async (req, res) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const params = validatePayload(quizIdParamsSchema, req.params, res);
        const body = validatePayload(addQuestionsBodySchema, req.body, res);
        const headers = validatePayload(userRoleHeaderSchema, req.headers, res);

        if (!params || !body || !headers) {
            await session.abortTransaction();
            return;
        }

        const quizId = params.id;
        const { userid: teacherId } = headers;
        const { questions } = body;

        const quiz = await Quiz.findById(quizId).session(session);

        if (!quiz) {
            await session.abortTransaction();
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        if (quiz.teacherId !== teacherId) {
            await session.abortTransaction();
            return res.status(403).json({
                message: "You can only add questions to your own quiz"
            });
        }

        const formattedQuestions = questions.map(q => ({
            quizId,
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer,
            difficulty: q.difficulty || "medium",
            points: q.points || 1
        }));

        await Question.insertMany(formattedQuestions, { session });

        await Quiz.findByIdAndUpdate(
            quizId,
            { $inc: { totalQuestions: formattedQuestions.length } },
            { session }
        );

        await session.commitTransaction();

        res.json({
            success: true,
            message: "Questions added"
        });

    } catch (err) {

        await session.abortTransaction();

        console.error(err);

        res.status(500).json({
            message: "Failed to add questions"
        });

    } finally {

        session.endSession();

    }

};




export const publishQuiz = async (req, res) => {

    try {

        const params = validatePayload(quizIdParamsSchema, req.params, res);
        const headers = validatePayload(userRoleHeaderSchema, req.headers, res);

        if (!params || !headers) {
            return;
        }

        const quizId = params.id;
        const { userid: teacherId } = headers;

        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        if (quiz.teacherId !== teacherId) {
            return res.status(403).json({
                message: "You can only publish your own quiz"
            });
        }

        if (quiz.totalQuestions === 0) {
            return res.status(400).json({
                message: "Add questions before publishing"
            });
        }

        quiz.isPublished = true;

        await quiz.save();

        res.json({
            success: true,
            message: "Quiz published"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Publish failed"
        });

    }

};




export const getTeacherQuizzes = async (req, res) => {

    try {

        const headers = validatePayload(userRoleHeaderSchema, req.headers, res);

        if (!headers) {
            return;
        }

        const { userid: teacherId } = headers;

        const quizzes = await Quiz.find({ teacherId })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            quizzes
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Failed to fetch quizzes"
        });

    }

};




export const deleteQuiz = async (req, res) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const params = validatePayload(quizIdParamsSchema, req.params, res);
        const headers = validatePayload(userRoleHeaderSchema, req.headers, res);

        if (!params || !headers) {
            await session.abortTransaction();
            return;
        }

        const quizId = params.id;
        const { userid: teacherId } = headers;

        const quiz = await Quiz.findById(quizId).session(session);

        if (!quiz) {
            await session.abortTransaction();
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        if (quiz.teacherId !== teacherId) {
            await session.abortTransaction();
            return res.status(403).json({
                message: "You can only delete your own quiz"
            });
        }

        await Question.deleteMany({ quizId }, { session });

        await Quiz.findByIdAndDelete(quizId, { session });

        await session.commitTransaction();

        res.json({
            success: true,
            message: "Quiz deleted"
        });

    } catch (err) {

        await session.abortTransaction();

        res.status(500).json({
            message: "Delete failed"
        });

    } finally {

        session.endSession();

    }

};




export const generateQuizWithAI = async (req, res) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const body = validatePayload(generateAiQuizBodySchema, req.body, res);
        const headers = validatePayload(userRoleHeaderSchema, req.headers, res);

        if (!body || !headers) {
            await session.abortTransaction();
            return;
        }

        const { title, topic, difficulty, numberOfQuestions } = body;
        const { userid: teacherId } = headers;

        const quiz = await Quiz.create([{
            title,
            description: `AI generated quiz for ${topic}`,
            teacherId
        }], { session });

        const aiQuestions = await generateQuizQuestions(
            topic,
            difficulty,
            numberOfQuestions
        );

        const formattedQuestions = aiQuestions.map(q => ({
            quizId: quiz[0]._id,
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer,
            difficulty: q.difficulty || "medium",
            points: 1
        }));

        await Question.insertMany(formattedQuestions, { session });

        await Quiz.findByIdAndUpdate(
            quiz[0]._id,
            { totalQuestions: formattedQuestions.length },
            { session }
        );

        await session.commitTransaction();

        res.json({
            success: true,
            quizId: quiz[0]._id
        });

    } catch (err) {

        await session.abortTransaction();

        console.error(err);

        res.status(500).json({
            message: "AI quiz generation failed"
        });

    } finally {

        session.endSession();

    }

};
