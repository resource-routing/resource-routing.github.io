build: 
	npm run build

deploy: build/tool.min.html
	cp -T build/tool.min.html index.html

clean:
	rm -f build/**
	

