


```
docker run --rm -v $(pwd):/src -u $(id -u):$(id -g) emscripten/emsdk emcc helloworld.cpp -o helloworld.js
```