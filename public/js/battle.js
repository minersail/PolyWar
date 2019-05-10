const TILE_SIZE = SHAPE_DIM;

const MAP_HEIGHT = 6;
const MAP_WIDTH = 6;

const MAP = Array(MAP_HEIGHT).fill().map(() => Array(MAP_WIDTH).fill(null));
const COLORS = ["blue", "red"];

let global_id = 0;
let FIGHTERS = [];

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
	maxHealth = 100;
	health = 100;

	constructor(x, y, id, team, health) {
		super(x, y, id, team);
		MAP[y][x] = this;
		this.health = health;
		this.maxHealth = health;
	}

	move(dx, dy) {
		MAP[this.y][this.x] = null;
		super.move(dx, dy);
		MAP[this.y][this.x] = this;
	}

	process() {
		const target = this.findTarget();
		if (target != null) {
			this.launchProjectiles(target.x, target.y);
		}
		else {
			const closest = this.findClosest();
			const moveDir = getDirection(closest.y - this.y, closest.x - this.x);
			if (!MAP[this.y + moveDir.y][this.x + moveDir.x]) {
				this.move(moveDir.x, moveDir.y);
			}
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

	damage(amt) {
		this.health -= amt;
		if (this.health <= 0) {
			MAP[this.y][this.x] = null;
			FIGHTERS = FIGHTERS.filter(f => f.id !== this.id);
			document.getElementById("arena").removeChild(document.getElementById(this.id));
			checkWin();
			return;
		}

		document.getElementById(this.id).style.opacity = this.health / this.maxHealth;
	}

 	// Overridden
	findTarget() {
		return null;
	}

	// Overridden
	launchProjectiles(targetX, targetY) {}
}

class Projectile extends Unit {
	damage = 0;

	constructor(x, y, id, team, damage) {
		super(x, y, id, team);
		document.getElementById(id).classList.add("projectile");
		this.damage = damage;
	}

	launch(targetX, targetY) {
		this.moveTo(targetX, targetY);
		window.setTimeout(() => {
			if (MAP[targetY][targetX] && MAP[targetY][targetX].team !== this.team) {
				MAP[targetY][targetX].damage(this.damage);
			}
			document.getElementById("arena").removeChild(document.getElementById(this.id));
		}, 1000);
	}
}

class CircleFighter extends Fighter {
	constructor(x, y, team) {
		super(x, y, createCircle(x, y, 1, team), team, 150);
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
		super(x, y, createSquare(x, y, 1, team), team, 400);
	}

	findTarget() {
		return this.checkSpot(this.x - 1, this.y - 1) || this.checkSpot(this.x - 1, this.y) || this.checkSpot(this.x - 1, this.y + 1) ||
		this.checkSpot(this.x, this.y + 1) || this.checkSpot(this.x + 1, this.y + 1) || this.checkSpot(this.x + 1, this.y) ||
		this.checkSpot(this.x + 1, this.y - 1) || this.checkSpot(this.x, this.y - 1) || null;
	}

	checkSpot(x, y) {
		return (MAP[y] && MAP[y][x] && MAP[y][x].team !== this.team) ? MAP[y][x] : null;
	}

	launchProjectiles(targetX, targetY) {
		let coords = [];

	 	if (this.checkSpot(this.x, this.y - 1)) {
			coords = [{ y: this.y - 1, x: this.x - 1 }, { y: this.y - 1, x: this.x }, { y: this.y - 1, x: this.x + 1 }];
		}
		else if (this.checkSpot(this.x + 1, this.y) || this.checkSpot(this.x + 1, this.y - 1)) {
			coords = [{ y: this.y - 1, x: this.x + 1 }, { y: this.y, x: this.x + 1 }, { y: this.y + 1, x: this.x + 1 }];
		}
		else if (this.checkSpot(this.x, this.y + 1) || this.checkSpot(this.x + 1, this.y + 1)) {
			coords = [{ y: this.y + 1, x: this.x - 1 }, { y: this.y + 1, x: this.x }, { y: this.y + 1, x: this.x + 1 }];
		}
		else if (this.checkSpot(this.x - 1, this.y - 1) || this.checkSpot(this.x - 1, this.y) || this.checkSpot(this.x - 1, this.y + 1)) {
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
		super(x, y, createTriangle(x, y, 1, team), team, 100);
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
		super(x, y, createCircle(x, y, 0.25, team), team, 50);
	}
}

class SquareProjectile extends Projectile {
	constructor(x, y, team) {
		super(x, y, createSquare(x, y, 0.25, team), team, 50);
	}
}

class TriangleProjectile extends Projectile {
	constructor(x, y, team) {
		super(x, y, createTriangle(x, y, 0.25, team), team, 100);
	}
}

function createCircle(x, y, scale, team) {
	const circle = svgCircle(x, y, scale, document);
	const id = `unit${ global_id++ }`;

	circle.setAttribute("id", id);
	circle.classList.add("unit");
	circle.classList.add(COLORS[team]);

	document.getElementById("arena").insertBefore(circle, document.getElementById("bg").nextSibling);

	return id;
}

function createSquare(x, y, scale, team) {
	const square = svgSquare(x, y, scale, document);
	const id = `unit${ global_id++ }`;

	square.setAttribute("id", id);
	square.classList.add("unit");
	square.classList.add(COLORS[team]);

	document.getElementById("arena").insertBefore(square, document.getElementById("bg").nextSibling);

	return id;
}

function createTriangle(x, y, scale, team) {
	const triangle = svgTriangle(x, y, scale, document);
	const id = `unit${ global_id++ }`;

	triangle.setAttribute("id", id);
	triangle.classList.add("unit");
	triangle.classList.add(COLORS[team]);

	document.getElementById("arena").insertBefore(triangle, document.getElementById("bg").nextSibling);

	return id;
}

function dist(x1, y1, x2, y2) {
	return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function getDirection(dx, dy) {
	let angle = Math.atan2(dy, dx) / Math.PI * 180;
	if (angle < 0) angle += 360;

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
		return { x: 0, y: 1}
	}
}

let player1 = [0, 0, 0, 0, 1, 3, 3, 2, 0, 0, 2, 1];
let player2 = [1, 3, 3, 0, 0, 0, 0, 0, 1, 2, 2, 0];

window.onload = function() {
	player1 = player1.map((x, i) =>
		x === CIRCLE_ID ? { type: CIRCLE_ID, x: i % 6, y: Math.floor(i / 6) + 4, team: 0 } :
		x === SQUARE_ID ? { type: SQUARE_ID, x: i % 6, y: Math.floor(i / 6) + 4, team: 0 } :		
		x === TRIANGLE_ID ? { type: TRIANGLE_ID, x: i % 6, y: Math.floor(i / 6) + 4, team: 0 } : null
	).filter(x => x !== null);
	
	player2 = player2.map((x, i) =>
		x === CIRCLE_ID ? { type: CIRCLE_ID, x: 5 - (i % 6), y: 1 - Math.floor(i / 6), team: 1 } :
		x === SQUARE_ID ? { type: SQUARE_ID, x: 5 - (i % 6), y: 1 - Math.floor(i / 6), team: 1 } :		
		x === TRIANGLE_ID ? { type: TRIANGLE_ID, x: 5 - (i % 6), y: 1 - Math.floor(i / 6), team: 1 } : null
	).filter(x => x !== null);

	FIGHTERS = player1.flatMap((x, i) => [x, player2[i]]).map(x => 
		x.type === CIRCLE_ID ? new CircleFighter(x.x, x.y, x.team) :
		x.type === SQUARE_ID ? new SquareFighter(x.x, x.y, x.team) :
		x.type === TRIANGLE_ID ? new TriangleFighter(x.x, x.y, x.team) : null	
	);

	window.setTimeout(() => {
		queueAction(0);
	}, 100);
}

function queueAction(index) {
	if (FIGHTERS[index]) {
		FIGHTERS[index].process();
	}

	window.setTimeout(() => {
		queueAction((index + 1) % FIGHTERS.length);
	}, 1000);
}

function checkWin() {
	if (FIGHTERS.length === 0) {
		document.getElementById("winText").innerText = "Tie!";
	}
	else if (FIGHTERS.reduce((acc, x) => x.team === FIGHTERS[0].team && acc, true)) {
		document.getElementById("winText").innerText = FIGHTERS[0].team === 0 ? "You win!" : "You lose!";
	}
}