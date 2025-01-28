script({
  model: 'anthropic:claude-3-5-sonnet-20240620',
  system: 'system.agent_user_input',
});

const { text: quizz } = await runPrompt((_) => {
  _.$`Generate a quizz in the style of who wants to be a millionaire, and suggest 4 answers to the user : a, b, c and d, with only one of them being the correct answer. Do not say which one is the correct answer as it would spoil the player. Here is the format to follow :

  "What is the capital of France ?"
  a) Paris
  b) London
  c) Berlin
  d) Madrid`;
});

$`The user is playing "Who Wants to Be a Millionaire" and has to answer the following quizz: ${quizz}. Provide the user with the quizz and ask him which answer they choose with a selection input. Once an answer is chosen, inform them if theire answer was correct or not and end the conversation.`;
