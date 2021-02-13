import { createSlice, configureStore, ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import { RouteState } from "data/object";
import routingReducers from "store/routing/reducers";
import applicationReducers from "store/application/reducers";
import settingReducers from "store/setting/reducers";
import testInitialState from "store/initial";
import { Layout } from "util/layout";

export type ReduxGlobalState = {
	routeState: RouteState,
	settingState: SettingState,
	applicationState: ApplicationState,
}

export type SettingState = {
	autoSave: boolean,
	linkObjectMap: boolean,
}

export type ApplicationState = {
	info: string,
	layout: Layout,
	sideCollapsed: boolean,
	headerCollapsed: boolean,
	actionsCollapsed: boolean,
	noResources: boolean,
	shrinkSide: boolean,
	editingNav: boolean,
	editingItems: boolean,
	editingActions: boolean,
	alert: {
		text: string | undefined,
		actions: Record<string, ActionCreatorWithoutPayload | undefined>
	}
}

const initialState = testInitialState as ReduxGlobalState;

const slice = createSlice({
	name: "state",
	initialState,
	reducers: {
		...routingReducers,
		...applicationReducers,
		...settingReducers,
	},
});

export const actions = slice.actions;

const store = configureStore({
	reducer: slice.reducer
});

export default store;
