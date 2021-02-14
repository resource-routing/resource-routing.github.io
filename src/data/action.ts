import { DeltaString, DeltaError, ActionDelta, stringToDelta } from "./delta";

export type ActionData = {
	name: string,
	deltaString: DeltaString,
}

export type RouteAction = {
	name: string,
	expanded: boolean,
	deltaString: DeltaString,
	deltaError: DeltaError,
	deltas: ActionDelta | null,
}

export function cloneAction(action: RouteAction): RouteAction {
	const [deltas, deltaError] = stringToDelta(action.deltaString);
	return {
		name: action.name,
		expanded: action.expanded,
		deltaString: action.deltaString,
		deltaError,
		deltas,
	};
}

export function deflateRouteAction(action: RouteAction): ActionData {
	return {
		name: action.name || "",
		deltaString: action.deltaString || "",
	};
}

export function inflateActionData(action: ActionData): RouteAction {
	const [deltas, deltaError] = stringToDelta(action.deltaString);
	const routeAction = {
		name: action.name || "",
		deltaString: action.deltaString || "",
		expanded: false,
		deltas,
		deltaError,
	};
	return routeAction;
}