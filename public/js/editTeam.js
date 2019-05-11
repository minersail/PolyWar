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

		let newShape = loadShape(x, y, id, document);
		
		newShape.setAttribute("id", `unit${ i }`);
		newShape.classList.add("editUnit");
		document.getElementById("lineup").appendChild(newShape);
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
		let newShape = loadShape(x, y, newID, document);
		
		newShape.setAttribute("id", `unit${ index }`);
		newShape.classList.add("editUnit");
		document.getElementById("lineup").appendChild(newShape);
	}

	SHAPES[index] = newID;
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