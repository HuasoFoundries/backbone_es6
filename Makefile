VERSION = $(shell cat package.json | sed -n 's/.*"version": "\([^"]*\)",/\1/p')

SHELL = /usr/bin/env bash

default: build
.PHONY: backbone_es6  test build backbone_es6_bundle 

 
build: backbone_es6  backbone_es6_bundle 

version:
	@echo $(VERSION)

install: 
	npm install
	jspm install


test:
	grunt karma

 

backbone_es6:
	jspm build backbone_es6 dist/backbone.es6.js --format esm --skip-source-maps --skip-encode-names --config jspm.build.esm.json --global-deps '{"jquery":"$$", "underscore":"_"}'

backbone_es6_bundle:	
	jspm build backbone_es6 dist/backbone.umd.js --format umd --skip-encode-names --global-name BackboneES6 --config jspm.build.amd.json 



 
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