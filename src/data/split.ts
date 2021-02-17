import { ActionData, RouteAction, deflateRouteAction, inflateActionData, cloneAction, compressAction, decompressAction } from "./action";
import { decodeArray, decodeLengthPrepended, encodeArray, encodeLengthPrepended } from "./compress";

export type SplitData = {
	name: string,
	mapX: number,
	mapY: number,
	mapZ: number,
	actions: ActionData[],
}

export type RouteSplit = {
	name: string,
	expanded: boolean,
	mapX: number,
	mapY: number,
	mapZ: number,
	actions: RouteAction[],
}

export function newSplit(): RouteSplit {
	return {
		name: "",
		expanded: true,
		mapX: 0,
		mapY: 0,
		mapZ: 3,
		actions: [],
	};
}

export function cloneSplit(split: RouteSplit): RouteSplit {
	return {
		name: split.name,
		expanded: split.expanded,
		mapX: split.mapX,
		mapY: split.mapY,
		mapZ: split.mapZ,
		actions: split.actions.map(cloneAction),
	};
}

export function deflateRouteSplit(split: RouteSplit): SplitData {
	return {
		name: split.name || "",
		actions: (split.actions || []).map(deflateRouteAction),
		mapX: split.mapX || 0,
		mapY: split.mapY || 0,
		mapZ: split.mapZ || 3,
	};
}

export function inflateSplitData(split: SplitData): RouteSplit {
	return {
		name: split.name || "",
		expanded: false,
		actions: (split.actions || []).map(inflateActionData),
		mapX: split.mapX || 0,
		mapY: split.mapY || 0,
		mapZ: split.mapZ || 3,
	};
}

export function compressSplit(split: SplitData, itemNameToIndex: Record<string, number>): string {
	const { name, mapX, mapY, mapZ, actions } = split;
	const nameEncoded = encodeLengthPrepended(name);
	const coordsEncoded = encodeLengthPrepended(`${mapX},${mapY},${mapZ}`);
	const actionsEncoded = encodeArray(actions, action => compressAction(action, itemNameToIndex));
	return `${nameEncoded}${coordsEncoded}${actionsEncoded}`;
}

export function decompressSplit(compressedString: string, currentIndex: number, itemNames: string[]): [SplitData, number, string | null] {
	const [name, indexAfterName, nameError] = decodeLengthPrepended(compressedString, currentIndex);
	if (nameError !== null) {
		return [deflateRouteSplit(newSplit()), -1, `Fail to decompress split name: ${nameError}`];
	}
	const [coords, indexAfterCoords, coordsError] = decodeLengthPrepended(compressedString, indexAfterName);
	if (coordsError !== null) {
		return [deflateRouteSplit(newSplit()), -1, `Fail to decompress split coords: ${coordsError}`];
	}
	const coordsArray = parseCoords(coords);
	if (coordsArray === undefined) {
		return [deflateRouteSplit(newSplit()), -1, `Fail to decompress split coords: Error in coords: ${coords}`];
	}
	const [actions, indexAfterActions, actionsError] = decodeArray(compressedString, indexAfterCoords, (str, idx) => decompressAction(str, idx, itemNames));
	if (actionsError !== null) {
		return [deflateRouteSplit(newSplit()), -1, `Fail to decompress split actions: ${actionsError}`];
	}

	const [mapX, mapY, mapZ] = coordsArray;
	const split: SplitData = {
		name,
		actions,
		mapX,
		mapY,
		mapZ,
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