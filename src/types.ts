import { z } from 'zod';

const requiredString = z.string().min(1, 'Required');

export const quizQuestionsSchema = z.object({
  id: z.number().optional(),
  quizId: z.number().optional(),
  type: z.union([z.literal('mcq'), z.literal('short'), z.literal('code')]),
  prompt: requiredString,
  correctAnswer: requiredString,
  options: z.array(requiredString).nonempty('Required'),
  position: z.number().optional(),
});

export const quizDetailsSchema = z.object({
  id: z.number(),
  title: requiredString,
  description: requiredString,
  timeLimitSeconds: z
    .union([z.string(), z.number()])
    .refine((val) => val !== 0, {
      message: 'Required',
    }),
  isPublished: z.boolean(),
  createdAt: z.string(),
  questions: z.array(quizQuestionsSchema),
});

const attemptSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.number(),
      value: z.string(),
    })
  ),
  id: z.number(),
  quiz: quizDetailsSchema.omit({
    isPublished: true,
    createdAt: true,
  }),
  quizId: z.number(),
  startedAt: z.string(),
  submittedAt: z.string().optional(),
});

export type Quiz = z.infer<typeof quizDetailsSchema>;
export type Attempt = z.infer<typeof attemptSchema>;
export type QuizQuestion = z.infer<typeof quizQuestionsSchema>;

export type QuizDetailsPayload = z.infer<typeof quizDetailsSchema>;
export type QuizQuestionsPayload = z.infer<typeof quizQuestionsSchema>;
