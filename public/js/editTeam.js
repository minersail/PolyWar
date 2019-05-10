const EDIT_HEIGHT = 2;
const EDIT_WIDTH = 8;

const SHAPES = Array(EDIT_HEIGHT * EDIT_WIDTH).fill(0);

window.onload = function() {
	document.getElementById("lineup").onclick = detectClick;
}

function detectClick(e) {
	const x = Math.floor((e.offsetX) / SHAPE_DIM);
	const y = Math.floor((e.offsetY) / SHAPE_DIM);

	const index = y * EDIT_WIDTH + x;

	const prevElement = SHAPES[index];
	const newElement = (prevElement + 1) % 4;

	console.log(x + " " + y);
	if (prevElement !== 0) {		
		document.getElementById("lineup").removeChild(document.getElementById(`unit${ index }`));		
	}

	if (newElement !== 0) {
		let newShape;
		
		if (newElement === CIRCLE_ID) {
			newShape = svgCircle(x, y, 1, document);
		}
		else if (newElement === SQUARE_ID) {
			newShape = svgSquare(x, y, 1, document);
		}
		else if (newElement === TRIANGLE_ID) {
			newShape = svgTriangle(x, y, 1, document);		
		}
		newShape.setAttribute("id", `unit${ index }`);
		newShape.classList.add("editUnit");
		document.getElementById("lineup").appendChild(newShape);
	}

	SHAPES[index] = newElement;
}

function submitTeam() {
	$.post("/api/createSquadron", {
		
	})
}