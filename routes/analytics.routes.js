import express from "express";

import { getQuizAnalytics } from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/:id", getQuizAnalytics);

export default router;