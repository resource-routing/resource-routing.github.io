import { SplitData, RouteSplit, deflateRouteSplit, inflateSplitData } from "./split";
export type BranchData = {
	name: string,
	splits: SplitData[],
}
export type RouteBranch = {
	name: string,
	expanded: boolean,
	splits: RouteSplit[],
}

export function newBranch(): RouteBranch {
	return {
		name: "",
		expanded: true,
		splits: [],
	};
}

export function deflateRouteBranch(branch: RouteBranch): BranchData {
	return {
		name: branch.name || "",
		splits: (branch.splits || []).map(deflateRouteSplit)
	};
}

export function inflateBranchData(branch: BranchData): RouteBranch {
	return {
		name: branch.name || "",
		expanded: false,
		splits: (branch.splits || []).map(inflateSplitData),
	};
}