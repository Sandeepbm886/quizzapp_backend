import { Submission } from "../models/submissions.model.js";
import { updateAnalytics } from "../services/analytics.service.js";
import { getLeaderboard } from "../services/leaderboard.service.js";
import { getIo } from "../app/socket.js";

export const ensureQuizNotPreviouslyAttempted = async (quizId, studentId) => {
    const existing = await Submission.findOne({
        quizId,
        studentId
    });

    return Boolean(existing);
};

export const createSubmission = async ({
    quizId,
    studentId,
    answers,
    questions,
    score,
    percentage,
    timeTaken,
    tabSwitchCount = 0,
    violations = []
}) => {
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

    await updateAnalytics(quizId, questions, answers, score, percentage);

    const leaderboard = await getLeaderboard(quizId);

    const io = getIo();

    if (io) {
        io.to(String(quizId)).emit("leaderboardUpdate", leaderboard);
    }

    return submission;
};
