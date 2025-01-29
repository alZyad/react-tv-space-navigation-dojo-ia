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
    .describe(
      '3 wrong answers to the question. The correct answer SHOULD NOT be here. Put the answer only without any additional text.',
    ),
  correctAnswer: z
    .string()
    .describe(
      'The correct answer to the question. Put the answer only without any additional text.',
    ),
});

// Turn the JSON schema into an array of the original schema
const quizzArraySchema = z.object({
  questions: z.array(quizzSchema).describe('An array of 3 quizz questions.'),
});

const { json } = await runPrompt(
  (_) => {
    _.$`Generate a quizz according to the schema`;
  },
  { responseType: 'json_schema', responseSchema: zodToJsonSchema(quizzArraySchema) },
);

const quizzList = json as z.infer<typeof quizzArraySchema>;

let score = 0;

console.log(
  'Welcome to Who Wants to Be a Millionaire! You have to answer the following 3 questions to win the million dollar prize !',
);

for (const quizz of quizzList.questions) {
  // Randomize the position of the correct answer
  const answers = [...quizz.answers];
  const correctAnswerIndex = Math.floor(Math.random() * 4);
  answers.splice(correctAnswerIndex, 0, quizz.correctAnswer);

  const userAnswer = await host.select(`${quizz.question}`, [
    `a) ${answers[0]}`,
    `b) ${answers[1]}`,
    `c) ${answers[2]}`,
    `d) ${answers[3]}`,
  ]);

  const chosenAnswer = userAnswer.substring(0, 1);

  if (chosenAnswer === String.fromCharCode(97 + correctAnswerIndex)) {
    score++;
    await prompt`Congratulate the user for answering correctly! Their current score is: ${score}`;
  } else {
    await prompt`The user chose the wrong answer. The correct answer was: ${quizz.correctAnswer}. Tell the user they lost Who Wants to Be a Millionaire. Their final score is: ${score}`;
    break;
  }
}

if (score === quizzList.questions.length) {
  $`Congratulate the user for answering all questions correctly and winning Who Wants to Be a Millionaire! Your final score is: ${score}`;
}
