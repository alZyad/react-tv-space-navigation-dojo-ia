import path from 'path';
import fs from 'fs';

script({
  description:
    'Given an image of a app mockup, generate react native code for it and write it in the right file.',
  group: 'vision',
  files: 'genaisrc/design-system-documentation/**/*.md',
  system: ['system.fs_read_file', 'system.files'],
});
let mockupPath = await host.input('Please provide the image path of the app mockup.', {
  required: true,
});
if (mockupPath[0] === "'" || mockupPath[0] === '"') {
  mockupPath = mockupPath.slice(1, -1);
}
while (mockupPath[0] !== '/' && mockupPath.slice(0, 2) !== './') {
  mockupPath = await host.input(
    "Please provide a valid image path of the app mockup. it has to start with '/' or './'",
    { required: true },
  );
}

if (mockupPath[0] === '/') {
  mockupPath = path.relative(process.cwd(), mockupPath);
}
defImages(mockupPath);

const outputPath = 'packages/example/src/pages/ProgramDetail.tsx';

defFileOutput(outputPath, 'a .tsx file ready to be compiled in typescript');

// get the list of all files in genaisrc/design-system-documentation/**/* with fs, including subfolders
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath, { withFileTypes: true });

  files.forEach((file) => {
    if (file.isDirectory()) {
      arrayOfFiles = getAllFiles(path.join(dirPath, file.name), arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, file.name));
    }
  });

  return arrayOfFiles;
}

const documentationPaths = getAllFiles('genaisrc/design-system-documentation');

await prompt`
You are a senior React Native developer with 20 years of experience, following best practices such as DDD, SOLID, and Clean Code.  

🔴 **STRICT RULES:**  
- **YOU HAVE TO use the design system components whose documentation I provided.**  
- **NEVER use div, span, or web-based HTML tags.** This is React Native.  
- **Use only documented props—never assume missing props.**  
- **If no matching design system component exists, fallback to React Native primitives (View, Text, etc.), this is a LAST RESORT, you have to use the components documented in \`${documentationPaths}\`.**

### Step 1: Analyze the Mockup  
You are given an image of an app mockup. Start by meticulously describing its structure:  
- Identify all sections and elements.  
- Describe their layout, hierarchy, and positioning.  
- Estimate spacing, margins, and alignments as accurately as possible.  

### Step 2: Generate Code Using the Design System  
Using the project's design system **wherever possible**, generate **strictly compliant** React Native code for this mockup.  
- **MANDATORY:** Use only the documented props for design system components. Refer to these documentation files: \`${documentationPaths}\`.  
- **STRICT RULE:** Do not assume missing props. If a required component or prop is undocumented, ask the user to provide documentation and **terminate the script**.  
- **Fallback:** If no appropriate design system component exists, use standard React Native components.  

### Step 3: Code Quality & Layout Precision  
- **Recreate the layout exactly** as described in your analysis.  
- **Spacing must match the mockup precisely**.  
- **Use yellow rectangles as placeholders for images**.  

### Step 4: Export & File Structure  
- Wrap the content in \`<Page />\`, imported as:  
  \`\`\`js
  import { Page } from '../components/Page';
  \`\`\`
Use named exports (no default exports).
Save the component in ${outputPath}.
Now, generate the React Native code.

**
`.options({
  applyEdits: true,
  system: ['system.files', 'system.fs_read_file'],
});
