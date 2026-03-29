import {Analytics} from "../models/analytics.model.js";

export const updateAnalytics = async (quizId, questions, answers, score, percentage) => {

    const distributionBucket = getBucket(percentage);

    const analytics = await Analytics.findOne({ quizId });
    const questionAccuracy = buildQuestionAccuracy(
        questions,
        answers,
        analytics?.questionAccuracy
    );

    if (!analytics) {

        const newAnalytics = await Analytics.create({
            quizId,
            attemptCount: 1,
            averageScore: score,
            scoreDistribution: {
                [distributionBucket]: 1
            },
            questionAccuracy
        });

        return newAnalytics;
    }

    const newAttemptCount = analytics.attemptCount + 1;

    const newAverage =
        (analytics.averageScore * analytics.attemptCount + score) /
        newAttemptCount;

    const currentDistribution = analytics.scoreDistribution || {};

    currentDistribution[distributionBucket] =
        (currentDistribution[distributionBucket] || 0) + 1;

    analytics.attemptCount = newAttemptCount;
    analytics.averageScore = newAverage;
    analytics.scoreDistribution = currentDistribution;
    analytics.questionAccuracy = questionAccuracy;

    await analytics.save();

};

const getBucket = (percentage) => {

  if (percentage < 20) return "0-20";
  if (percentage < 40) return "20-40";
  if (percentage < 60) return "40-60";
  if (percentage < 80) return "60-80";

  return "80-100";
};

const buildQuestionAccuracy = (questions, answers, existingAccuracy) => {
    const previousAccuracy = existingAccuracy
        ? Object.fromEntries(existingAccuracy.entries())
        : {};

    for (const question of questions) {
        const questionId = String(question._id);
        const stats = previousAccuracy[questionId] || {
            attempts: 0,
            correct: 0
        };

        stats.attempts += 1;

        if (answers[questionId] === question.correctAnswer) {
            stats.correct += 1;
        }

        previousAccuracy[questionId] = stats;
    }

    return previousAccuracy;
};
