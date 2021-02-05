type State = {
	branches: Branch[],
	resources: BranchResource[],
	dirtyBranch: number,
	dirtySplit: number,
	dirtyAction: number,
	activeBranch: number,
	activeSplit: number,
	activeAction: number,
	projectName: string,
}

type Branch = {
	name: string,
	expanded: boolean,
	splits: Split[],
}

type Split = {
	name: string,
	expanded: boolean,
	actions: Action[],
}

type Action = {
	name: string,
	expanded: boolean,
	deltaString: string,
	deltaError: boolean,
	deltas: Record<string, DeltaItem>,
}

type DeltaItem = {
	type: "add" | "set" | "ref_add" | "ref_set" | "ref_sub",
	value: string | number,
	create: boolean,
}

type Resources = {
	error?: ResourceError,
	content: BranchResource[],
}

type ResourceError = {
	branch: number,
	split: number,
	action: number,
}

type BranchResource = SplitResource[];
type SplitResource = ActionResource[];

type ActionResource = Record<string, number>;
