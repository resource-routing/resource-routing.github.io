export function calc(...array) {
	return `calc(${array.join(" ")})`;
}

export function min(a, b) {
	return `min(${a}, ${b})`;
}

export function max(a, b) {
	return `max(${a}, ${b})`;
}


export default function layout(sideCollapsed, resourceCollapsed) {
	//const resourceCollapsed = false;
	// const sideCollapsed = true;

	const windowWidth = "100vw";
	const windowHeight = "100vh";
	const HEADER_HEIGHT = "3rem";
	const FOOTER_HEIGHT = "2rem";

	const SIDE_MIN_WIDTH = "16rem";
	const SIDE_WIDTH = "30%";
	const SIDE_MAX_WIDTH = "24rem";

	const SIDE_COLLAPSE_WIDTH = "3rem";

	const SIDE_HEADER_HEIGHT = "2rem";

	const RESOURCE_MIN_HEIGHT = "12rem";
	const RESOURCE_HEIGHT = "20%";

	const RESOURCE_COLLAPSE_HEIGHT = "1.8rem";

	const ACTION_WIDTH = "50rem";

	const centerHeight = calc(windowHeight, "-", HEADER_HEIGHT, "-", FOOTER_HEIGHT);
	const sideWidth = sideCollapsed ? SIDE_COLLAPSE_WIDTH : max(SIDE_MIN_WIDTH, min(SIDE_MAX_WIDTH, SIDE_WIDTH));
	const mainWidth = calc(windowWidth, "-", sideWidth);
	const resourceHeight = resourceCollapsed ? RESOURCE_COLLAPSE_HEIGHT : max(RESOURCE_MIN_HEIGHT, RESOURCE_HEIGHT);
	const mapHeight = calc(centerHeight, "-", resourceHeight);

	return {
		header: {
			x: 0,
			y: 0,
			w: windowWidth,
			h: HEADER_HEIGHT,
		},
		side: {
			x: 0,
			y: HEADER_HEIGHT,
			w: sideWidth,
			h: centerHeight,
			header: {
				x: 0,
				y: 0,
				w: "100%",
				h: SIDE_HEADER_HEIGHT,
			},
			main: {
				x: 0,
				y: SIDE_HEADER_HEIGHT,
				w: "100%",
				h: calc(centerHeight, "-", SIDE_HEADER_HEIGHT),
			},
		},
		footer: {
			x: 0,
			y: calc(windowHeight, "-", FOOTER_HEIGHT),
			w: windowWidth,
			h: FOOTER_HEIGHT,
		},
		resources: {
			x: calc(sideWidth, "+", ACTION_WIDTH),
			y: calc(windowHeight, "-", FOOTER_HEIGHT, "-", resourceHeight),
			w: ACTION_WIDTH,
			h: resourceHeight
		},
		actions: {
			x: sideWidth,
			y: calc(windowHeight, "-", FOOTER_HEIGHT, "-", resourceHeight),
			w: ACTION_WIDTH,
			h: resourceHeight
		},
		map: {
			x: sideWidth,
			y: HEADER_HEIGHT,
			w: mainWidth,
			h: mapHeight
		},

	}

}

