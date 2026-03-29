# Quiz App Backend API Reference

Base URL:

```text
http://localhost:5001
```

Common notes:

- Send `Content-Type: application/json` for all `POST` requests.
- Teacher-only routes require headers: `userrole: teacher` and `userid: teacher_001`.
- Student-only routes require headers: `userrole: student` and `userid: student_001`.
- `:id` path params below use a dummy Mongo ObjectId: `507f1f77bcf86cd799439011`.
- For answer maps, question ids use dummy Mongo ObjectIds.

## 1. Create Quiz

Method and URL:

```http
POST /api/quiz
```

Headers:

```json
{
  "Content-Type": "application/json",
  "userrole": "teacher",
  "userid": "teacher_001"
}
```

Body:

```json
{
  "title": "JavaScript Basics Quiz",
  "description": "Introductory quiz for JS fundamentals",
  "timeLimit": 900,
  "questionsToShow": 5
}
```

Notes:

- `description`, `timeLimit`, and `questionsToShow` are optional.
- Defaults if omitted: `timeLimit = 600`, `questionsToShow = 10`.

## 2. Add Questions To Quiz

Method and URL:

```http
POST /api/quiz/507f1f77bcf86cd799439011/questions
```

Headers:

```json
{
  "Content-Type": "application/json",
  "userrole": "teacher",
  "userid": "teacher_001"
}
```

Body:

```json
{
  "questions": [
    {
      "questionText": "Which keyword is used to declare a constant in JavaScript?",
      "options": ["var", "let", "const", "static"],
      "correctAnswer": "const",
      "difficulty": "easy",
      "points": 2
    },
    {
      "questionText": "Which array method creates a new array with transformed elements?",
      "options": ["filter", "reduce", "map", "find"],
      "correctAnswer": "map",
      "difficulty": "medium",
      "points": 3
    }
  ]
}
```

Notes:

- `questions` must contain at least 1 item.
- Every question must have exactly 4 options.
- `correctAnswer` must exactly match one of the 4 options.
- `difficulty` is optional: `easy`, `medium`, or `hard`.
- `points` is optional and defaults to `1`.

## 3. Publish Quiz

Method and URL:

```http
POST /api/quiz/507f1f77bcf86cd799439011/publish
```

Headers:

```json
{
  "userrole": "teacher",
  "userid": "teacher_001"
}
```

Body:

```json
{}
```

Notes:

- Quiz must already have at least 1 question.

## 4. Get Teacher Quizzes

Method and URL:

```http
GET /api/quiz/teacher
```

Headers:

```json
{
  "userrole": "teacher",
  "userid": "teacher_001"
}
```

Body:

```json
{}
```

## 5. Delete Quiz

Method and URL:

```http
DELETE /api/quiz/507f1f77bcf86cd799439011
```

Headers:

```json
{
  "userrole": "teacher",
  "userid": "teacher_001"
}
```

Body:

```json
{}
```

## 6. Generate Quiz With AI

Method and URL:

```http
POST /api/quiz/ai-generate
```

Headers:

```json
{
  "Content-Type": "application/json",
  "userrole": "teacher",
  "userid": "teacher_001"
}
```

Body:

```json
{
  "title": "Node.js AI Quiz",
  "topic": "Node.js fundamentals",
  "difficulty": "medium",
  "numberOfQuestions": 10
}
```

Notes:

- `difficulty` is optional.
- `numberOfQuestions` is required and must be a positive integer up to 50.

## 7. Get Available Quizzes For Student

Method and URL:

```http
GET /api/student/quiz/available
```

Headers:

```json
{
  "userrole": "student",
  "userid": "student_001"
}
```

Body:

```json
{}
```

Notes:

- This route only returns published quizzes.

## 8. Start Quiz

Method and URL:

```http
GET /api/student/quiz/507f1f77bcf86cd799439011/start
```

Headers:

```json
{
  "userrole": "student",
  "userid": "student_001"
}
```

Body:

```json
{}
```

Notes:

- This returns quiz info and shuffled questions without correct answers.
- It selects up to `questionsToShow` questions from the quiz.

## 9. Submit Quiz

Method and URL:

```http
POST /api/student/quiz/507f1f77bcf86cd799439011/submit
```

Headers:

```json
{
  "Content-Type": "application/json",
  "userrole": "student",
  "userid": "student_001"
}
```

Body:

```json
{
  "answers": {
    "507f1f77bcf86cd799439021": "const",
    "507f1f77bcf86cd799439022": "map"
  },
  "timeTaken": 420,
  "tabSwitchCount": 1,
  "violations": ["Switched tab once during the quiz"]
}
```

Notes:

- `answers` is an object where each key is a question id and each value is the selected option text.
- `timeTaken` is required and must be a positive integer.
- `tabSwitchCount` is optional.
- `violations` is optional.
- A student can submit a given quiz only once.

## 10. Get Quiz Analytics

Method and URL:

```http
GET /api/quiz/analytics/507f1f77bcf86cd799439011
```

Headers:

```json
{}
```

Body:

```json
{}
```

Notes:

- No role header is enforced on this route in the current backend.
- If no analytics exist yet, the API returns zeroed analytics data.
