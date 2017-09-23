VERSION = $(shell cat package.json | sed -n 's/.*"version": "\([^"]*\)",/\1/p')

SHELL = /usr/bin/env bash

default: build
.PHONY: backbone_es6  test build backbone_bundle backbone_min

 
build: backbone_es6  backbone_bundle backbone_min

version:
	@echo $(VERSION)

install: 
	npm install
	jspm install


test:
	grunt karma

 

backbone_es6:
	$$(npm bin)/jspm build backbone_es6 dist/backbone.es6.js --format esm --skip-source-maps --skip-encode-names 

backbone_bundle:	
	$$(npm bin)/jspm build backbone_es6 dist/backbone.js --format umd --global-name BackboneES6 
	

backbone_min:		
	$$(npm bin)/jspm build backbone_es6 dist/backbone.min.js --format umd -m --global-name BackboneES6 



 
update_version:
ifeq ($(shell expr "${CURRENT_MAJOR}" \> "$(NEXT_MAJOR)"),1)
	$(error "v" parameter is lower than current version ${VERSION})
endif
ifeq ($(shell expr "${CURRENT_MINOR}" \> "$(NEXT_MINOR)"),1)
	$(error "v" parameter is lower than current version ${VERSION})
endif
ifeq ($(shell expr "${CURRENT_HOTFIX}" \> "$(NEXT_HOTFIX)"),1)
	$(error "v" parameter is lower than current version ${VERSION})
endif
ifeq ($(v),)
	$(error v is undefined)
endif
ifeq (${VERSION},$(v))
	$(error v is already the current version)
endif
	@echo "Current version is " ${VERSION}
	@echo "Next version is " $(v)
	sed -i s/"$(VERSION)"/"$(v)"/g package.json

check_version:
	$(eval SPLIT_VERSION = $(subst ., ,${VERSION}))
	$(eval NEXT_VERSION := $(subst ., ,${v}))
	$(eval CURRENT_MAJOR := $(word 1,$(SPLIT_VERSION)))
	$(eval CURRENT_MINOR := $(word 2,$(SPLIT_VERSION)))
	$(eval CURRENT_HOTFIX := $(word 3,$(SPLIT_VERSION)))
	$(eval NEXT_MAJOR := $(word 1,$(NEXT_VERSION)))
	$(eval NEXT_MINOR := $(word 2,$(NEXT_VERSION)))
	$(eval NEXT_HOTFIX := $(word 3,$(NEXT_VERSION)))


tag_and_push:
		git add --all
		git commit -a -m "Tag v $(v) $(m)"
		git tag v$(v)
		git push
		git push --tags

tag: build release

release: test check_version update_version tag_and_push	
