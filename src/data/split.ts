import { ActionData, RouteAction, deflateRouteAction, inflateActionData, cloneAction } from "./action";

export type SplitData = {
	name: string,
	mapX: number,
	mapY: number,
	actions: ActionData[],
}

export type RouteSplit = {
	name: string,
	expanded: boolean,
	mapX: number,
	mapY: number,
	actions: RouteAction[],
}

export function newSplit(): RouteSplit {
	return {
		name: "",
		expanded: true,
		mapX: 0,
		mapY: 0,
		actions: [],
	};
}

export function cloneSplit(split: RouteSplit): RouteSplit {
	return {
		name: split.name,
		expanded: split.expanded,
		mapX: split.mapX,
		mapY: split.mapY,
		actions: split.actions.map(cloneAction),
	};
}

export function deflateRouteSplit(split: RouteSplit): SplitData {
	return {
		name: split.name || "",
		actions: (split.actions || []).map(deflateRouteAction),
		mapX: split.mapX || 0,
		mapY: split.mapY || 0,
	};
}

export function inflateSplitData(split: SplitData): RouteSplit {
	return {
		name: split.name || "",
		expanded: false,
		actions: (split.actions || []).map(inflateActionData),
		mapX: split.mapX || 0,
		mapY: split.mapY || 0,
	};
}