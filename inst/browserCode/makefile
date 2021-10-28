default:
	@echo targets: build.js, install.pkg, htmlOnly

build.js: 
	(cd ./src; m4 -P bvDemo.pre > ../dist/bvDemo.html)
	ls -l ./dist/bvDemo.html

install.pkg:
	(cd ../..; R CMD INSTALL . )

htmlOnly: build.js
	open dist/bvDemo.html
	@echo now run 'test_app()' in the javascript console


