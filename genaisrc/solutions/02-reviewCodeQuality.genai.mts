script({
  model: 'anthropic:claude-3-5-sonnet-20240620',
});

def('FILE', env.files);

$`Review the code quality of the file FILE and suggest improvements when relevant.

Here are the main points to consider:
  1. Readability: Is the code easy to read and understand? Are variable and function names meaningful?
  2. Maintainability: Is the code organized in a way that makes it easy to maintain and extend? Are there any comments or documentation?
  3. Performance: Are there any performance issues or potential bottlenecks?
  4. Security: Are there any security vulnerabilities or concerns?
  5. Best Practices: Does the code follow industry best practices and coding standards?
  6. Testing: Are there sufficient tests? Is the code covered by unit tests, integration tests, etc.?
  7. Error Handling: Is error handling implemented properly? Are edge cases considered?
  8. Dependencies: Are dependencies managed properly? Are there any outdated or unnecessary dependencies?
`;
