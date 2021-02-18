import { RouteSplit } from "data/split";
import { Layout } from "util/layout";
import { RouteResources } from "data/resource";

export type ApplicationState = {
	info: string,
	layout: Layout,
	sideCollapsed: boolean,
	headerCollapsed: boolean,
	resourcesCollapsed: boolean,
	showHelp: boolean,
	shrinkSide: boolean,
	editingNav: boolean,
	editingItems: boolean,
	editingActions: boolean,
	splitClipboard: RouteSplit | undefined,
	resources: RouteResources,
	showOnlyChangedResources: boolean,
}