import { BranchData, deflateRouteBranch, inflateBranchData } from "./branch";
import { ItemData, deflateRouteItem, inflateItemData } from "./item";
import { RouteState } from "store/routing/type";
export type RouteData = {
	projectName: string,
	branches: BranchData[],
	items: ItemData[],
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
