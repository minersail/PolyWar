const EDIT_HEIGHT = 2;
const EDIT_WIDTH = 6;

let SHAPES;

window.onload = function() {
	document.getElementById("lineup").onclick = detectClick;

	SHAPES = $("#units").val().split(",").map(x => parseInt(x));
	SHAPES.forEach((id, i) => {
		if (id === 0) return;

		let x = i % 6;
		let y = Math.floor(i / 6);

		loadShape(x, y, id);
	});

	$("#editName").css("width", $("#editName").val().length * 0.7 + "em");

	document.getElementById("editName").onchange = function() {
		$("#editName").css("width", $("#editName").val().length * 0.7 + "em");
	}

	document.getElementById("finishEdit").onclick = submitTeam;
}

function detectClick(e) {
	$("#grid path").css("stroke", "var(--accentred)");

	const x = Math.floor((e.offsetX) / SHAPE_DIM);
	const y = Math.floor((e.offsetY) / SHAPE_DIM);

	const index = y * EDIT_WIDTH + x;

	const prevID = SHAPES[index];
	const newID = (prevID + 1) % 4;

	if (prevID !== 0) {		
		document.getElementById("lineup").removeChild(document.getElementById(`unit${ index }`));		
	}

	if (newID !== 0) {
		loadShape(x, y, newID);
	}

	SHAPES[index] = newID;
}

function loadShape(x, y, id) {
	const index = y * EDIT_WIDTH + x;
	let newShape;
		
	if (id === CIRCLE_ID) {
		newShape = svgCircle(x, y, 1, document);
	}
	else if (id === SQUARE_ID) {
		newShape = svgSquare(x, y, 1, document);
	}
	else if (id === TRIANGLE_ID) {
		newShape = svgTriangle(x, y, 1, document);	
	}
	newShape.setAttribute("id", `unit${ index }`);
	newShape.classList.add("editUnit");
	document.getElementById("lineup").appendChild(newShape);
}

function submitTeam() {
	$.post("/api/edit_squadron", {
		id: window.location.href.split("/")[window.location.href.split("/").length - 1],
		name: $("#editName").val(),
		units: SHAPES.join(","),
	}, function(res) {
		if (res.error === false) {
			$("#grid path").css("stroke", "var(--midcolor)");
		}
	});
}