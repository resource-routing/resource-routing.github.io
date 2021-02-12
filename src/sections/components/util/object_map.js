export function centerMap(x, y, z) {
	const node = document.getElementById("object_map");
	if (node) {
		node.src = "";
		window.setTimeout(() => {
			changeSrc(x, y, z);
		}, 10);
	}
	// // if (node)
	// // 	console.log(node.contentWindow || node.contentDocument);
	// //return searchZoomLevel(node);
	// return null;
}

function changeSrc(x, y, z) {

	const node = document.getElementById("object_map");
	if (!node.src || !node.src.includes("objmap.zeldamods.org")) {
		node.src = `https://objmap.zeldamods.org/#/map/z${z},${x},${y}`;
	} else {
		window.setTimeout(() => {
			changeSrc(x, y, z);
		}, 10);
	}
}

// function searchZoomLevel(node) {
// 	if (!node) return null;
// 	if (node.className) {
// 		const classList = node.className.split(" ");
// 		for (let i = 0; i < classList.length; i++) {
// 			if (classList[i].startsWith("zoom-level-")) {
// 				return Number(classList[i].substring("zoom-level-".length));
// 			}
// 		}
// 	}

// 	for (let i = 0; i < node.children.length; i++) {
// 		const r = searchZoomLevel(node.children[i]);
// 		if (r !== null) return r;
// 	}
// 	return null;

// }