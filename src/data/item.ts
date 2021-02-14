import { randomColor } from "util/color";

export type ItemData = {
	name: string,
	color: string,
}

export type RouteItem = {
	name: string,
	color: string,
}

export type ItemDelta = {
	value: number,
	change: number,
}

export function newItem(): RouteItem {
	return {
		name: "",
		color: randomColor(),
	}
}

export function deflateRouteItem(item: RouteItem): ItemData {
	return {
		name: item.name || "",
		color: item.color || "",
	};
}

export function inflateItemData(item: ItemData): RouteItem {
	return {
		name: item.name || "",
		color: item.color || "",
	};
}