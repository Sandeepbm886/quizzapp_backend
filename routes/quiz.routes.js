import express from "express";

import {
    createQuiz,
    addQuestions,
    publishQuiz,
    getTeacherQuizzes,
    deleteQuiz,
    generateQuizWithAI
} from "../controllers/quiz.controller.js"

const router = express.Router();

router.post("/", createQuiz);

router.post("/:id/questions", addQuestions);

router.post("/:id/publish", publishQuiz);

router.get("/teacher", getTeacherQuizzes);

router.delete("/:id", deleteQuiz);

router.post("/ai-generate", generateQuizWithAI);

export default router;