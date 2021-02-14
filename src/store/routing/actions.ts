import { actions } from "store/store";

export const {
	setActiveBranchAndSplit,
	setActiveAction,
	createBranch,
	setBranchName,
	setBranchExpanded,
	deleteBranch,
	swapBranches,
	mergeNextIntoBranch,
	breakBranchAt,
	createSplit,
	setSplitName,
	setSplitExpanded,
	deleteSplit,
	swapSplits,
	moveFirstSplitToPreviousBranch,
	moveLastSplitToNextBranch,
} = actions;
