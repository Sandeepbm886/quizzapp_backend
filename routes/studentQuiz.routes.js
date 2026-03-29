import express from "express";
import { requireStudent } from "../middlewares/role.middleware.js";

import {
    getAvailableQuizzes,
    startQuiz,
    submitQuiz
} from "../controllers/studentQuiz.controller.js";

const router = express.Router();

router.get("/available", requireStudent, getAvailableQuizzes);

router.get("/:id/start", requireStudent, startQuiz);

router.post("/:id/submit", requireStudent, submitQuiz);

export default router;
