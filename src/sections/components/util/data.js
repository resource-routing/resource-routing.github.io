import { stringToDelta, deltaToString, renameItemInDelta } from './delta';
import { sanitizeBranch, sanitizeAction, sanitizeSplit, sanitizeItem } from './sanitize';

export function createBranchAt(index) {
	return function ({ branches, activeBranch }) {
		const branchesCopy = deepCopyBranches(branches);
		const newBranch = sanitizeBranch();
		if (index >= branchesCopy.length) {
			branchesCopy.push(newBranch);
		} else {
			branchesCopy.splice(index, 0, newBranch);
		}
		let newActiveBranch = activeBranch;
		if (activeBranch >= index) {
			newActiveBranch++;
		}
		return {
			branches: branchesCopy,
			activeBranch: newActiveBranch
		}
	}

}

export function deleteBranchAt(index) {
	return function ({ branches, activeBranch }) {
		const branchesCopy = deepCopyBranches(branches);
		branchesCopy.splice(index, 1)
		let newActiveBranch = activeBranch;
		if (activeBranch === index) {
			newActiveBranch = -1;
		} else if (activeBranch > index) {
			newActiveBranch--;
		}
		return {
			branches: branchesCopy,
			activeBranch: newActiveBranch
		}
	}

}

export function swapBranches(i, j) {
	return function ({ branches, activeBranch }) {
		const branchesCopy = deepCopyBranches(branches);
		const temp = branchesCopy[i];
		branchesCopy[i] = branchesCopy[j];
		branchesCopy[j] = temp;

		let newActiveBranch;
		if (activeBranch === i) {
			newActiveBranch = j;
		} else if (activeBranch === j) {
			newActiveBranch = i;
		}
		return {
			branches: branchesCopy,
			activeBranch: newActiveBranch,
		}
	}
}

export function setBranchPropertyAt(index, property, value) {
	return function ({ branches }) {
		const branchesCopy = deepCopyBranches(branches);
		branchesCopy[index][property] = value;

		return {
			branches: branchesCopy
		}
	}

}

export function createSplitAt(bIndex, index, splitTemplate) {
	return function ({ branches, activeBranch, activeSplit }) {
		const branchesCopy = deepCopyBranches(branches);
		const newSplit = sanitizeSplit(splitTemplate);
		if (index >= branchesCopy[bIndex].splits.length) {
			branchesCopy[bIndex].splits.push(newSplit);
		} else {
			branchesCopy[bIndex].splits.splice(index, 0, newSplit);
		}
		let newActiveSplit = activeSplit;
		if (activeBranch === bIndex && activeSplit >= index) {
			newActiveSplit++;
		}
		return {
			branches: branchesCopy,
			activeSplit: newActiveSplit,
		}
	}
}

export function deleteSplitAt(bIndex, index) {
	return function ({ branches, activeBranch, activeSplit }) {
		const branchesCopy = deepCopyBranches(branches);
		branchesCopy[bIndex].splits.splice(index, 1);
		let newActiveSplit = activeSplit;
		if (activeBranch === bIndex) {
			if (activeSplit === index) {
				newActiveSplit = -1;
			} else if (activeSplit > index) {
				newActiveSplit--;
			}
		}
		return {
			branches: branchesCopy,
			activeSplit: newActiveSplit,
		}
	}

}

export function swapSplits(bIndex, si, sj) {
	return function ({ branches, activeBranch, activeSplit }) {
		const branchesCopy = deepCopyBranches(branches);
		const temp = branchesCopy[bIndex].splits[si];
		branchesCopy[bIndex].splits[si] = branchesCopy[bIndex].splits[sj];
		branchesCopy[bIndex].splits[sj] = temp;
		let newActiveSplit = activeSplit;
		if (activeBranch === bIndex) {
			if (activeSplit === si) {
				newActiveSplit = sj;
			} else if (activeSplit === sj) {
				newActiveSplit = si;
			}
		}
		return {
			branches: branchesCopy,
			activeSplit: newActiveSplit,
		}
	}

}

export function setSplitPropertyAt(bIndex, sIndex, property, value) {
	return function ({ branches }) {
		const branchesCopy = deepCopyBranches(branches);
		branchesCopy[bIndex].splits[sIndex][property] = value;
		return { branches: branchesCopy }
	}

}

