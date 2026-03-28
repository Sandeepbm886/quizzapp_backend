import express from "express";

import {
    getAvailableQuizzes,
    startQuiz,
    submitQuiz
} from "../controllers/studentQuiz.controller";

const router = express.Router();

router.get("/available", getAvailableQuizzes);

router.get("/:id/start", startQuiz);

router.post("/:id/submit", submitQuiz);

export default router;