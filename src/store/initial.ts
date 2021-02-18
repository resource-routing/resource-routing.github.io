import { defaultLayout } from "util/layout";
export default {
	routeState: {
		projectName: "Unnamed Project",
		activeBranch: -1,
		activeSplit: -1,
		activeAction: -1,
		branches: [],
		items: [],
	},
	settingState: {
		autoSave: true,
		onlyShowChangedItems: false,
		itemFilter: "",
	},
	applicationState: {
		layout: {
			header: defaultLayout,
			side: {
				...defaultLayout,
				main: defaultLayout,
				header: defaultLayout
			},
			footer: defaultLayout,
			resources: {
				...defaultLayout,
				header: defaultLayout,
				main: defaultLayout,
			},
			actions: {
				...defaultLayout,
				header: defaultLayout,
				main: defaultLayout,
			},
			map: defaultLayout
		},
		sideCollapsed: false,
		headerCollapsed: true,
		resourcesCollapsed: false,
		noResources: false,
		shrinkSide: false,
		editingNav: false,
		editingActions: false,
		editingItems: false,
		info: "",
		splitClipboard: undefined,
		resources: {
			error: null,
			content: [],
			progress: -1,
		},
		showOnlyChangedResources: false,
		showHelp: false,
	}
};