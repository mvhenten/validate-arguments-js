GIT_MODIFIED_UPDATED = $(shell git status --porcelain | grep -E '.?[AM].+[.]js(on)?$$' | sed -e "s/^...//g")

tidy:
	@js-beautify -p -k -w120 -r -f $(GIT_MODIFIED_UPDATED)

lint:
	@./node_modules/jshint/bin/jshint --verbose $(GIT_MODIFIED_UPDATED)