export function moveFirstSplitOfBranchToPreviousBranch(index) {
	return function ({ branches, activeBranch, activeSplit }) {
		const branchesCopy = deepCopyBranches(branches);
		branchesCopy[index - 1].splits.push(branchesCopy[index].splits[0]);
		branchesCopy[index].splits.splice(0, 1);
		let newActiveBranch = activeBranch;
		let newActiveSplit = activeSplit;
		if (activeBranch === index && activeSplit === 0) {
			newActiveBranch--;
			newActiveSplit = branchesCopy[index - 1].splits.length - 1;
		}
		return {
			branches: branchesCopy,
			activeBranch: newActiveBranch,
			activeSplit: newActiveSplit,
		}
	}

}

export function moveLastSplitOfBranchToNextBranch(index) {
	return function ({ branches, activeBranch, activeSplit }) {
		const branchesCopy = deepCopyBranches(branches);
		const lastIndex = branchesCopy[index].splits.length - 1;
		branchesCopy[index + 1].splits.splice(0, 0, branchesCopy[index].splits[lastIndex]);
		branchesCopy[index].splits.splice(lastIndex, 1);

		let newActiveBranch = activeBranch;
		let newActiveSplit = activeSplit;
		if (activeBranch === index && activeSplit === lastIndex) {
			newActiveBranch++;
			newActiveSplit = 0;
		}
		return {
			branches: branchesCopy,
			activeBranch: newActiveBranch,
			activeSplit: newActiveSplit,
		}
	}
}

export function mergeNextBranchWithCurrentBranch(index) {
	return function ({ branches, activeBranch, activeSplit }) {
		const branchesCopy = deepCopyBranches(branches);
		const oldSplitSize = branchesCopy[index].splits.length;
		branchesCopy[index].splits = branchesCopy[index].splits.concat(branchesCopy[index + 1].splits);
		branchesCopy.splice(index + 1, 1);
		let newActiveBranch = activeBranch;
		let newActiveSplit = activeSplit;
		if (activeBranch === index + 1) {
			newActiveBranch--;
			newActiveSplit += oldSplitSize;
		}
		return {
			branches: branchesCopy,
			activeBranch: newActiveBranch,
			activeSplit: newActiveSplit,
		}
	}

}

export function breakBranchAt(bIndex, sIndex) {
	return function ({ branches, activeBranch, activeSplit }) {
		const branchesCopy = deepCopyBranches(branches);
		const lowSplits = branchesCopy[bIndex].splits.slice(sIndex);
		branchesCopy[bIndex].splits = branchesCopy[bIndex].splits.slice(0, sIndex);
		const newBranch = sanitizeBranch();
		newBranch.expanded = true;
		newBranch.splits = lowSplits;
		branchesCopy.splice(bIndex + 1, 0, newBranch);

		let newActiveBranch = activeBranch;
		let newActiveSplit = activeSplit;
		if (activeBranch === bIndex && activeSplit >= sIndex) {
			newActiveBranch++;
			newActiveSplit -= sIndex;
		}
		return {
			branches: branchesCopy,
			activeBranch: newActiveBranch,
			activeSplit: newActiveSplit,
		}
	}

}

export function collapseAll() {
	return function ({ branches }) {
		const branchesCopy = deepCopyBranches(branches);
		branchesCopy.forEach(branch => {
			branch.expanded = false;
			branch.splits.forEach(split => {
				split.expanded = false;
				split.actions.forEach(action => {
					action.expanded = false;
				})
			})
		});
		return {
			branches: branchesCopy,
			activeAction: -1,
			activeBranch: -1,
			activeSplit: -1,
		};
	}
}

export function createActionAt(bIndex, sIndex, index) {
	return function ({ branches, activeBranch, activeSplit, activeAction }) {
		const branchesCopy = deepCopyBranches(branches);
		const newAction = sanitizeAction();
		if (index >= branchesCopy[bIndex].splits[sIndex].actions.length) {
			branchesCopy[bIndex].splits[sIndex].actions.push(newAction);
		} else {
			branchesCopy[bIndex].splits[sIndex].actions.splice(index, 0, newAction);
		}
		let newActiveAction = activeAction;
		if (activeBranch === bIndex && activeSplit === sIndex) {
			if (activeAction > index) {
				newActiveAction++;
			}
		}
		return {
			branches: branchesCopy,
			activeAction: newActiveAction,
		};
	}
}

