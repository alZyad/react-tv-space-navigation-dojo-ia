import fs from 'fs';
import path from 'path';

script({
  description: 'Generate Deisgn System documentation files',
  model: 'openai:gpt-4o',
  maxTokens: 4000,
  tools: ['ds-component-doc-generator', 'ds-theme-doc-generator'],
  files: [
    'packages/example/src/design-system/components/*.tsx',
    'packages/example/src/design-system/theme/*.tsx',
  ],
});

defTool(
  'ds-component-doc-generator',
  'Creates a file documenting a design system component',
  {
    designSystemComponent: {
      type: 'string',
      description: 'Design system reusable component file path',
    },
    required: ['designSystemComponent'],
  },
  async ({ designSystemComponent }) => {
    const prompt = `
    Here is a Design System component path : ${designSystemComponent}.

    write a brief guide about importing and using the design system component :
    - Indicate how to import it using the alias, like this : \`import { Button } from '@DS/components/Button'
    - List the component's props and the values they accept.
    - If the component has several compound components, list them.
    - Show how to use the component by providing a code snippet of its usage as example.

    Write this documentation to the file with the path : ${componentsFolderPath}/<ComponentName>.md.
    `;

    const result = await runPrompt(prompt, {
      model: 'openai:gpt-4o',
      label: 'ds-component-doc-generator',
      applyEdits: true,
      system: ['system.files', 'system.fs_read_file'],
    });
    return result;
  },
);

defTool(
  'ds-theme-doc-generator',
  'Creates a file documenting the design system theme',
  {},
  async () => {
    const prompt = `
      Here are the files making up Design System theme :
        - Colors : packages/example/src/design-system/theme/colors.ts
        - Typography : packages/example/src/design-system/theme/typography.ts
        - Sizes : packages/example/src/design-system/theme/sizes.ts
        - Spacings : packages/example/src/design-system/theme/spacings.ts

      List all the allowed values for each of the theme properties in a single readable summary file.

      Write this documentation to the path : ${documentationFolderPath}/theme.md.
      `;

    const result = await runPrompt(prompt, {
      model: 'openai:gpt-4o',
      label: 'ds-theme-doc-generator',
      applyEdits: true,
      system: ['system.files', 'system.fs_read_file'],
    });
    return result;
  },
);

const documentationFolderPath = path.join(process.cwd(), 'genaisrc/design-system-documentation');
if (!fs.existsSync(documentationFolderPath)) {
  fs.mkdirSync(documentationFolderPath, { recursive: true });
}

const componentsFolderPath = path.join(documentationFolderPath, 'components');
if (!fs.existsSync(componentsFolderPath)) {
  fs.mkdirSync(componentsFolderPath, { recursive: true });
}

defFileOutput(`${componentsFolderPath}/*.md`, 'Documentation file for a design system component');

defFileOutput(
  `${documentationFolderPath}/theme.md`,
  'documentation file for the design system theme variables',
);

$`You are a senior developer with 20 years of experience and you use as many standards as possible like DDD, Solid, Clean Code.

Here are the Design System components in this database :
- Button : packages/example/src/design-system/components/Button.tsx
- Typography : packages/example/src/design-system/components/Typography.tsx
- Spacer : packages/example/src/design-system/components/Spacer.tsx
- Box : packages/example/src/design-system/components/Box.tsx
- Arrows : packages/example/src/design-system/components/Arrows.tsx
- TextInput : packages/example/src/design-system/components/TextInput.tsx

Generate a documentation of the project's design system using the tools at your disposal, follow this steps :
 - On each Design System component, use the tool 'ds-component-doc-generator' to generate a file documenting the component.
 - Use the tool 'ds-theme-doc-generator' to generate a file documenting the design system theme.
`;
