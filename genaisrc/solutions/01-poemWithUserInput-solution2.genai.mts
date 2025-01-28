script({
  model: 'anthropic:claude-3-5-sonnet-20240620',
});

const THEME = host.input('What theme would you like your poem to be about?');

$`Write a poem about the theme ${THEME}.`;
