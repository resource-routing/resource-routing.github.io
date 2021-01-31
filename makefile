build/tool.min.html: build/tool.packaged.html
	minify build/tool.packaged.html > build/tool.min.html

build/tool.packaged.html: src/tool.html src/tool.css src/tool.js
	py ./package.py

deploy: build/tool.min.html
	cp -T build/tool.min.html index.html

clean:
	rm -f build/**
	

