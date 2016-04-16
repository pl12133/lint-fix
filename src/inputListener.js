let { overwritePostfixFile } = require('./fsUtils');
let readline = require('readline');

export default function beginInputListening(batchPatchInfo) {
  //console.log('First Patch Errors Len: ' + batchPatchInfo.patches[0].errors.length);
  //let patches = batchPatchInfo.patches.filter(patch => patch.errors.length);
  let patches = batchPatchInfo.patches.filter(patch => patch.patchCount);

  function lineHandler(rl, initialPrompt) {
    let topLevelHandler = (line) => {
      let goodCommand = commandList.some((command) => {
        if (command.key.test(line)) {
          let { message, exec } = command;
          if (message) {
            console.log(message);
          }
          if (exec) {
            exec(rl);
          }
        }
      });

      rl.setPrompt(initialPrompt);
      rl.prompt();
    }
    let handler = topLevelHandler;
    let resetLineHandler = (newPrompt, newHandler) => {
      rl._events = Object.assign({}, rl._events, { line: [] });
      rl.setPrompt(newPrompt);
      rl.on('line', newHandler);
    }

    let help = {
      key: /^(h|help)$/,
      message: ' q - Quit \n' +
               ' s - Status\n' +
               ' v - View patches by file\n' +
               ' a - Apply patch\n'
    };
    let stat = {
      key: /^(s|status)$/,
      message: 'Status!',
      exec: function(rl) {
        patches.forEach((patch, index) => {
          let { fileName, patchCount, fixes } = patch;
          let fileNameShortened = fileName.replace(/.*(\/.*\/.*)/, '$1');
          console.log(` + ${index}: ${fileNameShortened} had ${patchCount} patches`);
        });
        console.log(` + ${patches.length} total files got patches`);
      } 
    };
    let viewPatch = {
      key: /^(v|view)$/,
      message: 'Viewing Files:',
      exec: (rl) => {
        patches.forEach((patch, index) => {
          let { fileName, patchCount, fixes } = patch;
          let fileNameShortened = fileName.replace(/.*(\/.*\/.*)/, '$1');
          console.log(` * ${index}: ${fileNameShortened}`);
        });

        //clearLineHandlers();
        //rl.on('line', (innerLine) => {
        let newPrompt = 'Select a file to view';
        console.log(newPrompt);
        resetLineHandler(newPrompt, (innerLine) => {
          let indexChoice = +innerLine;
          if (0 <= indexChoice && indexChoice < patches.length) {
            let choice = patches[indexChoice];
            let { fileName, patchCount, fixes } = choice; 
            let fixesByRule = fixes.reduce((memo, fix) => {
              memo[fix.rule] = memo[fix.rule] || 0;
              memo[fix.rule] += 1;
              return memo;
            }, {});

            console.log(`${choice.fileName} got ${patchCount} patches`);
            Object.keys(fixesByRule).forEach((rule) => {
              console.log(` +++ ${rule} had ${fixesByRule[rule]} fixes`);
            });
            resetLineHandler(initialPrompt, topLevelHandler);
          } else if (innerLine.indexOf('q') === 0) {
            console.log(' - No files viewed');
            resetLineHandler(initialPrompt, topLevelHandler);
          } else {
            console.log(' ? Invalid File, try again');
          }
          rl.prompt()
        });
      }
    }
    let applyPatch = {
      key: /^(a|apply)/,
      message: 'Applying Patch',
      exec: function(rl) {
        patches.forEach((patch, index) => {
          let { fileName, patchCount, fixes } = patch;
          let fileNameShortened = fileName.replace(/.*(\/.*\/.*)/, '$1');
          console.log(`  ${index}: ${fileNameShortened}`);
        });

        let newPrompt = 'Select a file to patch';
        console.log(newPrompt);
        resetLineHandler(newPrompt, (innerLine) => {
          let indexChoice = +innerLine;
          if (0 <= indexChoice && indexChoice < patches.length) {
            let choice = patches[indexChoice];
            let { fileName, patchCount } = choice; 
            console.log(` * Patching ${fileName} with ${patchCount} patches`);
            overwritePostfixFile(fileName);
            resetLineHandler(initialPrompt, topLevelHandler);
          } else if (innerLine.indexOf('a') === 0) {
            patches.forEach((patch) => {
              let { fileName, patchCount } = patch;
              console.log(` * Patching ${fileName} with ${patchCount} patches`);
              overwritePostfixFile(fileName);
            });
            resetLineHandler(initialPrompt, topLevelHandler);
          } else if (innerLine.indexOf('q') === 0) {
            console.log(' - No patches applied');
            resetLineHandler(initialPrompt, topLevelHandler);
          } else {
            console.log(' ? Invalid File, try again');
          }
          rl.prompt()
        });

      }
    }
    let quit = {
      key: /^(q|quit)$/,
      message: 'Goodbye',
      exec: function(rl) {
        rl.close();
      }
    };

    let commandList = [ stat, help, quit, viewPatch, applyPatch ];

    // Good options:
    // Status: which files are patched on how many lines
    // See patches by file
    // Apply patches by file
    // See patches by rule
    // See patches by line
    // Apply all patches

    return handler;
  }

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
  });
  

  const initialPrompt = 'lint-fix-cli > ';
  rl.setPrompt(initialPrompt);
  rl.prompt();

  let handler = lineHandler(rl, initialPrompt);
  rl.on('line', handler).on('close', function() {
    process.exit(0);
  });
}

