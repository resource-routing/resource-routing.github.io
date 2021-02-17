import { actions } from "store/store";

export const {
	setWindowWidth,
	doLayout,
	setHeaderCollapsed,
	setSideCollapsed,
	setActionsCollapsed,
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
} = actions;