export function deleteActionAt(bIndex, sIndex, index) {
	return function ({ branches, activeBranch, activeSplit, activeAction }) {
		const branchesCopy = deepCopyBranches(branches);
		branchesCopy[bIndex].splits[sIndex].actions.splice(index, 1);
		let newActiveAction = activeAction;
		if (activeBranch === bIndex && activeSplit === sIndex) {
			if (activeAction === index) {
				newActiveAction = -1;
			} else if (activeAction > index) {
				newActiveAction--;
			}
		}
		return {
			branches: branchesCopy,
			activeAction: newActiveAction,
		}
	}
}

export function swapActions(bIndex, sIndex, ai, aj) {
	return function ({ branches, activeBranch, activeSplit, activeAction }) {
		const branchesCopy = deepCopyBranches(branches);
		const temp = branchesCopy[bIndex].splits[sIndex].actions[ai];
		branchesCopy[bIndex].splits[sIndex].actions[ai] = branchesCopy[bIndex].splits[sIndex].actions[aj];
		branchesCopy[bIndex].splits[sIndex].actions[aj] = temp;
		let newActiveAction = activeAction;
		if (activeBranch === bIndex && activeSplit === sIndex) {
			if (activeAction === ai) {
				newActiveAction = aj;
			} else if (activeAction === aj) {
				newActiveAction = ai;
			}
		}
		return {
			branches: branchesCopy,
			activeAction: newActiveAction,
		}
	}

}

export function setActionPropertyAt(bIndex, sIndex, index, property, value) {
	return function ({ branches }) {
		if (property === "deltas") return {};
		const branchesCopy = deepCopyBranches(branches);
		branchesCopy[bIndex].splits[sIndex].actions[index][property] = value;
		if (property === "deltaString") {
			applyActionDeltaStringEdit(branchesCopy[bIndex].splits[sIndex].actions[index]);
		}
		return {
			branches: branchesCopy
		}
	}
}

function applyActionDeltaStringEdit(action) {
	const [newDelta, error] = stringToDelta(action.deltaString);
	if (newDelta) {
		action.deltas = newDelta;
		action.deltaError = undefined;
	} else {
		action.deltas = {};
		action.deltaError = error;
	}
}

export function tryClearResourceErrorFrom(resources, branch, split) {
	if (!resources.error) return {};
	if (resources.error.branch < branch) return {};
	if (resources.error.branch === branch) {
		if (resources.error.split < split) return {};
	}
	const resourcesCopy = deepCopyResources(resources);
	resourcesCopy.error = undefined;
	return {
		resources: resourcesCopy
	}
}

export function getPreviousActionIndices(branches, b, s, a) {
	if (a <= 0 && s <= 0 && b <= 0) {
		return [-1, -1, -1, false];
	}
	let prevA;
	let prevS;
	let prevB;
	if (a <= 0) {
		if (s <= 0) {
			prevB = b - 1;
			prevS = branches[prevB].splits.length - 1;
			prevA = branches[prevB].splits[prevS].actions.length - 1;
		} else {
			prevB = b;
			prevS = s - 1;
			prevA = branches[prevB].splits[prevS].actions.length - 1;
		}
	} else {
		prevB = b;
		prevS = s;
		prevA = a - 1;
	}
	return [prevB, prevS, prevA, true];
}

export function calculateResourcesAt(resources, branches, items, b, s, a) {
	if (resources.error) return {};
	const resourcesCopy = deepCopyResources(resources);
	const action = branches[b].splits[s].actions[a];
	if (action.deltaError) {
		resourcesCopy.error = {
			branch: b,
			split: s,
			action: a,
			message: action.deltaError,
		};
		return { resources: resourcesCopy };
	}

	let newContent;
	let errorMessage;
	const [prevB, prevS, prevA, hasPrev] = getPreviousActionIndices(branches, b, s, a);
	if (!hasPrev) {
		[newContent, errorMessage] = applyDelta({}, items, action.deltas);
	} else {
		[newContent, errorMessage] = applyDelta(resources.content[prevB][prevS][prevA], items, action.deltas);
	}

	if (errorMessage) {
		resourcesCopy.error = {
			branch: b,
			split: s,
			action: a,
			message: errorMessage,
		};
	} else {
		if (!resourcesCopy.content) {
			resourcesCopy.content = [];
		}
		if (!resourcesCopy.content[b]) {
			resourcesCopy.content[b] = [];
		}
		if (!resourcesCopy.content[b][s]) {
			resourcesCopy.content[b][s] = [];
		}
		resourcesCopy.content[b][s][a] = newContent;
	}

	return { resources: resourcesCopy };
}

