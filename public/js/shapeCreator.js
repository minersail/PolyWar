const SHAPE_DIM = 100;
const CIRCLE_ID = 1;
const SQUARE_ID = 2;
const TRIANGLE_ID = 3;

function svgCircle(x, y, scale, document) {
	const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

	circle.setAttribute("cx", SHAPE_DIM / 2);
	circle.setAttribute("cy", SHAPE_DIM / 2);
	circle.setAttribute("r", 40 * scale);
	circle.setAttribute("style", `transform: translate(${ x * SHAPE_DIM }px, ${ y * SHAPE_DIM }px)`);

	return circle;
}

function svgSquare(x, y, scale, document) {
	const square = document.createElementNS("http://www.w3.org/2000/svg", "rect");

	square.setAttribute("x", (SHAPE_DIM - (80 * scale)) / 2);
	square.setAttribute("y", (SHAPE_DIM - (80 * scale)) / 2);
	square.setAttribute("width", 80 * scale);
	square.setAttribute("height", 80 * scale);
	square.setAttribute("style", `transform: translate(${ x * SHAPE_DIM }px, ${ y * SHAPE_DIM }px)`);
	
	return square;
}

function svgTriangle(x, y, scale, document) {
	const triangle = document.createElementNS("http://www.w3.org/2000/svg", "polygon");

	const x1 = 50 * scale + (1 - scale) * SHAPE_DIM / 2;
	const y1 = 11 * scale + (1 - scale) * SHAPE_DIM / 2;
	const x2 = 90 * scale + (1 - scale) * SHAPE_DIM / 2;
	const y2 = 80 * scale + (1 - scale) * SHAPE_DIM / 2;
	const x3 = 10 * scale + (1 - scale) * SHAPE_DIM / 2;
	const y3 = 80 * scale + (1 - scale) * SHAPE_DIM / 2;

	triangle.setAttribute("points", `${ x1 } ${ y1 }, ${ x2 } ${ y2 }, ${ x3 } ${ y3 }`);
	triangle.setAttribute("style", `transform: translate(${ x * SHAPE_DIM }px, ${ y * SHAPE_DIM }px)`);

	return triangle;
}