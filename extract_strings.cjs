const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');
const stringSet = new Set();

// Ensure some default strings are always there
stringSet.add("VoteWise");
stringSet.add("First Time Voter? Start Here \u2192");
stringSet.add("First Timer Mode ON \u2014 Everything explained simply \u2713");
stringSet.add("Beginner Friendly");
stringSet.add("Translation temporarily unavailable. Showing English content.");

// Regex to capture t('...') or t("...") including escaped quotes
const regex1 = /t\(\s*'([^'\\]*(?:\\.[^'\\]*)*)'\s*\)/g;
const regex2 = /t\(\s*"([^"\\]*(?:\\.[^"\\]*)*)"\s*\)/g;

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      let match;
      while ((match = regex1.exec(content)) !== null) {
        stringSet.add(match[1].replace(/\\'/g, "'"));
      }
      while ((match = regex2.exec(content)) !== null) {
        stringSet.add(match[1].replace(/\\"/g, '"'));
      }
    }
  }
}

scanDirectory(directoryPath);

const outputPaths = path.join(__dirname, 'src/constants/uiStrings.js');
let currentContent = fs.readFileSync(outputPaths, 'utf8');
const newArrayStr = `export const UI_STRINGS = [\n  ` + 
  Array.from(stringSet).map(s => JSON.stringify(s)).join(',\n  ') +
  `\n];`;

const finalContent = currentContent.replace(/export const UI_STRINGS = \[[\s\S]*?\];/, newArrayStr);
fs.writeFileSync(outputPaths, finalContent, 'utf8');
console.log(`Extracted ${stringSet.size} unique strings to uiStrings.js`);
