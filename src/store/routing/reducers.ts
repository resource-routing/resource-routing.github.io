import { PayloadAction } from "@reduxjs/toolkit";
import { BRANCH_LIMIT } from "data/limit";
import { newBranch } from "data/object";
import { ReduxGlobalState } from "store/store";
import { benchmarkDelta, benchmarkTime } from "util/benchmark";
import { getActiveBranch, getBranchCount, getBranchName } from "./selectors";

// const message: React.FunctionComponent<{ text: string }> = ({ text }: { text: string }) => {
// 	return React.createElement("span", undefined, text);
// }

export default {
	setActiveBranchAndSplit(state: ReduxGlobalState, action: PayloadAction<{ activeBranch: number, activeSplit: number }>): void {
		state.routeState.activeBranch = action.payload.activeBranch;
		state.routeState.activeSplit = action.payload.activeSplit;
	},
	setActiveAction(state: ReduxGlobalState, action: PayloadAction<{ activeAction: number }>): void {
		state.routeState.activeAction = action.payload.activeAction;
	},
	createBranch(state: ReduxGlobalState, action: PayloadAction<{ branchIndex: number }>): void {
		const startTime = benchmarkTime();
		const { branchIndex } = action.payload;
		const branchLength = getBranchCount(state);
		if (branchLength >= BRANCH_LIMIT) {
			state.applicationState.alert.text = `Branch limit exceeded (${BRANCH_LIMIT})`;
			state.applicationState.alert.actions = {
				"OK": undefined
			};
			state.applicationState.info = "Branch limit exceeded";
			return;
		}
		const branch = newBranch();
		if (branchIndex >= branchLength) {
			state.routeState.branches.push(branch);
		} else {
			state.routeState.branches.splice(branchIndex, 0, branch);
			const activeBranch = getActiveBranch(state);
			if (activeBranch >= branchIndex) {
				state.routeState.activeBranch = activeBranch + 1;
			}
		}
		state.applicationState.info = `Branch created. (${benchmarkDelta(startTime)} ms)`;
	},
	setBranchName(state: ReduxGlobalState, action: PayloadAction<{ branchIndex: number, name: string }>): void {
		const { branchIndex, name } = action.payload;
		state.routeState.branches[branchIndex].name = name;
	},
	setBranchExpanded(state: ReduxGlobalState, action: PayloadAction<{ branchIndex: number, expanded: boolean }>): void {
		const { branchIndex, expanded } = action.payload;
		state.routeState.branches[branchIndex].expanded = expanded;
	},
	promptDeleteBranch(state: ReduxGlobalState, action: PayloadAction<{ branchIndex: number }>): void {
		const { branchIndex } = action.payload;
		state.applicationState.alert.text = `Delete branch "${getBranchName(state, branchIndex)}"? This also deletes all splits in the branch. This is NOT reversible!`;
		state.applicationState.alert.actions = {
			"Cancel": undefined,
		};
	},
	deleteBranch(state: ReduxGlobalState, action: PayloadAction<{ branchIndex: number }>): void {
		const startTime = benchmarkTime();
		const { branchIndex } = action.payload;
		state.routeState.branches.splice(branchIndex, 1);
		const activeBranch = getActiveBranch(state);
		if (activeBranch === branchIndex) {
			state.routeState.activeBranch = -1;
		} else if (activeBranch > branchIndex) {
			state.routeState.activeBranch = activeBranch - 1;
		}
		state.applicationState.info = `Branch deleted. (${benchmarkDelta(startTime)} ms)`;
	}
};