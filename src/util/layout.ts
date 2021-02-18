export function calc(...array: string[]): string {
	return `calc(${array.join(" ")})`;
}

export function min(a: string, b: string): string {
	return `min(${a}, ${b})`;
}

export function max(a: string, b: string): string {
	return `max(${a}, ${b})`;
}

export const defaultLayout: Bounds = {
	x: "0",
	y: "0",
	w: "0",
	h: "0",
};
export type Layout = {
	header: Bounds,
	side: Bounds & {
		header: Bounds,
		main: Bounds,
	},
	footer: Bounds,
	resources: Bounds & {
		header: Bounds,
		main: Bounds,
	},
	actions: Bounds & {
		header: Bounds,
		main: Bounds,
	},
	//map: Bounds
}

export type Bounds = {
	x: string,
	y: string,
	w: string,
	h: string,
}

export type LayoutOption = {
	sideCollapsed: boolean,
	resourcesCollapsed: boolean,
	headerCollapsed: boolean,
	shrink: boolean,
}

export default function layout({ sideCollapsed, resourcesCollapsed, headerCollapsed, shrink }: LayoutOption): Layout {

	const windowWidth = "100vw";
	const windowHeight = "100vh";
	const HEADER_HEIGHT = "3.5rem";
	const HEADER_EXPAND_HEIGHT = "10rem";
	const FOOTER_HEIGHT = "1.5rem";

	const SIDE_MIN_WIDTH = "16rem";
	const SIDE_WIDTH = "30%";
	const SIDE_MAX_WIDTH = "24rem";

	const SIDE_COLLAPSE_WIDTH = "2rem";

	const SIDE_HEADER_HEIGHT = "2rem";

	const RESOURCE_MIN_HEIGHT = "12rem";
	const RESOURCE_HEIGHT = "30%";
	// const RESOURCE_WIDTH_SHRINK = "24rem";
	const RESOURCE_COLLAPSE_HEIGHT = "1.8rem";
	const RESOURCE_HEADER_HEIGHT = "3.2rem";

	// const ACTION_MIN_WIDTH = "50rem";

	const headerHeight = headerCollapsed ? HEADER_HEIGHT : HEADER_EXPAND_HEIGHT;
	const sideHeight = calc(windowHeight, "-", headerHeight, "-", FOOTER_HEIGHT);
	const sideWidth = sideCollapsed ? SIDE_COLLAPSE_WIDTH : max(SIDE_MIN_WIDTH, min(SIDE_MAX_WIDTH, SIDE_WIDTH));
	const mainWidth = calc(windowWidth, "-", sideWidth);
	const resourceHeight = resourcesCollapsed ? RESOURCE_COLLAPSE_HEIGHT : max(RESOURCE_MIN_HEIGHT, RESOURCE_HEIGHT);

	const actionHeight = calc(windowHeight, "-", resourceHeight, "-", FOOTER_HEIGHT);
	//const actionWidth = shrink ? calc(windowWidth, "-", RESOURCE_WIDTH_SHRINK) : min(mainWidth, max(ACTION_MIN_WIDTH, calc("60%", "-", sideWidth)));
	const resourceY = calc(windowHeight, "-", FOOTER_HEIGHT, "-", resourceHeight);

	return {
		header: {
			x: "0",
			y: "0",
			w: sideWidth,
			h: headerHeight,
		},
		side: {
			x: "0",
			y: headerHeight,
			w: sideWidth,
			h: shrink ? calc(sideHeight, "-", resourceHeight) : sideHeight,
			header: {
				x: "0",
				y: "0",
				w: "100%",
				h: SIDE_HEADER_HEIGHT,
			},
			main: {
				x: "0",
				y: SIDE_HEADER_HEIGHT,
				w: "100%",
				h: calc("100%", "-", SIDE_HEADER_HEIGHT),
			},
		},
		footer: {
			x: "0",
			y: calc(windowHeight, "-", FOOTER_HEIGHT),
			w: windowWidth,
			h: FOOTER_HEIGHT,
		},
		resources: {
			x: shrink ? "0" : sideWidth,
			y: resourceY,
			w: shrink ? windowWidth : mainWidth,
			h: resourceHeight,
			// hide: noResources,
			header: {
				x: "0",
				y: "0",
				w: "100%",
				h: RESOURCE_HEADER_HEIGHT,
			},
			main: {
				x: "0",
				y: RESOURCE_HEADER_HEIGHT,
				w: "100%",
				h: calc("100%", "-", RESOURCE_HEADER_HEIGHT),
			},
		},
		actions: {
			x: sideWidth,
			y: "0",
			w: mainWidth,
			h: actionHeight,
			header: {
				x: "0",
				y: "0",
				w: "100%",
				h: SIDE_HEADER_HEIGHT,
			},
			main: {
				x: "0",
				y: SIDE_HEADER_HEIGHT,
				w: "100%",
				h: calc("100%", "-", SIDE_HEADER_HEIGHT),
			},
		},
	};

}

