const babel = require('@babel/core');
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

const API_DIR = path.resolve(__dirname, 'apps/api').replace(/\\/g, '/');

async function convertFiles(targetDir) {
  const tsFiles = glob.sync(`${targetDir}/**/*.{ts,tsx}`, {
    ignore: ['**/node_modules/**', '**/*.d.ts']
  }).map(f => f.replace(/\\/g, '/')); 

  console.log(`Found ${tsFiles.length} TypeScript files to convert in ${targetDir}.`);

  for (const file of tsFiles) {
    const isTsx = file.endsWith('.tsx');
    const ext = isTsx ? '.jsx' : '.js';
    const newFile = file.replace(/\.tsx?$/, ext);

    try {
      const result = await babel.transformFileAsync(file, {
        presets: [
          '@babel/preset-typescript'
        ],
        plugins: [
          '@babel/plugin-syntax-jsx'
        ],
        retainLines: true,
      });
      
      let code = result.code;
      
      await fs.writeFile(newFile, code);
      await fs.remove(file); // Delete old TS file
      console.log(`Converted: ${path.basename(file)} -> ${path.basename(newFile)}`);
    } catch (err) {
      console.error(`Error converting ${file}:`, err);
    }
  }
}

convertFiles(API_DIR);
