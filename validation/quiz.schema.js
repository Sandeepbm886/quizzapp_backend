import { z } from "zod";
import {
  objectIdSchema,
  positiveIntSchema,
  requiredStringSchema,
} from "./common.schema.js";

export const quizIdParamsSchema = z.object({
  id: objectIdSchema,
});

export const createQuizBodySchema = z.object({
  title: requiredStringSchema.max(200, "Title must be 200 characters or fewer"),
  description: z
    .string()
    .trim()
    .max(1000, "Description must be 1000 characters or fewer")
    .optional(),
  timeLimit: positiveIntSchema.max(7200, "Time limit cannot exceed 7200 seconds").optional(),
  questionsToShow: positiveIntSchema.max(100, "Questions to show cannot exceed 100").optional(),
});

export const questionItemSchema = z
  .object({
    questionText: requiredStringSchema.max(
      1000,
      "Question text must be 1000 characters or fewer"
    ),
    options: z
      .array(requiredStringSchema.max(300, "Option must be 300 characters or fewer"))
      .length(4,"4 options must be there"),
    correctAnswer: requiredStringSchema.max(
      300,
      "Correct answer must be 300 characters or fewer"
    ),
    difficulty: z.enum(["easy", "medium", "hard"]).optional(),
    points: positiveIntSchema.max(100, "Points cannot exceed 100").optional(),
  })
  .superRefine((value, ctx) => {
    if (!value.options.includes(value.correctAnswer)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["correctAnswer"],
        message: "Correct answer must match one of the options",
      });
    }
  });

export const addQuestionsBodySchema = z.object({
  questions: z.array(questionItemSchema).min(1, "Questions required"),
});

export const generateAiQuizBodySchema = z.object({
  title: requiredStringSchema.max(200, "Title must be 200 characters or fewer"),
  topic: requiredStringSchema.max(200, "Topic must be 200 characters or fewer"),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  numberOfQuestions: positiveIntSchema.max(
    50,
    "Number of questions cannot exceed 50"
  ),
});
