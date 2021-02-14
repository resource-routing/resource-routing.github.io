import { Layout, Bounds } from "util/layout";
import { ReduxGlobalState } from "store/store";
import { ApplicationState } from "./type";
import { RouteSplit } from "data/split";

function getApplicationState(state: ReduxGlobalState): ApplicationState {
	return state.applicationState;
}

export function getInfo(state: ReduxGlobalState): string {
	return getApplicationState(state).info;
}

export function isResourcesSectionHidden(state: ReduxGlobalState): boolean {
	return getApplicationState(state).noResources;
}

export function isSideSectionShrunk(state: ReduxGlobalState): boolean {
	return getApplicationState(state).shrinkSide;
}

export function isActionSectionCollapsed(state: ReduxGlobalState): boolean {
	return getApplicationState(state).actionsCollapsed;
}

export function isHeaderCollapsed(state: ReduxGlobalState): boolean {
	return getApplicationState(state).headerCollapsed;
}

export function isSideSectionCollapsed(state: ReduxGlobalState): boolean {
	return getApplicationState(state).sideCollapsed;
}

function getLayout(state: ReduxGlobalState): Layout {
	return getApplicationState(state).layout;
}

export function getHeaderBounds(state: ReduxGlobalState): Bounds {
	return getLayout(state).header;
}

export function getSideBounds(state: ReduxGlobalState): Bounds {
	return getLayout(state).side;
}

export function getSideHeaderBounds(state: ReduxGlobalState): Bounds {
	return getLayout(state).side.header;
}

export function getSideMainBounds(state: ReduxGlobalState): Bounds {
	return getLayout(state).side.main;
}

export function getActionsBounds(state: ReduxGlobalState): Bounds {
	return getLayout(state).actions;
}

export function getActionsHeaderBounds(state: ReduxGlobalState): Bounds {
	return getLayout(state).actions.header;
}

export function getActionsMainBounds(state: ReduxGlobalState): Bounds {
	return getLayout(state).actions.main;
}

export function getFooterBounds(state: ReduxGlobalState): Bounds {
	return getLayout(state).footer;
}

export function getMapBounds(state: ReduxGlobalState): Bounds {
	return getLayout(state).map;
}

export function getResourcesBounds(state: ReduxGlobalState): Bounds {
	return getLayout(state).resources;
}

export function isEditingNav(state: ReduxGlobalState): boolean {
	return getApplicationState(state).editingNav;
}

export function isEditingActions(state: ReduxGlobalState): boolean {
	return getApplicationState(state).editingActions;
}

export function isEditingItems(state: ReduxGlobalState): boolean {
	return getApplicationState(state).editingItems;
}

export function getSplitClipboard(state: ReduxGlobalState): RouteSplit | undefined {
	return getApplicationState(state).splitClipboard;
}