deploy: build/index.html
	cp build/index.html .

build/index.html: src/tool.html build/tool.min.css build/tool.min.js
	py ./package.py

build/tool.min.js: src/tool.js
	minify src/tool.js > build/tool.min.js
	
build/tool.min.css: src/tool.css
	minify src/tool.css > build/tool.min.css

clean:
	rm -f build/**
	

