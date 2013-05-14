#!/bin/sh
THIS_DIRNAME=`dirname $0`;
for f in `git status -s | grep -E '^.?[MA].+\.js' | sed -e s/^..//g`;
    do echo "js-beautify -p -k -w120 -r -f $f"\
        && OK=`js-beautify -p -k -w120 -r -f $f`;
done;
