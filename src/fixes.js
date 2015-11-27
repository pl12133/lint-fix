
let configureFixes = configureSemistandardFixes;
export default configureFixes;

function configureSemistandardFixes() {
  return {
    // Place semicolon at end of line
    semi: {
      lineTest: /./,
      search: /$/,
      replace: ';'
    },
    spaceBeforeFunctionParen: {
      lineTest: /./,
      search: /^(.*)\((.*)\) {$/,
      replace: function(match, $1, $2, offset, original) {
        return `${$1} (${$2}) {`;
      }
    },
    quotes: {
      lineTest: /./,
      search: /"/g,
      replace: '\''
    },
    noTrailingSpaces: {
      lineTest: /./,
      search: /^(.*?)\s+$/,
      replace: '$1'
    },
    spacedComment: {
      lineTest: /./,
      search: /^(.*)(\/{2,})(.*)$/,
      replace: '$1$2 $3'
    },
    noFloatingDecimal: {
      lineTest: /./,
      search: /^(.*)(\.\d+)(.*)$/,
      replace: function(match, $1, $2, $3) {
        return $1 + '0' + $2 + $3;
      }
    },
    commaDangle: {
      lineTest: /./,
      search: /^(.*),(.*)$/,
      replace: '$1$2'
    }

  }
}
