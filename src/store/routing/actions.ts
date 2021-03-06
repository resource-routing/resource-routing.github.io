import { actions } from "store/store";

export const {
	setRouteState,
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
	setActiveSplitName,
	setSplitExpanded,
	deleteSplit,
	swapSplits,
	moveFirstSplitToPreviousBranch,
	moveLastSplitToNextBranch,
	createItem,
	setItemName,
	setItemColor,
	swapItems,
	deleteItem,
	createAction,
	setActionName,
	setActionExpanded,
	deleteAction,
	swapActions,
	setActionDeltaString,
	setProjectName,
	reparseAllDeltaStrings,
	changeActiveSplit,
	setAllCollapsed,
} = actions;
