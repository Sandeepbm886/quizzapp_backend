export const calculateScore = (questions, answers) => {

    let score = 0;
    let totalPoints = 0;

    questions.forEach((q) => {

        totalPoints += q.points || 1;

        const studentAnswer = answers[q._id];

        if (studentAnswer === q.correctAnswer) {
            score += q.points || 1;
        }

    });

    const percentage = (score / totalPoints) * 100;

    return {
        score,
        percentage
    };

};