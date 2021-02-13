import { ActionCreatorWithoutPayload, PayloadAction } from "@reduxjs/toolkit";
import layout, { LayoutOption } from "util/layout";
import { ReduxGlobalState } from "store/store";
import { isResourcesSectionHidden, isSideSectionShrunk, isHeaderCollapsed, isSideSectionCollapsed, isActionSectionCollapsed } from "./selectors";

function layoutOption(state: ReduxGlobalState): LayoutOption {
	return {
		sideCollapsed: isSideSectionCollapsed(state),
		actionsCollapsed: isActionSectionCollapsed(state),
		headerCollapsed: isHeaderCollapsed(state),
		shrink: isSideSectionShrunk(state),
		noResources: isResourcesSectionHidden(state)
	};
}
const SHRINK_SIDE_WHEN_LESS_THAN = 1550;
const HIDE_RESOURCES_WHEN_LESS_THAN = 700;
export default {
	setWindowWidth(state: ReduxGlobalState, action: PayloadAction<{ width: number }>): void {

		const shrink = action.payload.width < SHRINK_SIDE_WHEN_LESS_THAN;
		const noResources = action.payload.width < HIDE_RESOURCES_WHEN_LESS_THAN;
		const shouldUpdate = isSideSectionShrunk(state) !== shrink || isResourcesSectionHidden(state) !== noResources;
		if (shouldUpdate) {
			state.applicationState.layout = layout({ ...layoutOption(state), shrink, noResources });
			state.applicationState.shrinkSide = shrink;
			state.applicationState.noResources = noResources;
		}
	},
	doLayout(state: ReduxGlobalState): void {
		const shrink = window.innerWidth < SHRINK_SIDE_WHEN_LESS_THAN;
		const noResources = window.innerWidth < HIDE_RESOURCES_WHEN_LESS_THAN;
		state.applicationState.layout = layout({ ...layoutOption(state), shrink, noResources });
		state.applicationState.shrinkSide = shrink;
		state.applicationState.noResources = noResources;
	},
	setHeaderCollapsed(state: ReduxGlobalState, action: PayloadAction<{ collapsed: boolean }>): void {
		const headerCollapsed = action.payload.collapsed;
		if (headerCollapsed !== isHeaderCollapsed(state)) {
			state.applicationState.headerCollapsed = headerCollapsed;
			state.applicationState.layout = layout({ ...layoutOption(state), headerCollapsed });
		}
	},
	setSideCollapsed(state: ReduxGlobalState, action: PayloadAction<{ collapsed: boolean }>): void {
		const sideCollapsed = action.payload.collapsed;
		if (sideCollapsed !== isSideSectionCollapsed(state)) {
			state.applicationState.sideCollapsed = sideCollapsed;
			state.applicationState.layout = layout({ ...layoutOption(state), sideCollapsed });
		}
	},
	setActionsCollapsed(state: ReduxGlobalState, action: PayloadAction<{ collapsed: boolean }>): void {
		const actionsCollapsed = action.payload.collapsed;
		if (actionsCollapsed !== isActionSectionCollapsed(state)) {
			state.applicationState.actionsCollapsed = actionsCollapsed;
			state.applicationState.layout = layout({ ...layoutOption(state), actionsCollapsed });
		}
	},
	setEditingNav(state: ReduxGlobalState, action: PayloadAction<{ editing: boolean }>): void {
		state.applicationState.editingNav = action.payload.editing;
	},
	setEditingActions(state: ReduxGlobalState, action: PayloadAction<{ editing: boolean }>): void {
		state.applicationState.editingActions = action.payload.editing;
	},
	setEditingItems(state: ReduxGlobalState, action: PayloadAction<{ editing: boolean }>): void {
		state.applicationState.editingItems = action.payload.editing;
	},
	setInfo(state: ReduxGlobalState, action: PayloadAction<{ info: string }>): void {
		state.applicationState.info = action.payload.info;
	},
	showAlert(state: ReduxGlobalState, action: PayloadAction<{ text: string | undefined, actions: Record<string, ActionCreatorWithoutPayload> }>): void {
		state.applicationState.alert.text = action.payload.text;
		state.applicationState.alert.actions = action.payload.actions;
	},
	hideAlert(state: ReduxGlobalState): void {
		state.applicationState.alert.text = undefined;
		state.applicationState.alert.actions = {};
	}
};