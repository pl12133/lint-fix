
let configureFixes = configureSemistandardFixes;
export default configureFixes;

export function applyFix(line, fix, error) {
  if (fix.exec) {
    line = fix.exec(line, error);
  } else {
    line = line.replace(fix.search, fix.replace);
  }
  return line;
}
// To create a new rule, give it either an `exec` function or a `search/replace` pair of Regex's
// If a rule has `exec`, that will be executed instead of `search/replace`
// Signature of `exec` is `function(line, errorInfo)` and it returns a
// transformed line that applies the fix.
// If a rule can be fixed with just regex, use `search/replace` to find
// and replace on a line to apply a fix.

function configureSemistandardFixes() {
  return {
    // Place semicolon at end of line
    semi: {
      search: /$/,
      replace: ';'
    },
    spaceBeforeFunctionParen: {
      search: /^(.*)\((.*)\) {/,
      replace: function(match, $1, $2, offset, original) {
        return `${$1} (${$2}) {`;
      }
    },
    // This one could be dangerous if there are nested escaped quotes
    quotes: {
      search: /"/g,
      replace: '\''
    },
    noTrailingSpaces: {
      search: /^(.*?)\s+$/,
      replace: '$1'
    },
    spacedComment: {
      search: /^(.*)(\/{2,}|\/\*)(.*)$/,
      replace: '$1$2 $3'
    },
    noFloatingDecimal: {
      search: /^(.*)(\.\d+)(.*)$/,
      replace: function(match, $1, $2, $3) {
        return $1 + '0' + $2 + $3;
      }
    },
    commaDangle: {
      search: /^(.*),(.*)$/,
      replace: '$1$2'
    }
/*  indent: {
      exec: function indentLine(line, error) {
        let { errorMessage } = error;
        let foundIndent = errorMessage.match(/\d+/)[0];
        let expectedIndent = errorMessage.match(/(.*)(\d+)/)[2];
        let indentDelta = foundIndent - expectedIndent;

        let lineArr = line.split('');
        if (indentDelta > 0) {
          // found > expected, so remove whitespace
          lineArr.splice(0,indentDelta);
        } else {
          // found < expected, add whitespace
          lineArr = Array(Math.abs(indentDelta)).fill(' ').concat(lineArr);
        }

        console.log(`Found: ${foundIndent}, Expected: ${expectedIndent}`);
        console.log(`Old Line: ${line}`);
        line = lineArr.join('');
        console.log(`New Line: ${line}`);
        return line;
      }
    }*/
  }
}
