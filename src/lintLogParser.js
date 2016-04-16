let { getFileLines } = require('./fsUtils');

export default function getErrorsOfLogFile(logFileName) {
  console.log('Opening Log File ' + logFileName);
  let logLines = getFileLines(logFileName);
  let fileNamesWithErrors = getFilesWithErrors(logLines);
  let filesAndErrors = fileNamesWithErrors.map((file) => {
    return getErrorsOfFile(file);
  });
  return filesAndErrors;

  function getErrorsOfFile(fileName) {
    let range = getLineRangeOfFile(fileName);
    let rawErrors = getErrorsInRange(logLines, range);
    let parsedErrors = parseErrorLines(rawErrors);
    return {
      fileName,
      rawErrors,
      errors: parsedErrors
    };
  }
  function getFilesWithErrors(lines) {
    let nodePath = process.env.NODE_PATH;
    let filesWithErrors = [];
    lines.forEach((line, index) => {
      if (line.indexOf(nodePath) === 0) {
        filesWithErrors.push(line);
      }
    });
    return filesWithErrors;
  }
  function parseErrorLines(errors) {
    let stringToCamelCase = (str) => {
      return str.split('').reduce((memo, current, index, arr) => {
        if (current !== '-') {
          let letter = (arr[index-1] === '-') ? current.toUpperCase() : current;
          memo += letter;
        }
        return memo;
      }, '');
    }
    return errors.map((errorLine) => {
      let fields = errorLine.trim().split(' ').filter((field) => !!field.length );
      let lineNum = fields[0];
      let errorType = fields[1];
      let errorMessage = fields.slice(2, fields.length - 1).join(' ');
      let rule = stringToCamelCase(fields[fields.length - 1]);
      return {
        lineNum,
        errorType,
        errorMessage,
        rule
      }
    });
  }
  function getLineRangeOfFile(fileName) {
    let errorsLineStart = -1;
    let errorsLineEnd = -1;
    logLines.some((line, index) => {
      if (errorsLineStart > 0 && line.length === 0) {
        errorsLineEnd = index;
        return true;
      }
      if (line.indexOf(fileName) === 0) {
        errorsLineStart = index + 1;
      }
      return false;
    });
    return { start: errorsLineStart, end: errorsLineEnd };
  }
  function getErrorsInRange(lines, {start, end}) {
    return lines.slice(start,end);
  }
}
