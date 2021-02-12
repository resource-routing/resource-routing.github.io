import { PayloadAction } from "@reduxjs/toolkit";
import { ReduxGlobalState } from "./redux";

export function updateInfo(state: ReduxGlobalState, action: PayloadAction<{ info: string }>) {
	state.routeState.info = action.payload.info;
}

export function updateActiveBranchAndSplit(state: ReduxGlobalState, action: PayloadAction<{ activeBranch: number, activeSplit: number }>) {
	state.routeState.activeBranch = action.payload.activeBranch;
	state.routeState.activeSplit = action.payload.activeSplit;
}



export function updateActiveAction(state: ReduxGlobalState, action: PayloadAction<{ activeAction: number }>) {
	state.routeState.activeAction = action.payload.activeAction;
}

