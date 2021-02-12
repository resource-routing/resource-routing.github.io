import { DeltaString, DeltaError, ActionDelta, stringToDelta } from "./delta";

export type RouteData = {
	projectName: string,
	branches: BranchData[],
	items: ItemData[],
}

export type BranchData = {
	name: string,
	splits: SplitData[],
}

export type SplitData = {
	name: string,
	mapX: number,
	mapY: number,
	mapZ: number,
	actions: ActionData[],
}

export type ActionData = {
	name: string,
	deltaString: DeltaString,
}

export type ItemData = {
	name: string,
	color: string,
}

export type RouteState = {
	projectName: string,
	activeBranch: number,
	activeSplit: number,
	activeAction: number,
	branches: RouteBranch[],
	resources: RouteResources,
	items: RouteItem[],
	info: string,
}

export type RouteBranch = {
	name: string,
	expanded: boolean,
	splits: RouteSplit[],
}

export type RouteSplit = {
	name: string,
	expanded: boolean,
	mapX: number,
	mapY: number,
	mapZ: number,
	actions: RouteAction[],
}

export type RouteAction = {
	name: string,
	expanded: boolean,
	deltaString: DeltaString,
	deltaError: DeltaError,
	deltas: ActionDelta | null,
}

export type RouteResources = {
	error: ResourceError,
	content: ActionResource[][][],
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

export type RouteItem = {
	name: string,
	color: string,
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
		resources: {
			content: [],
			error: null,
		},
		items: (data.items || []).map(inflateItemData),
		info: "",
	}
}

function deflateRouteBranch(branch: RouteBranch): BranchData {
	return {
		name: branch.name || "",
		splits: (branch.splits || []).map(deflateRouteSplit)
	}
}

function inflateBranchData(branch: BranchData): RouteBranch {
	return {
		name: branch.name || "",
		expanded: false,
		splits: (branch.splits || []).map(inflateSplitData),
	}
}

function deflateRouteItem(item: RouteItem): ItemData {
	return {
		name: item.name || "",
		color: item.color || "",
	}
}

function inflateItemData(item: ItemData): RouteItem {
	return {
		name: item.name || "",
		color: item.color || "",
	}
}

function deflateRouteSplit(split: RouteSplit): SplitData {
	return {
		name: split.name || "",
		actions: (split.actions || []).map(deflateRouteAction),
		mapX: split.mapX || 0,
		mapY: split.mapY || 0,
		mapZ: split.mapZ || 3,
	}
}

function inflateSplitData(split: SplitData): RouteSplit {
	return {
		name: split.name || "",
		expanded: false,
		actions: (split.actions || []).map(inflateActionData),
		mapX: split.mapX || 0,
		mapY: split.mapY || 0,
		mapZ: split.mapZ || 3,
	}
}

function deflateRouteAction(action: RouteAction): ActionData {
	return {
		name: action.name || "",
		deltaString: action.deltaString || "",
	}
}

function inflateActionData(action: ActionData): RouteAction {
	const [deltas, error] = stringToDelta(action.deltaString);
	const routeAction = {
		name: action.name || "",
		deltaString: action.deltaString || "",
		expanded: false,
		deltas,
		deltaError: error
	}
	return routeAction;
}
