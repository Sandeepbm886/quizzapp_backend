import {Submission} from "../models/submissions.model.js";

export const getLeaderboard = async (quizId) => {

  const leaderboard = await Submission.find({ quizId })
    .sort({ score: -1, timeTaken: 1 })
    .limit(10)
    .select("studentId score timeTaken");

  return leaderboard;

};