export type ItemData = {
	name: string,
	color: string,
}

export type RouteItem = {
	name: string,
	color: string,
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