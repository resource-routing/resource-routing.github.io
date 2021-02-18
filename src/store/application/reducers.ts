import { PayloadAction } from "@reduxjs/toolkit";
import layout, { LayoutOption } from "util/layout";
import { ReduxGlobalState } from "store/store";
import {
	isSideSectionShrunk,
	isHeaderCollapsed,
	isSideSectionCollapsed,
	isResourcesSectionCollapsed,
	getResourceCalcProgress,
	getResourceCalcError
} from "./selectors";
import { RouteSplit } from "data/split";
import { getActiveBranch, getActiveSplit, getGlobalActionIndex } from "store/routing/selectors";
import { ActionResource, ResourceError } from "data/resource";

function layoutOption(state: ReduxGlobalState): LayoutOption {
	return {
		sideCollapsed: isSideSectionCollapsed(state),
		resourcesCollapsed: isResourcesSectionCollapsed(state),
		headerCollapsed: isHeaderCollapsed(state),
		shrink: isSideSectionShrunk(state),
	};
}

function markResourceDirty(state: ReduxGlobalState, globalIndex: number): void {
	const currentProgress = getResourceCalcProgress(state);
	if (currentProgress >= 0 && currentProgress < globalIndex) {
		return;
	}
	state.applicationState.resources.progress = globalIndex;
	const error = getResourceCalcError(state);
	if (error !== null) {
		const { branch, split, action } = error;
		const errorGlobalIndex = getGlobalActionIndex(state, branch, split, action);
		if (errorGlobalIndex >= globalIndex) {
			state.applicationState.resources.error = null;
		}
	}
}

const SHRINK_SIDE_WHEN_LESS_THAN = 1000;

export default {
	setWindowWidth(state: ReduxGlobalState, action: PayloadAction<{ width: number }>): void {

		const shrink = action.payload.width < SHRINK_SIDE_WHEN_LESS_THAN;
		// const noResources = action.payload.width < HIDE_RESOURCES_WHEN_LESS_THAN;
		const shouldUpdate = isSideSectionShrunk(state) !== shrink;
		if (shouldUpdate) {
			state.applicationState.layout = layout({ ...layoutOption(state), shrink });
			state.applicationState.shrinkSide = shrink;
			//state.applicationState.noResources = noResources;
		}
	},
	doLayout(state: ReduxGlobalState): void {
		const shrink = window.innerWidth < SHRINK_SIDE_WHEN_LESS_THAN;
		// const noResources = window.innerWidth < HIDE_RESOURCES_WHEN_LESS_THAN;
		state.applicationState.layout = layout({ ...layoutOption(state), shrink });
		state.applicationState.shrinkSide = shrink;
		//state.applicationState.noResources = noResources;
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
	setResourcesCollapsed(state: ReduxGlobalState, action: PayloadAction<{ collapsed: boolean }>): void {
		const resourcesCollapsed = action.payload.collapsed;
		if (resourcesCollapsed !== isResourcesSectionCollapsed(state)) {
			state.applicationState.resourcesCollapsed = resourcesCollapsed;
			state.applicationState.layout = layout({ ...layoutOption(state), resourcesCollapsed });
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
	setSplitClipboard(state: ReduxGlobalState, action: PayloadAction<{ split: RouteSplit }>): void {
		state.applicationState.splitClipboard = action.payload.split;
	},
	setResourceContent(state: ReduxGlobalState, action: PayloadAction<{ globalIndex: number, content: ActionResource }>): void {
		const { globalIndex, content } = action.payload;
		state.applicationState.resources.content[globalIndex] = content;
		state.applicationState.resources.progress = globalIndex + 1;
	},
	setResourceError(state: ReduxGlobalState, action: PayloadAction<{ error: ResourceError }>): void {
		state.applicationState.resources.error = action.payload.error;
	},
	markResourceDirtyAt(state: ReduxGlobalState, action: PayloadAction<{ globalIndex: number }>): void {
		const { globalIndex } = action.payload;
		markResourceDirty(state, globalIndex);
	},
	markResourceDirtyAtSplit(state: ReduxGlobalState, action: PayloadAction<{ branchIndex?: number, splitIndex?: number }>): void {
		let { branchIndex, splitIndex } = action.payload;
		branchIndex = branchIndex ?? getActiveBranch(state);
		splitIndex = splitIndex ?? getActiveSplit(state);

		const globalIndex = getGlobalActionIndex(state, branchIndex, splitIndex, 0);
		markResourceDirty(state, globalIndex);
	},
	setShowOnlyChangedResources(state: ReduxGlobalState, action: PayloadAction<{ showOnlyChangedResources: boolean }>): void {
		state.applicationState.showOnlyChangedResources = action.payload.showOnlyChangedResources;
	},
	setShowingHelp(state: ReduxGlobalState, action: PayloadAction<{ showHelp: boolean }>): void {
		state.applicationState.showHelp = action.payload.showHelp;
	}
};