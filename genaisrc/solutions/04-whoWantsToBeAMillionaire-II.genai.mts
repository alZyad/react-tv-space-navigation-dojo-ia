import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

script({
  model: 'openai:gpt-4o',
});

const quizzSchema = z.object({
  question: z
    .string()
    .describe('The question of the quizz in the style of who wants to be a millionaire.'),
  answers: z
    .array(z.string())
    .describe('3 wrong answers to the question. The correct answer SHOULD NOT be here.'),
  correctAnswer: z.string().describe('The correct answer to the question.'),
});

const { json } = await runPrompt(
  (_) => {
    _.$`Generate a quizz question`;
  },
  { responseType: 'json_schema', responseSchema: zodToJsonSchema(quizzSchema) },
);

const quizz = json as z.infer<typeof quizzSchema>;

const userAnswer = await host.select(
  `Welcome to Who Wants to Be a Millionaire! You have to answer the following question to win the million dollar prize:

${quizz.question}`,
  [
    `a) ${quizz.answers[0]}`,
    `b) ${quizz.answers[1]}`,
    `c) ${quizz.correctAnswer}`,
    `d) ${quizz.answers[2]}`,
  ],
);

const chosenAnswer = userAnswer.substring(0, 1);

if (chosenAnswer === 'c') {
  $`Congratulate the user for winning Who Wants to Be a Millionaire!`;
} else {
  $`The user chose the wrong answer. The correct answer was: ${quizz.correctAnswer}. Tell the user they lost Who Wants to Be a Millionaire.`;
}
