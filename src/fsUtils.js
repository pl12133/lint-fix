let fs = require('fs');
let { default: configureFixes } = require('./fixes');

let totalPatchedCount = 0;

export function getPatchCount() {
  return totalPatchedCount;
}

export function getFileLines(fileName) {
//  let valid = /(\.js|\.txt)$/.test(fileName);
//  console.log(`FileName: ${fileName} is valid: ${valid}`);
  let file = fs.readFileSync(fileName, { encoding: 'utf-8' });
  return file.split('\n');
}
export function overwriteFileWithLines(fileName, lines) {
  fs.writeFileSync(fileName, lines.join('\n'), { encoding: 'utf-8' });
}
export function writeFileLinesWithPostfix(fileName, lines) {
  let postfix = '.lintfixed';
  let fileNamePostfixed = fileName + postfix;
  fs.writeFileSync(fileNamePostfixed, lines.join('\n'), { encoding: 'utf-8' });
  //console.log(`Wrote to ${fileName}`);
}
export function overwritePostfixFile(fileName) {
  let postfix = '.lintfixed';
  let fileNamePostfixed = fileName + postfix;
  fs.rename(fileNamePostfixed, fileName);
}


export function openFileForPatch(fileErrors) {
  let { fileName } = fileErrors;
  //console.log('Patching ' + fileName);
  let lines = getFileLines(fileName);
  let patchInfo = { 
    fileName,
    patchCount: 0,
    fixes: [],
    lines: []
  };
  let lineNumbersWithErrors = fileErrors.errors.map((error) => {
    // Will return an array of line numbers where errors occur
    let lineNum = error.lineNum.split(':')[0];
    return lineNum - 1;
  });

  //console.log(`${fileName} has errors on ${lineNumbersWithErrors}`);
  let fixes = configureFixes();
  let patchedLines = lines.map((line, index) => {
    // 1. determine if should mutate
    //
    // 2. do mutation or not
    //
    // 3. retnrn line
    
    //This line has an error
    let errorOnThisLine = lineNumbersWithErrors.indexOf(index);
    if (errorOnThisLine >= 0) {
      let { lineNum, errorType, rule } = fileErrors.errors[errorOnThisLine];
      //console.log(`Line ${index}:${errorType} (${rule}) -> error: ${line}`);
      if (rule in fixes) {
        let fix = fixes[rule];
        if (fix.lineTest && fix.lineTest.test(line)) {
          //console.log(`Patching ${rule} on ${index}`);
          if (fix.search.test(line)) {
            line = line.replace(fix.search, fix.replace);
            patchInfo.fixes.push({
              lineNum,
              rule
            })
            patchInfo.patchCount++;
          }

        }
      }
    }
    return line;
  });

  console.log(`Patched ${patchInfo.patchCount} errors on ${fileName}`);
  totalPatchedCount += patchInfo.patchCount;

  patchInfo.lines = patchedLines;
  return patchInfo;
}


