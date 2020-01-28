# Blob Generator

Generates randomly shaped smooth blobs in javascript. These blobs are represented as SVG paths utilizing cubic bezier curves to create to outline of the shape. Parameters are editable from the generator allowing for greater customizability and a wider range of generation. Path points and handle coordinates are generated from a [polar graph](https://www.desmos.com/calculator/qaesyuxix3) with path coordinates being taken from g(x) and handle coordinates being taken from h(x).

These blobs can be used in many ways within webpages to create infinite unique shapes that are rounded and smooth. This program was used in the creation of the [UofT AI website](https://uoft.ai/) where I used these blobs as asteroids in the background of the webpage.

### Example blobs:
![blob 1](https://i.gyazo.com/146962fdaba1efd2fb849b6d9871a93f.png)
![blob 2](https://i.gyazo.com/35da2233bd17e9934a3d67fc68dcaf8c.png)

With a very high point count you can see the underlying generating functions from (https://www.desmos.com/calculator/qaesyuxix3)

![high point count 1](https://i.gyazo.com/7a4e0dac15c90f17e91854cd38cb5ad9.png)
![high point count 2](https://i.gyazo.com/379406ea6b864e49ff1ef013be2e6988.png)

---

### Further Reading:
https://www.desmos.com/calculator/qaesyuxix3

http://graphics.pixar.com/people/derose/publications/CubicClassification/paper.pdf

https://pomax.github.io/bezierinfo/#canonical 

https://stackoverflow.com/questions/3587704/good-way-to-procedurally-generate-a-blob-graphic-in-2d

https://gamedev.stackexchange.com/questions/34374/how-to-render-metaballs

https://www.gamedev.net/articles/programming/graphics/exploring-metaballs-and-isosurfaces-in-2d-r2556/

https://gis.stackexchange.com/questions/24827/smoothing-polygons-in-contour-map

https://stackoverflow.com/questions/47068504/where-to-find-python-implementation-of-chaikins-corner-cutting-algorithm

https://sighack.com/post/chaikin-curves

https://stackoverflow.com/questions/28770110/how-to-prevent-loops-in-cubic-bezier-curves
