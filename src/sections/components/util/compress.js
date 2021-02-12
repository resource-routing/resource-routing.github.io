
import { sanitizeState } from "./sanitize";
import stringToDelta, { deltaToString, renameItemInDelta } from './delta';
export function compressState(state) {//state => compressedStateString
	// const sanitized = sanitizeState(state);
	// const encodedProjectName = encodeLengthPrepended(state.projectName);
	// const branches = [];
	// const itemReplacement = {};//ToDO: get this from state.items
	// const deltas = [];
	// let id = 0;
	// sanitized.forEach((branch, b) => {
	// 	deltas[b] = [];
	// 	branch.splits.forEach((split, s) => {
	// 		deltas[b][s] = [];
	// 		split.actions.forEach((action, a) => {
	// 			const [delta, error] = stringToDelta(action.deltaString);
	// 			if (!error) {
	// 				for (const item in delta) {
	// 					if (!(item in itemReplacement)) {
	// 						itemReplacement[item] = id;
	// 						id++;
	// 					}
	// 				}
	// 				deltas[b][s][a] = delta;
	// 			}
	// 		});
	// 	});
	// });
	// sanitized.forEach((branch, b) => {
	// 	//const encodedBranchName = encodeLengthPrepended(branch.name);
	// 	//const splits = [];
	// 	branch.splits.forEach((split, s) => {
	// 		//const encodedSplitName = encodeLengthPrepended(split.name);
	// 		//const actions = [];
	// 		split.actions.forEach((action, a) => {
	// 			const delta = deltas[b][s][a];
	// 			if (delta) {
	// 				for (const item in delta) {

	// 					if (!(item in itemReplacement)) {
	// 						itemReplacement[item] = id;
	// 						id++;
	// 					}
	// 				}
	// 			}
	// 			//const encodedActionName = encodeLengthPrepended(action.name);
	// 			const [delta, error] = stringToDelta(action.deltaString);
	// 			if (!error) {
	// 				for (const item in delta) {
	// 					if (!(item in itemReplacement)) {
	// 						itemReplacement[item] = id;
	// 						id++;
	// 					}
	// 				}
	// 			}
	// 			//const encodedDeltaString = encodeLengthPrepended(action.deltaString);
	// 			//actions.push(encodedActionName+encodedDeltaString);
	// 		});
	// 		//splits.push(`${encodedSplitName}[${actions.join("")}]`);
	// 	});
	// 	//branches.push(`${encodedBranchName}[${splits.join("")}]`);
	// });
}

export function encodeLengthPrepended(str) {//string => lengthPrependedString
	if (str.length === 0) return ":";
	return `${str.length}:${str}`;
}

export function decodeLengthPrepended(lengthPrependedString, currentIndex) {//(lengthPrependedString, currentIndex) => [string, nextIndex, error]
	const i = lengthPrependedString.indexOf(":", currentIndex);
	if (i < currentIndex) return [null, null, "Fail to decode"];
	if (i == currentIndex) return ["", i + 1, null];
	const len = Number(lengthPrependedString.substring(currentIndex, i));
	if (!Number.isInteger(len)) return [null, null, "Fail to decode"];
	if (i + len >= lengthPrependedString.length) return [null, null, "Fail to decode"];
	const decoded = lengthPrependedString.substring(i + 1, i + 1 + len);
	return [decoded, i + len + 1, null];
}

export function decompressState(compressedStateString) {

}

export function deflateCompressedState(compressedStateString) {

}

export function inflateStateBytes(stateBytes) {

}

export function encodeStateBytes(stateBytes) {

}

export function decodeState(encodedState) {

}