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
		this.moveTo(this.x + dx, this.y + dy);
	}

	moveTo(x, y) {
		this.x = x;
		this.y = y;
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
		const target = this.findTarget();
		if (target != null) {
			console.log(target);
			console.log(target.x, target.y);
			this.launchProjectiles(target.x, target.y);
		}
		else {
			const closest = this.findClosest();
			const moveDir = getDirection(closest.y - this.y, closest.x - this.x);
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

 	// Overridden
	findTarget() {
		return null;
	}

	// Overridden
	launchProjectiles(targetX, targetY) {}
}

class Projectile extends Unit {
	constructor(x, y, id, team) {
		super(x, y, id, team);
		document.getElementById(id).classList.add("projectile");
	}

	launch(targetX, targetY) {
		this.moveTo(targetX, targetY);
		window.setTimeout(() => { document.getElementById("arena").removeChild(document.getElementById(this.id)); }, 1000);
	}
}

class CircleFighter extends Fighter {
	constructor(x, y, team) {
		super(x, y, createCircle(x, y, 1, team), team);
	}

	findTarget() {
		return MAP.flat().find(x => x !== null && x.team !== this.team && dist(this.x, this.y, x.x, x.y) < 3) || null;
	}

	launchProjectiles(targetX, targetY) {
		const projectile = new CircleProjectile(this.x, this.y, this.team);
		window.setTimeout(() => { projectile.launch(targetX, targetY) }, 100);
	}
}

class SquareFighter extends Fighter {
	constructor(x, y, team) {
		super(x, y, createSquare(x, y, 1, team), team);
	}

	findTarget() {
		return this.checkSpot(this.y - 1, this.x - 1) || this.checkSpot(this.y - 1, this.x) || this.checkSpot(this.y - 1, this.x + 1) ||
		this.checkSpot(this.y, this.x + 1) || this.checkSpot(this.y + 1, this.x + 1) || this.checkSpot(this.y + 1, this.x) ||
		this.checkSpot(this.y + 1, this.x - 1) || this.checkSpot(this.y, this.x - 1) || null;
	}

	checkSpot(x, y) {
		return (MAP[y] && MAP[y][x] && MAP[y][x].team !== this.team) ? MAP[y][x] : null;
	}

	launchProjectiles(targetX, targetY) {
		let coords = [];

		if (this.checkSpot(this.y - 1, this.x - 1) || this.checkSpot(this.y - 1, this.x) || this.checkSpot(this.y - 1, this.x + 1)) {
			coords = [{ y: this.y - 1, x: this.x - 1 }, { y: this.y - 1, x: this.x }, { y: this.y - 1, x: this.x + 1 }];
		}
		else if (this.checkSpot(this.y, this.x + 1) || this.checkSpot(this.y + 1, this.x + 1)) {
			coords = [{ y: this.y - 1, x: this.x + 1 }, { y: this.y, x: this.x + 1 }, { y: this.y + 1, x: this.x + 1 }];
		}
		else if (this.checkSpot(this.y + 1, this.x) || this.checkSpot(this.y + 1, this.x - 1)) {
			coords = [{ y: this.y + 1, x: this.x - 1 }, { y: this.y + 1, x: this.x }, { y: this.y + 1, x: this.x + 1 }];
		}
		else if (this.checkSpot(this.y, this.x - 1)) {
			coords = [{ y: this.y - 1, x: this.x - 1 }, { y: this.y, x: this.x - 1 }, { y: this.y + 1, x: this.x - 1 }];
		}

		for (const coord of coords) {
			const projectile = new SquareProjectile(this.x, this.y, this.team);
			window.setTimeout(() => { projectile.launch(coord.x, coord.y); }, 100);
		}
	}
}

class TriangleFighter extends Fighter {
	constructor(x, y, team) {
		super(x, y, createTriangle(x, y, 1, team), team);
	}

	findTarget() {
		return MAP[this.y].find(x => x !== null && x.team !== this.team) ||
		(MAP.find(arr => arr[this.x] !== null && arr[this.x].team !== this.team) && 
			MAP.find(arr => arr[this.x] !== null && arr[this.x].team !== this.team)[this.x]) || null;
	}

	launchProjectiles(targetX, targetY) {
		const projectile = new TriangleProjectile(this.x, this.y, this.team);
		window.setTimeout(() => { projectile.launch(targetX, targetY) }, 100);
	}
}

class CircleProjectile extends Projectile {
	constructor(x, y, team) {
		super(x, y, createCircle(x, y, 0.25, team), team);
	}
}

class SquareProjectile extends Projectile {
	constructor(x, y, team) {
		super(x, y, createSquare(x, y, 0.25, team), team);
	}
}

class TriangleProjectile extends Projectile {
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

	document.getElementById("arena").insertBefore(circle, document.getElementById("bg").nextSibling);

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

	document.getElementById("arena").insertBefore(square, document.getElementById("bg").nextSibling);

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

	document.getElementById("arena").insertBefore(triangle, document.getElementById("bg").nextSibling);

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
	document.getElementById(a2.id).onclick = () => { a2.process(); };
	document.getElementById(a3.id).onclick = () => { a3.process(); };
	document.getElementById(a4.id).onclick = () => { a4.process(); };
}