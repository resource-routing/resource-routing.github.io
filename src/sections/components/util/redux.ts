import { createSlice, configureStore } from "@reduxjs/toolkit";
import { RouteState } from "./object";
import { updateActiveAction, updateActiveBranchAndSplit } from "./update";
import testInitialState from "./test_initial_state";

export type ReduxGlobalState = {
	routeState: RouteState,
	settingState: SettingState
}

export type SettingState = {
	autoSave: boolean,
	linkObjectMap: boolean,
}
// const initialState = {
// 	routeState: {
// 		activeBranch: -1,
// 		activeSplit: -1,
// 		activeAction: -1,
// 		branches: [],
// 		items: [],
// 		resources: {
// 			error: null,
// 			content: [],
// 		},
// 	}
// } as ReduxGlobalState;

const initialState = testInitialState as ReduxGlobalState;

const slice = createSlice({
	name: "state",
	initialState,
	reducers: {
		setActiveBranchAndSplit: updateActiveBranchAndSplit,
		setActiveAction: updateActiveAction,
	}
})

export const {
	setActiveBranchAndSplit,
	setActiveAction,
} = slice.actions;

const store = configureStore({
	reducer: slice.reducer
});

export default store;
