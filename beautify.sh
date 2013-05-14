#!/bin/sh
THIS_DIRNAME=`dirname $0`;
COMMAND='./node_modules/js-beautify/js/bin/js-beautify.js';
for f in `git status -s | grep -E '^.?[MA].+\.js' | sed -e s/^..//g`;
    do echo "$COMMAND -p -k -w120 -r -f $f"\
        && OK=`$COMMAND -p -k -w120 -r -f $f`;
done;
