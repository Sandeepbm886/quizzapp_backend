import {Analytics} from "../models/analytics.model.js";

export const getQuizAnalytics = async (req, res) => {

    try {

        const quizId = req.params.id;

        const analytics = await Analytics.findOne({ quizId });

        if (!analytics) {
            return res.json({
                attemptCount: 0,
                averageScore: 0,
                scoreDistribution: {}
            });
        }

        res.json({
            success: true,
            analytics
        });

    } catch (err) {

        res.status(500).json({
            message: "Failed to fetch analytics"
        });

    }

};