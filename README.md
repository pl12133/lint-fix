# What is it?

If you have just added a linter to an existing codebase, or you wish to migrate your codebase to another style; you may encounter hundreds of simple formatting errors. This package will use the output of your `npm run lint` command to build a set of patch files, let you review the patches, and then apply them. 

###### This project is obsolete and discontinued. ESLint introduced the "--fix" option in [1.4.0](http://eslint.org/blog/2015/09/eslint-v1.4.0-released). It is left active because the ESLint [Log Parser](https://github.com/pl12133/lint-fix/blob/master/src/lintLogParser.js) module may still be useful.

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
