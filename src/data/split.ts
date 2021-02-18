import { ActionData, RouteAction, deflateRouteAction, inflateActionData, cloneAction, compressAction, decompressAction } from "./action";
import { decodeArray, decodeLengthPrepended, encodeArray, encodeLengthPrepended } from "./compress";

export type SplitData = {
	name: string,
	actions: ActionData[],
}

export type RouteSplit = {
	name: string,
	expanded: boolean,
	actions: RouteAction[],
}

export function newSplit(): RouteSplit {
	return {
		name: "",
		expanded: true,
		actions: [],
	};
}

export function cloneSplit(split: RouteSplit): RouteSplit {
	return {
		name: split.name,
		expanded: split.expanded,
		actions: split.actions.map(cloneAction),
	};
}

export function deflateRouteSplit(split: RouteSplit): SplitData {
	return {
		name: split.name || "",
		actions: (split.actions || []).map(deflateRouteAction),
	};
}

export function inflateSplitData(split: SplitData): RouteSplit {
	return {
		name: split.name || "",
		expanded: false,
		actions: (split.actions || []).map(inflateActionData),
	};
}

export function compressSplit(split: SplitData, itemNameToIndex: Record<string, number>): string {
	const { name, actions } = split;
	const nameEncoded = encodeLengthPrepended(name);
	const actionsEncoded = encodeArray(actions, action => compressAction(action, itemNameToIndex));
	return `${nameEncoded}${actionsEncoded}`;
}

export function decompressSplit(compressedString: string, currentIndex: number, itemNames: string[]): [SplitData, number, string | null] {
	const [name, indexAfterName, nameError] = decodeLengthPrepended(compressedString, currentIndex);
	if (nameError !== null) {
		return [deflateRouteSplit(newSplit()), -1, `Fail to decompress split name: ${nameError}`];
	}
	const [actions, indexAfterActions, actionsError] = decodeArray(compressedString, indexAfterName, (str, idx) => decompressAction(str, idx, itemNames));
	if (actionsError !== null) {
		return [deflateRouteSplit(newSplit()), -1, `Fail to decompress split actions: ${actionsError}`];
	}

	const split: SplitData = {
		name,
		actions,
	};
	return [split, indexAfterActions, null];
}

export function parseCoords(str: string): [number, number, number] | undefined {
	const parts = str.split(",").map(s => s.trim());
	if (parts.length !== 3) {
		return undefined;
	}
	const coords = parts.map(i => Number(i));
	for (const coord of coords) {
		if (!Number.isInteger(coord)) {
			return undefined;
		}
	}
	return [coords[0], coords[1], coords[2]];

}