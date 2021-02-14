import { RouteBranch } from "data/branch";
import { RouteItem } from "data/item";
import { RouteResources } from "data/object";

export type RouteState = {
	projectName: string,
	activeBranch: number,
	activeSplit: number,
	activeAction: number,
	branches: RouteBranch[],
	resources: RouteResources,
	items: RouteItem[],
}