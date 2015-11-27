'use strict';

let { getFileLines, openFileForPatch, overwriteFileWithLines, writeFileLinesWithPostfix, getPatchCount } = require('./fsUtils');
let { default: getErrorsOfLogFile } = require('./lintLogParser');
let { default: beginInputListening } = require('./inputListener');
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
  console.log(`Usage: babel-node -- autoLintFixer.js [es-lint-log]`);
  process.exit(1);
}

function patchAllAvailableErrorsInLogFile(logFileName) {
  // This function should return a patchInfo object
  let errorInfo = getErrorsOfLogFile(logFileName);
  let batchPatchInfo = {
    totalErrorCount: 0,
    patches: []
  };
  errorInfo
    .filter(info => info.errors.length)
    .forEach((info, index) => {
      let patchInfo = openFileForPatch(info);
      let patchedFileLines = patchInfo.lines;
      //console.log(`Patching: ${info.fileName} with ${info.errors.length} errors`);
      // File overwriting is currently disabled during development 

      // Overwrite a file eniterly
      // overwriteFileWithLines(info.file, patchedFileLines);

      // Write a .lintfixed file temporarily so the user can assess changes
      writeFileLinesWithPostfix(info.fileName, patchedFileLines);

      batchPatchInfo.patches.push(patchInfo);
  });
  return batchPatchInfo;
}




let batchPatchInfo = patchAllAvailableErrorsInLogFile(logFileName);
console.log(`Patched ${getPatchCount()} in ${batchPatchInfo.patches.length} files`);
beginInputListening(batchPatchInfo);
module.exports.default = patchAllAvailableErrorsInLogFile;
