import { PayloadAction } from "@reduxjs/toolkit";
import { newBranch } from "data/branch";
import { BRANCH_LIMIT, SPLIT_LIMIT } from "data/limit";
import { cloneSplit, newSplit, RouteSplit } from "data/split";
import { ReduxGlobalState } from "store/store";
import { getActiveBranch, getActiveSplit, getBranchCount, getSplitCount } from "./selectors";

function validateBranch(state: ReduxGlobalState, branchIndex: number): boolean {
	const branchLength = getBranchCount(state);
	return branchIndex >= 0 && branchIndex < branchLength;
}

function validateSplit(state: ReduxGlobalState, branchIndex: number, splitIndex: number): boolean {
	if (!validateBranch(state, branchIndex)) return false;
	return splitIndex >= 0 && splitIndex < getSplitCount(state, branchIndex);
}

export default {
	setActiveBranchAndSplit(state: ReduxGlobalState, action: PayloadAction<{ activeBranch: number, activeSplit: number }>): void {
		state.routeState.activeBranch = action.payload.activeBranch;
		state.routeState.activeSplit = action.payload.activeSplit;
	},
	setActiveAction(state: ReduxGlobalState, action: PayloadAction<{ activeAction: number }>): void {
		state.routeState.activeAction = action.payload.activeAction;
	},
	createBranch(state: ReduxGlobalState, action: PayloadAction<{ branchIndex: number }>): void {
		const { branchIndex } = action.payload;
		const branchLength = getBranchCount(state);
		if (branchLength >= BRANCH_LIMIT) {
			return;
		}
		const branch = newBranch();
		if (!validateBranch(state, branchIndex)) {
			state.routeState.branches.push(branch);
		} else {
			state.routeState.branches.splice(branchIndex, 0, branch);
			const activeBranch = getActiveBranch(state);
			if (activeBranch >= branchIndex) {
				state.routeState.activeBranch = activeBranch + 1;
			}
		}
	},
	setBranchName(state: ReduxGlobalState, action: PayloadAction<{ branchIndex: number, name: string }>): void {
		const { branchIndex, name } = action.payload;
		state.routeState.branches[branchIndex].name = name;
	},
	setBranchExpanded(state: ReduxGlobalState, action: PayloadAction<{ branchIndex: number, expanded: boolean }>): void {
		const { branchIndex, expanded } = action.payload;
		state.routeState.branches[branchIndex].expanded = expanded;
	},
	deleteBranch(state: ReduxGlobalState, action: PayloadAction<{ branchIndex: number }>): void {
		const { branchIndex } = action.payload;
		state.routeState.branches.splice(branchIndex, 1);
		const activeBranch = getActiveBranch(state);
		if (activeBranch === branchIndex) {
			state.routeState.activeBranch = -1;
		} else if (activeBranch > branchIndex) {
			state.routeState.activeBranch = activeBranch - 1;
		}
	},
	swapBranches(state: ReduxGlobalState, action: PayloadAction<{ i: number, j: number }>): void {
		const { i, j } = action.payload;
		if (!validateBranch(state, i) || !validateBranch(state, j)) {
			return;
		}
		const temp = state.routeState.branches[i];
		state.routeState.branches[i] = state.routeState.branches[j];
		state.routeState.branches[j] = temp;
		const activeBranch = getActiveBranch(state);
		if (activeBranch === i) {
			state.routeState.activeBranch = j;
		} else if (activeBranch === j) {
			state.routeState.activeBranch = i;
		}
	},
	mergeNextIntoBranch(state: ReduxGlobalState, action: PayloadAction<{ branchIndex: number }>): void {
		const { branchIndex } = action.payload;
		const branchLength = getBranchCount(state);
		if (branchIndex === branchLength - 1 || !validateBranch(state, branchIndex)) {
			return;
		}
		const oldSplitSize = getSplitCount(state, branchIndex);
		const nextSplitSize = getSplitCount(state, branchIndex + 1);
		if (oldSplitSize + nextSplitSize >= SPLIT_LIMIT) {
			return;
		}
		state.routeState.branches[branchIndex].splits = state.routeState.branches[branchIndex].splits.concat(state.routeState.branches[branchIndex + 1].splits);
		state.routeState.branches.splice(branchIndex + 1, 1);
		const activeBranch = getActiveBranch(state);
		if (activeBranch === branchIndex + 1) {
			state.routeState.activeBranch = activeBranch - 1;
			state.routeState.activeSplit += oldSplitSize;
		}
	},
	breakBranchAt(state: ReduxGlobalState, action: PayloadAction<{ branchIndex: number, splitIndex: number }>): void {
		const branchLength = getBranchCount(state);
		if (branchLength >= BRANCH_LIMIT) {
			return;
		}
		const { branchIndex, splitIndex } = action.payload;
		if (!validateSplit(state, branchIndex, splitIndex)) {
			return;
		}
		const hiSplits = state.routeState.branches[branchIndex].splits.slice(splitIndex);
		state.routeState.branches[branchIndex].splits = state.routeState.branches[branchIndex].splits.slice(0, splitIndex);
		const branch = newBranch();
		branch.expanded = true;
		branch.splits = hiSplits;
		state.routeState.branches.splice(branchIndex + 1, 0, branch);
		const activeBranch = getActiveBranch(state);
		const activeSplit = getActiveSplit(state);
		if (activeBranch === branchIndex && activeSplit >= splitIndex) {
			state.routeState.activeBranch = activeBranch + 1;
			state.routeState.activeSplit -= splitIndex;
		}
	},
	createSplit(state: ReduxGlobalState, action: PayloadAction<{ branchIndex: number, splitIndex: number, templateSplit?: RouteSplit }>): void {
		const { branchIndex, splitIndex, templateSplit } = action.payload;
		if (!validateBranch(state, branchIndex)) {
			return;
		}
		const splitLength = getSplitCount(state, branchIndex);
		if (splitLength >= SPLIT_LIMIT) {
			return;
		}
		const split = templateSplit ? cloneSplit(templateSplit) : newSplit();
		if (!validateSplit(state, branchIndex, splitIndex)) {
			state.routeState.branches[branchIndex].splits.push(split);
		} else {
			state.routeState.branches[branchIndex].splits.splice(splitIndex, 0, split);
			if (getActiveBranch(state) === branchIndex) {
				const activeSplit = getActiveSplit(state);
				if (activeSplit >= splitIndex) {
					state.routeState.activeSplit = activeSplit + 1;
				}
			}
		}
	},
	setSplitName(state: ReduxGlobalState, action: PayloadAction<{ branchIndex: number, splitIndex: number, name: string }>): void {
		const { branchIndex, splitIndex, name } = action.payload;
		state.routeState.branches[branchIndex].splits[splitIndex].name = name;
	},
	setSplitExpanded(state: ReduxGlobalState, action: PayloadAction<{ branchIndex: number, splitIndex: number, expanded: boolean }>): void {
		const { branchIndex, splitIndex, expanded } = action.payload;
		state.routeState.branches[branchIndex].splits[splitIndex].expanded = expanded;
	},
	deleteSplit(state: ReduxGlobalState, action: PayloadAction<{ branchIndex: number, splitIndex: number }>): void {
		const { branchIndex, splitIndex } = action.payload;
		if (!validateSplit(state, branchIndex, splitIndex)) {
			return;
		}
		state.routeState.branches[branchIndex].splits.splice(splitIndex, 1);
		if (getActiveBranch(state) === branchIndex) {
			const activeSplit = getActiveSplit(state);
			if (activeSplit === splitIndex) {
				state.routeState.activeSplit = -1;
			} else if (activeSplit > splitIndex) {
				state.routeState.activeSplit = activeSplit - 1;
			}
		}
	},
	swapSplits(state: ReduxGlobalState, action: PayloadAction<{ branchIndex: number, i: number, j: number }>): void {
		const { branchIndex, i, j } = action.payload;
		if (!validateSplit(state, branchIndex, i) || !validateSplit(state, branchIndex, j)) {
			return;
		}
		const temp = state.routeState.branches[branchIndex].splits[i];
		state.routeState.branches[branchIndex].splits[i] = state.routeState.branches[branchIndex].splits[j];
		state.routeState.branches[branchIndex].splits[j] = temp;
		if (getActiveBranch(state) === branchIndex) {
			const activeSplit = getActiveSplit(state);
			if (activeSplit === i) {
				state.routeState.activeSplit = j;
			} else if (activeSplit === j) {
				state.routeState.activeSplit = i;
			}
		}
	},
	moveFirstSplitToPreviousBranch(state: ReduxGlobalState, action: PayloadAction<{ branchIndex: number }>): void {
		const { branchIndex } = action.payload;
		if (!validateBranch(state, branchIndex) || !validateBranch(state, branchIndex - 1)) {
			return;
		}
		if (getSplitCount(state, branchIndex) <= 0) {
			return;
		}
		const movedSplitIndex = getSplitCount(state, branchIndex - 1);
		state.routeState.branches[branchIndex - 1].splits.push(state.routeState.branches[branchIndex].splits[0]);
		state.routeState.branches[branchIndex].splits.splice(0, 1);
		if (getActiveBranch(state) === branchIndex) {
			if (getActiveSplit(state) === 0) {
				state.routeState.activeBranch = branchIndex - 1;
				state.routeState.activeSplit = movedSplitIndex;
			} else {
				state.routeState.activeSplit -= 1;
			}
		}
	},
	moveLastSplitToNextBranch(state: ReduxGlobalState, action: PayloadAction<{ branchIndex: number }>): void {
		const { branchIndex } = action.payload;
		if (!validateBranch(state, branchIndex) || !validateBranch(state, branchIndex + 1)) {
			return;
		}
		if (getSplitCount(state, branchIndex) <= 0) {
			return;
		}
		const beforeMoveIndex = getSplitCount(state, branchIndex) - 1;
		state.routeState.branches[branchIndex + 1].splits.splice(0, 0, state.routeState.branches[branchIndex].splits[beforeMoveIndex]);
		state.routeState.branches[branchIndex].splits.pop();
		if (getActiveBranch(state) === branchIndex) {
			if (getActiveSplit(state) === beforeMoveIndex) {
				state.routeState.activeBranch = branchIndex + 1;
				state.routeState.activeSplit = 0;
			}
		} else if (getActiveBranch(state) === branchIndex + 1) {
			state.routeState.activeSplit += 1;
		}
	}
};