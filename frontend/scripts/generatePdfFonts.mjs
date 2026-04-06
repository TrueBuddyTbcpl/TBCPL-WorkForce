// scripts/generatePdfFonts.mjs
// Run once: node scripts/generatePdfFonts.mjs
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const fonts = {
  'Roboto-Regular':      'src/assets/fonts/Roboto-Regular.ttf',
  'Roboto-Medium':       'src/assets/fonts/Roboto-Medium.ttf',
  'Roboto-Italic':       'src/assets/fonts/Roboto-Italic.ttf',
  'Roboto-MediumItalic': 'src/assets/fonts/Roboto-MediumItalic.ttf',
};

const vfsEntries = Object.entries(fonts).map(([name, path]) => {
  const buffer = readFileSync(resolve(__dirname, '..', path));
  const base64 = buffer.toString('base64');
  return `  '${name}.ttf': '${base64}'`;
});

const output = `// AUTO-GENERATED — do not edit manually
// Re-generate with: node scripts/generatePdfFonts.mjs

const pdfFontsVfs: Record<string, string> = {
${vfsEntries.join(',\n')}
};

export default pdfFontsVfs;
`;

writeFileSync(
  resolve(__dirname, '..', 'src/utils/pdfFontsVfs.ts'),
  output,
  'utf-8'
);

console.log('✅ pdfFontsVfs.ts generated successfully');