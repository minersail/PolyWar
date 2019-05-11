const SHAPE_DIM = 100;
const CIRCLE_ID = 1;
const SQUARE_ID = 2;
const TRIANGLE_ID = 3;
const THUMBNAIL_SCALE = 0.25;

function svgCircle(x, y, scale, document) {
	const boxSize = scale * SHAPE_DIM;
	const center = boxSize / 2;
	const size = 40 * scale;
	
	if (document === undefined) {
		return `<circle
		cx="${ center }"
		cy="${ center }"
		r="${ size }"
		style="transform: translate(${ x * boxSize }px, ${ y * boxSize }px)"></circle>`
	}

	const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

	circle.setAttribute("cx", center);
	circle.setAttribute("cy", center);
	circle.setAttribute("r", size);
	circle.setAttribute("style", `transform: translate(${ x * boxSize }px, ${ y * boxSize }px)`);

	return circle;
}

function svgSquare(x, y, scale, document) {
	const boxSize = scale * SHAPE_DIM;
	const center = (boxSize - (80 * scale)) / 2;
	const length = 80 * scale;

	if (document === undefined) {
		return `<rect
		x="${ center }"
		y="${ center }"
		width="${ length }"
		height="${ length }"
		style="transform: translate(${ x * boxSize }px, ${ y * boxSize }px)"></rect>`;
	}

	const square = document.createElementNS("http://www.w3.org/2000/svg", "rect");

	square.setAttribute("x", center);
	square.setAttribute("y", center);
	square.setAttribute("width", length);
	square.setAttribute("height", length);
	square.setAttribute("style", `transform: translate(${ x * boxSize }px, ${ y * boxSize }px)`);
	
	return square;
}

function svgTriangle(x, y, scale, document) {
	const boxSize = scale * SHAPE_DIM;

	const x1 = 50 * scale + (1 - scale) * boxSize / 2;
	const y1 = 11 * scale + (1 - scale) * boxSize / 2;
	const x2 = 90 * scale + (1 - scale) * boxSize / 2;
	const y2 = 80 * scale + (1 - scale) * boxSize / 2;
	const x3 = 10 * scale + (1 - scale) * boxSize / 2;
	const y3 = 80 * scale + (1 - scale) * boxSize / 2;
	
	if (document === undefined) {
		return `<polygon 
		points="${ x1 } ${ y1 }, ${ x2 } ${ y2 }, ${ x3 } ${ y3 }"
		style="transform: translate(${ x * boxSize }px, ${ y * boxSize }px)"></polygon>`;
	}

	const triangle = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
	triangle.setAttribute("points", `${ x1 } ${ y1 }, ${ x2 } ${ y2 }, ${ x3 } ${ y3 }`);
	triangle.setAttribute("style", `transform: translate(${ x * boxSize }px, ${ y * boxSize }px)`);

	return triangle;
}

function createThumbnail(units) {
	return units.reduce((acc, unit, i) => {
		let x = i % 6;
		let y = Math.floor(i / 6);

		if (unit === CIRCLE_ID) {
			return acc + svgCircle(x, y, THUMBNAIL_SCALE);
		}
		else if (unit === SQUARE_ID) {
			return acc + svgSquare(x, y, THUMBNAIL_SCALE);
		}
		else if (unit === TRIANGLE_ID) {
			return acc + svgTriangle(x, y, THUMBNAIL_SCALE);
		}

		return acc;
	}, `<svg width="${ SHAPE_DIM * 6 * THUMBNAIL_SCALE }" height="${ SHAPE_DIM * 2 * THUMBNAIL_SCALE }">`) + "</svg>";
}

module.exports = {
	createThumbnail: createThumbnail,
}