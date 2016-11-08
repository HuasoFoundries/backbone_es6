VERSION = $(shell cat package.json | sed -n 's/.*"version": "\([^"]*\)",/\1/p')

SHELL = /usr/bin/env bash

default: build
.PHONY: ig_backbone ig_backgrid test build

 
build: ig_backbone ig_backgrid

version:
	@echo $(VERSION)

install: 
	npm install
	jspm install --quick


test:
	grunt karma

 

ig_backbone:
	jspm build ig_backbone dist/ig_backbone.js --format esm --skip-source-maps --config jspm.bbes6.build.json
	jspm build ig_backbone dist/ig_backbone.bundle.js  --skip-encode-names --global-name IGBackbone --config jspm.build.json
	
	
ig_backgrid:
	jspm build ig_backbone/ig_backgrid.js dist/ig_backgrid.js --format esm --skip-source-maps  --config jspm.bbes6.build.json
	jspm build ig_backbone/ig_backgrid.js dist/ig_backgrid.bundle.js  --skip-encode-names --global-name IGBackgrid --global-deps '{"jquery":"$$","underscore":"_"}' --config jspm.bbes6.build.json
	

 
update_version:
	@echo "Current version is " ${VERSION}
	@echo "Next version is " $(v)
	sed -i s/"$(VERSION)"/"$(v)"/g package.json

tag_and_push:
		git add --all
		git commit -a -m "Tag v $(v) $(m)"
		git tag v$(v)
		git push
		git push --tags

tag: update_version build tag_and_push		

	