const TILE_SIZE = 100;
const MAP_HEIGHT = 8;
const MAP_WIDTH = 8;

const MAP = Array(MAP_HEIGHT).fill().map(() => Array(MAP_WIDTH).fill(null));
const COLORS = ["red", "green", "blue"];

let global_id = 0;

class Unit {
	x = 0;
	y = 0;
	id;
	team;

	constructor(x, y, id, team) {
		this.x = x;
		this.y = y;
		this.id = id;
		this.team = team;
	}

	move(dx, dy) {
		this.x += dx;
		this.y += dy;
		document.getElementById(this.id).style.transform = `translate(${ this.x * TILE_SIZE }px, ${ this.y * TILE_SIZE }px)`;
	}
}

class Fighter extends Unit {
	constructor(x, y, id, team) {
		super(x, y, id, team);
		MAP[y][x] = this;
	}

	move(dx, dy) {
		MAP[this.y][this.x] = null;
		super.move(dx, dy);
		MAP[this.y][this.x] = this;
	}

	process() {
		const target = this.findClosest();

		if (dist(this.x, this.y, target.x, target.y) < 0) {

		}
		else {
			const moveDir = getDirection(target.y - this.y, target.x - this.x);
			this.move(moveDir.x, moveDir.y);
		}
	}

	findClosest() {
		const flattened = MAP.flat();
		const index = flattened.reduce((acc, v, i) => 
			v === null || v.team === this.team ? acc :
			flattened[acc] === null ? i : 
			dist(this.x, this.y, v.x, v.y) < dist(this.x, this.y, flattened[acc].x, flattened[acc].y) ? i : acc, 0);

		return MAP[Math.floor(index / MAP_WIDTH)][index % MAP_WIDTH];
	}
}

class CircleFighter extends Fighter {
	constructor(x, y, team) {
		super(x, y, createCircle(x, y, 1, team), team);
	}
}

class SquareFighter extends Fighter {
	constructor(x, y, team) {
		super(x, y, createSquare(x, y, 1, team), team);
	}
}

class TriangleFighter extends Fighter {
	constructor(x, y, team) {
		super(x, y, createTriangle(x, y, 1, team), team);
	}
}

class CircleProjectile extends Unit {
	constructor(x, y, team) {
		super(x, y, createCircle(x, y, 0.25, team), team);
	}
}

class SquareProjectile extends Unit {
	constructor(x, y, team) {
		super(x, y, createSquare(x, y, 0.25, team), team);
	}
}

class TriangleProjectile extends Unit {
	constructor(x, y, team) {
		super(x, y, createTriangle(x, y, 0.25, team), team);
	}
}

function createCircle(x, y, scale, team) {
	const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	const id = `unit${ global_id++ }`;

	circle.setAttribute("id", id);
	circle.setAttribute("cx", TILE_SIZE / 2);
	circle.setAttribute("cy", TILE_SIZE / 2);
	circle.setAttribute("r", 40 * scale);
	circle.setAttribute("style", `transform: translate(${ x * TILE_SIZE }px, ${ y * TILE_SIZE }px)`);
	circle.classList.add("unit");
	circle.classList.add(COLORS[team]);

	document.getElementById("arena").appendChild(circle);

	return id;
}

function createSquare(x, y, scale, team) {
	const square = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	const id = `unit${ global_id++ }`;

	square.setAttribute("id", id);
	square.setAttribute("x", (TILE_SIZE - (80 * scale)) / 2);
	square.setAttribute("y", (TILE_SIZE - (80 * scale)) / 2);
	square.setAttribute("width", 80 * scale);
	square.setAttribute("height", 80 * scale);
	square.setAttribute("style", `transform: translate(${ x * TILE_SIZE }px, ${ y * TILE_SIZE }px)`);
	square.classList.add("unit");
	square.classList.add(COLORS[team]);

	document.getElementById("arena").appendChild(square);

	return id;
}

function createTriangle(x, y, scale, team) {
	const triangle = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
	const id = `unit${ global_id++ }`;

	const x1 = 50 * scale + (1 - scale) * TILE_SIZE / 2;
	const y1 = 11 * scale + (1 - scale) * TILE_SIZE / 2;
	const x2 = 90 * scale + (1 - scale) * TILE_SIZE / 2;
	const y2 = 80 * scale + (1 - scale) * TILE_SIZE / 2;
	const x3 = 10 * scale + (1 - scale) * TILE_SIZE / 2;
	const y3 = 80 * scale + (1 - scale) * TILE_SIZE / 2;

	triangle.setAttribute("id", id);
	triangle.setAttribute("points", `${ x1 } ${ y1 }, ${ x2 } ${ y2 }, ${ x3 } ${ y3 }`);
	triangle.setAttribute("style", `transform: translate(${ x * TILE_SIZE }px, ${ y * TILE_SIZE }px)`);
	triangle.classList.add("unit");
	triangle.classList.add(COLORS[team]);

	document.getElementById("arena").appendChild(triangle);

	return id;
}

function dist(x1, y1, x2, y2) {
	return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function getDirection(dx, dy) {
	const angle = Math.atan2(dy, dx) / Math.PI * 180;

	if (angle < 22.5) { // "S";
		return { x: 0, y: 1}
	}
	else if (angle < 67.5) { // "SE";
		return { x: 1, y: 1 }
	}
	else if (angle < 112.5) { // "E";
		return { x: 1, y: 0 }
	}
	else if (angle < 157.5) { // "NE";
		return { x: 1, y: -1 }
	}
	else if (angle < 202.5) { // "N";
		return { x: 0, y: -1 }
	}
	else if (angle < 247.5) { // "NW";
		return { x: -1, y: -1 }
	}
	else if (angle < 292.5) { // "W";
		return { x: -1, y: 0 }
	}
	else if (angle < 337.5) { // "SW";
		return { x: -1, y: 1 }
	}
	else { // "S";

	}
}

window.onload = function() {
	e1 = new CircleFighter(0, 0, 0);
	e2 = new TriangleFighter(1, 0, 0);
	e4 = new SquareFighter(2, 0, 0);
	e3 = new CircleFighter(3, 0, 0);
	a1 = new CircleFighter(0, 7, 1);
	a2 = new TriangleFighter(1, 7, 1);
	a4 = new SquareFighter(2, 7, 1);
	a3 = new CircleFighter(3, 7, 1);
	// c5 = new TriangleProjectile(3, 2, 0);
	// c6 = new CircleProjectile(4, 2, 0);
	// c7 = new SquareProjectile(1, 0, 0);

	// window.setTimeout(() => {
	// 	c1.move(2, 2);
	// 	window.setTimeout(() => {
	// 		c2.move(2, 0);
	// 	}, 1000);	
	// }, 1000);

	document.getElementById(e2.id).onclick = () => { e2.move(1, 1) };
	document.getElementById(a1.id).onclick = () => { a1.process(); };
}