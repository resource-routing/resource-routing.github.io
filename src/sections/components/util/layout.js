export function calc(...array) {
	return `calc(${array.join(" ")})`;
}

export function min(a, b) {
	return `min(${a}, ${b})`;
}

export function max(a, b) {
	return `max(${a}, ${b})`;
}


export default function layout(sideCollapsed, resourceCollapsed, headerCollapsed) {
	//const resourceCollapsed = false;
	// const sideCollapsed = true;

	const windowWidth = "100vw";
	const windowHeight = "100vh";
	const HEADER_HEIGHT = "3.5rem";
	const FOOTER_HEIGHT = "2rem";

	const SIDE_MIN_WIDTH = "16rem";
	const SIDE_WIDTH = "30%";
	const SIDE_MAX_WIDTH = "24rem";

	const SIDE_COLLAPSE_WIDTH = "2rem";

	const SIDE_HEADER_HEIGHT = "2rem";

	const RESOURCE_MIN_HEIGHT = "12rem";
	const RESOURCE_HEIGHT = "20%";
	const RESOURCE_WIDTH_SHRINK = "24rem";
	const RESOURCE_COLLAPSE_HEIGHT = "1.8rem";
	const RESOURCE_HEADER_HEIGHT = "3.2rem";

	const ACTION_MIN_WIDTH = "50rem";

	const SHRINK_SIDE_WHEN_LESS_THAN = 1550;
	const shrink = window.innerWidth < SHRINK_SIDE_WHEN_LESS_THAN

	const HIDE_RESOURCES_WHEN_LESS_THAN = 700;
	const noResources = window.innerWidth < HIDE_RESOURCES_WHEN_LESS_THAN

	const NO_HEADER_WHEN_LESS_THAN = 1000;
	if (window.innerWidth < NO_HEADER_WHEN_LESS_THAN) {
		headerCollapsed = true;
	}


	const centerHeight = calc(windowHeight, "-", HEADER_HEIGHT, "-", FOOTER_HEIGHT);
	const sideWidth = sideCollapsed ? SIDE_COLLAPSE_WIDTH : max(SIDE_MIN_WIDTH, min(SIDE_MAX_WIDTH, SIDE_WIDTH));
	const mainWidth = calc(windowWidth, "-", sideWidth);
	const resourceHeight = resourceCollapsed ? RESOURCE_COLLAPSE_HEIGHT : max(RESOURCE_MIN_HEIGHT, RESOURCE_HEIGHT);

	const mapHeight = calc(centerHeight, "-", resourceHeight);
	const actionWidth = shrink ? calc(windowWidth, "-", RESOURCE_WIDTH_SHRINK) : min(mainWidth, max(ACTION_MIN_WIDTH, calc("60%", "-", sideWidth)));
	const actionY = calc(windowHeight, "-", FOOTER_HEIGHT, "-", resourceHeight);

	return {
		header: {
			x: 0,
			y: 0,
			w: headerCollapsed ? sideWidth : windowWidth,
			h: HEADER_HEIGHT,
		},
		side: {
			x: 0,
			y: HEADER_HEIGHT,
			w: sideWidth,
			h: shrink ? mapHeight : centerHeight,
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
				h: calc("100%", "-", SIDE_HEADER_HEIGHT),
			},
		},
		footer: {
			x: 0,
			y: calc(windowHeight, "-", FOOTER_HEIGHT),
			w: windowWidth,
			h: FOOTER_HEIGHT,
		},
		resources: {
			x: shrink ? actionWidth : calc(sideWidth, "+", actionWidth),
			y: actionY,
			w: shrink ? RESOURCE_WIDTH_SHRINK : calc(mainWidth, "-", actionWidth),
			h: resourceHeight,
			hide: noResources,
			header: {
				x: 0,
				y: 0,
				w: "100%",
				h: RESOURCE_HEADER_HEIGHT,
			},
			main: {
				x: 0,
				y: RESOURCE_HEADER_HEIGHT,
				w: "100%",
				h: calc("100%", "-", RESOURCE_HEADER_HEIGHT),
			},
		},
		actions: {
			x: shrink ? 0 : sideWidth,
			y: actionY,
			w: noResources ? windowWidth : actionWidth,
			h: resourceHeight,
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
				h: calc("100%", "-", SIDE_HEADER_HEIGHT),
			},
		},
		map: {
			x: sideWidth,
			y: headerCollapsed ? 0 : HEADER_HEIGHT,
			w: mainWidth,
			h: headerCollapsed ? calc(windowHeight, "-", FOOTER_HEIGHT, "-", resourceHeight) : mapHeight,
		},
	}

}

