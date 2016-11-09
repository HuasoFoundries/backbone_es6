VERSION = $(shell cat package.json | sed -n 's/.*"version": "\([^"]*\)",/\1/p')

SHELL = /usr/bin/env bash

default: build
.PHONY: ig_backbone ig_backgrid test build ig_backbone_bundle ig_backgrid_bundle

 
build: ig_backbone ig_backgrid ig_backbone_bundle ig_backgrid_bundle

version:
	@echo $(VERSION)

install: 
	npm install
	jspm install


test:
	grunt karma

 

ig_backbone:
	jspm build ig_backbone dist/ig_backbone.js --format esm --skip-source-maps --skip-encode-names --config jspm.build.esm.json

ig_backbone_bundle:	
	jspm build ig_backbone dist/ig_backbone.bundle.js --format umd --skip-encode-names --global-name IGBackbone --config jspm.build.amd.json

	
	
ig_backgrid:
	jspm build ig_backbone/ig_backgrid.js dist/ig_backgrid.js --format esm --skip-source-maps --skip-encode-names --config jspm.build.esm.json

ig_backgrid_bundle:	
	jspm build ig_backbone/ig_backgrid.js dist/ig_backgrid.bundle.js  --format umd --skip-encode-names --global-name IGBackgrid --global-deps '{"jquery":"$$","underscore":"_"}' --config jspm.build.esm.json
	

 
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

release: update_version tag_and_push