deploy: 
	rm -rf deployment/**
	cp -r build/** deployment

clean:
	rm -rf build
	

