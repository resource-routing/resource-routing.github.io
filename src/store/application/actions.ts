import { actions } from "store/store";

export const {
	setWindowWidth,
	doLayout,
	setHeaderCollapsed,
	setSideCollapsed,
	setResourcesCollapsed,
	setEditingNav,
	setEditingActions,
	setEditingItems,
	setInfo,
	setSplitClipboard,
	setResourceContent,
	setResourceError,
	markResourceDirtyAt,
	markResourceDirtyAtSplit,
	setShowOnlyChangedResources,
	setShowingHelp,
} = actions;