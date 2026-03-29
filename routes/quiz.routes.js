import express from "express";
import { requireTeacher } from "../middlewares/role.middleware.js";

import {
    createQuiz,
    addQuestions,
    publishQuiz,
    getTeacherQuizzes,
    deleteQuiz,
    generateQuizWithAI
} from "../controllers/quiz.controller.js"

const router = express.Router();

router.post("/", requireTeacher, createQuiz);

router.post("/:id/questions", requireTeacher, addQuestions);

router.post("/:id/publish", requireTeacher, publishQuiz);

router.get("/teacher", requireTeacher, getTeacherQuizzes);

router.delete("/:id", requireTeacher, deleteQuiz);

router.post("/ai-generate", requireTeacher, generateQuizWithAI);

export default router;
