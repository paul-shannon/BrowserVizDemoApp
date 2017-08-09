build: webpack assemble buildPackage installPackage

assemble:
	(cd ./dist; m4 -P browservizdemo.html-template > browservizdemo.html)
	ls -l ./dist/browservizdemo.html

buildPackage:
	(cd ../../..; R CMD build --no-build-vignettes BrowserVizDemoApp)

installPackage:
	(cd ../../..; R CMD INSTALL `ls -at BrowserVizDemo_* | head -1`)

webpack:
	npm update
	webpack

test:
	(cd ./dist; pwd)

all: clean install run

clean:
	- rm -rf dist/
	- rm -rf node_modules

install:
	npm install
