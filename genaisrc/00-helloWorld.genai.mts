/**
 * Exercise 0: Setup Check
 *
 * This is a simple exercise to verify that your GenAIScript environment
 * is properly configured and can communicate with the Anthropic API.
 *
 * If you see a poetic response from Claude after running this script,
 * everything is working correctly!
 *
 * GenAIScript scripts are just normal scripts with the ability to make LLM API calls.
 */

console.log('Hello, GenAIScript!');

script({
  model: 'anthropic:claude-3-5-sonnet-20240620',
});

$`Write a short poem about code.`;
