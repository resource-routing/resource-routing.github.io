import { RouteSplit } from "data/split";
import { Layout } from "util/layout";
import { RouteResources } from "data/object";

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
	splitClipboard: RouteSplit | undefined,
	itemsInfo: string,
	resources: RouteResources,
}