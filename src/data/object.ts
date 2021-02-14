import { BranchData, RouteBranch, deflateRouteBranch, inflateBranchData } from "./branch";
import { ItemData, RouteItem, deflateRouteItem, inflateItemData } from "./item";
import { RouteState } from "store/routing/type";
export type RouteData = {
	projectName: string,
	branches: BranchData[],
	items: ItemData[],
}

export type RouteResources = {
	error: ResourceError,
	content: ActionResource[],
	progress: number,
	total: number,
}

export type ResourceError = {
	branch: number,
	split: number,
	action: number,
	message: string,
} | null;

export type ActionResource = Record<string, ActionResourceItem>
export type ActionResourceItem = {
	value: number,
	change: number,
}

export function deflateRouteState(state: RouteState): RouteData {
	return {
		branches: (state.branches || []).map(deflateRouteBranch),
		items: (state.items || []).map(deflateRouteItem),
		projectName: state.projectName || "",
	};
}

export function inflateRouteData(data: RouteData): RouteState {
	return {
		projectName: data.projectName || "",
		activeBranch: -1,
		activeSplit: -1,
		activeAction: -1,
		branches: (data.branches || []).map(inflateBranchData),
		items: (data.items || []).map(inflateItemData),
	};
}