export function createItem(index) {
	return function ({ items }) {
		const itemsCopy = deepCopyItems(items);
		const newItem = sanitizeItem();
		if (index >= itemsCopy.length) {
			itemsCopy.push(newItem);
		} else {
			itemsCopy.splice(index, 0, newItem);
		}
		return {
			items: itemsCopy,
		}
	}
}

export function deleteItem(itemIndex) {
	return function ({ items }) {
		const itemsCopy = deepCopyItems(items);
		itemsCopy.splice(itemIndex, 1);
		return {
			items: itemsCopy,
		}
	}
}

export function setItemPropertyAt(itemIndex, property, value) {
	return function ({ branches, items }) {
		const itemsCopy = deepCopyItems(items);
		const oldValue = itemsCopy[itemIndex][property];
		itemsCopy[itemIndex][property] = value;
		if (property === "name") {
			const branchesCopy = deepCopyBranches(branches);
			renameItemInDeltaString(branchesCopy, value, oldValue);
			return {
				items: itemsCopy,
				branches: branchesCopy,
			}
		} else {
			return {
				items: itemsCopy,
			}
		}

	}
}

export function removeUnusedItems() {
	return function ({ branches, items }) {
		const itemsCopy = deepCopyItems(items);
		const branchesCopy = deepCopyBranches(branches);
		const usedItems = getUsedItemsInDeltaString(branchesCopy);
		removeUnusedItemsInDeltaString(branchesCopy, usedItems);
		return {
			items: itemsCopy,
			branches: branchesCopy,
		}
	}
}

function deepCopyBranches(branches) {
	return branches.map(sanitizeBranch);
}

function deepCopyResources(resources) {
	const content = deepCopyResourceContent(resources.content);
	const error = resources.error ? { ...resources.error } : undefined;
	return { content, error };
}

function deepCopyResourceContent(content) {
	return content.map(branchContent => branchContent.map(splitContent => splitContent.map(actionContent => ({ ...actionContent }))));
}

function deepCopyItems(items) {
	return items.map(sanitizeItem);
}

function applyDelta(resource, items, delta) {
	const copy = { ...resource };
	for (const name in delta) {
		if (!(name in items)) return [null, `Item "${name}" is undefined. Add "*" at the beginning of the item to define it`];
		if (!(name in resource)) {
			resource[name] = 0;
		}
		if (delta[name].type.startsWith("ref")) {
			if (!(delta[name].value in items)) return [null, `Item "${name}" refers to undefined item "${delta[name].value}"`];
			if (!(delta[name].value in resource)) {
				resource[delta[name].value] = 0;
			}
		}
		switch (delta[name].type) {
			case "add":
				copy[name] = resource[name] + delta[name].value;
				break;
			case "set":
				copy[name] = delta[name].value;
				break;
			case "ref_add":
				copy[name] = resource[name] + resource[delta[name].value];
				break;
			case "ref_sub":
				copy[name] = resource[name] - resource[delta[name].value];
				break;
			case "ref_set":
				copy[name] = resource[delta[name].value];
				break;
			default: return [null, `Invalid delta type in item "${name}"`];
		}
	}
	return [copy, null];
}

function renameItemInDeltaString(branchesCopy, oldName, newName) {
	branchesCopy.forEach(branch => branch.splits.forEach(split => split.actions.forEach(action => {
		const [deltas, error] = stringToDelta(action.deltaString);
		if (!error) {
			renameItemInDelta(deltas, oldName, newName);
			action.deltaString = deltaToString(deltas);
		}

	})));
}

function getUsedItemsInDeltaString(branchesCopy) {
	const items = {};
	branchesCopy.forEach(branch => branch.splits.forEach(split => split.actions.forEach(action => {
		const [deltas, error] = stringToDelta(action.deltaString);
		if (!error) {
			for (const name in deltas) {
				items[name] = true;
			}
		}
	})));
	return items;
}

function removeUnusedItemsInDeltaString(branchesCopy, usedItems) {
	branchesCopy.forEach(branch => branch.splits.forEach(split => split.actions.forEach(action => {
		const [deltas, error] = stringToDelta(action.deltaString);
		if (!error) {
			for (const name in deltas) {
				if (!(name in usedItems)) {
					delete deltas.name;
				}
			}
			action.deltaString = deltaToString(deltas);
		}

	})));
}


