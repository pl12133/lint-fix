'use strict';

let { getFileLines, openFileForPatch, overwriteFileWithLines, getPatchCount } = require('./fsUtils');
let { default: getErrorsOfLogFile } = require('./lintLogParser');
// 1. Load lint log.
//
// 2. Split into individual files.
//
// 3. Parse errors
//

let args = process.argv.slice(2);
let logFileName = args[0];
if (!logFileName) {
  let { argv } = process;
  console.log(`Usage: node autoLintFixer.js [es-lint-log]`);
  process.exit(1);
}



function patchAllAvailableErrorsInLogFile(logFileName) {
  let errorInfo = getErrorsOfLogFile(logFileName);
  errorInfo.forEach((info, index) => {
    let patchedFileLines = openFileForPatch(info);
    //overwriteFileWithLines(info.file, patchedFileLines);
    //writeFileLinesWithPostfix(info.file, patchedFileLines);
  });
}




patchAllAvailableErrorsInLogFile(logFileName);
console.log(`Total Patched: ${getPatchCount()}`);
module.exports.default = patchAllAvailableErrorsInLogFile;
