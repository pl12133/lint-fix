
# Installation

clone

    git clone https://github.com/pl12133/lint-fix

install

    cd lint-fix
    npm install

# Setup 
Set NODE_PATH

    export NODE_PAHT=/path/to/your/project

Start

    npm start

*Make sure you don't have a file called 'eslint-fix-log.txt' in your NODE_PATH directory as that will get overwritten*

# Add More Fixes

Fixes can be found in `src/fixes.js`. Simply add a pair of 'search' and 'replace' values to a camel-case of the rule name that you want to fix.
