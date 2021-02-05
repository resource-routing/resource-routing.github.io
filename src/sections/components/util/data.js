import stringToDelta from './actiondelta';
import { sanitizeBranch, sanitizeAction, sanitizeSplit } from './storage';

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

export function setActionPropertyAt(branches, bIndex, sIndex, index, property, value) {
	return function ({ branches }) {
		if (property === "deltas") return {};
		const branchesCopy = deepCopyBranches(branches);
		branchesCopy[bIndex].splits[sIndex].actions[index][property] = value;
		return {
			branches: branchesCopy
		}
	}
}

export function applyActionEditAtSplit(bIndex, sIndex) {
	return function ({ branches }) {
		const branchesCopy = deepCopyBranches(branches);
		for (let a = 0; a < branches[bIndex].splits[sIndex].actions.length; a++) {
			const action = branches[bIndex].splits[sIndex].actions[a];
			const newDelta = stringToDelta(action.deltaString);
			if (newDelta) {
				action.deltas = newDelta;
				action.deltaError = false;
			} else {
				action.deltas = {};
				action.deltaError = true;
			}
		}
		return {
			branches: branchesCopy,
		}
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

export function calculateResourcesAt(resources, branches, b, s, a) {
	if (resources.error) return {};
	const resourcesCopy = deepCopyResources(resources);
	const action = branches[b].splits[s].actions[a];
	if (action.deltaError) {
		resourcesCopy.error = {
			branch: b,
			split: s,
			action: a
		};
		return { resources: resourcesCopy };
	}

	let newContent;
	if (a <= 0 && s <= 0 && b <= 0) {
		newContent = applyDelta({}, action.deltas);
	} else {
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
		newContent = applyDelta(resources.content[prevB][prevS][prevA], action.deltas);
	}

	if (!newContent) {
		resourcesCopy.error = {
			branch: b,
			split: s,
			action: a
		};
	} else {
		resourcesCopy.content[b][s][a] = newContent;
	}

	return { resources: resourcesCopy };
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

function applyDelta(resource, delta) {
	const copy = { ...resource };
	for (const name in delta) {
		if (!(name in resource) && !delta[name].create) return null;
		switch (delta[name].type) {
			case "add":
				copy[name] = resource[name] + delta[name].value;
				break;
			case "set":
				copy[name] = delta[name].value;
				break;
			case "ref_add":
				if (!(delta[name].value in resource)) return null;
				copy[name] = resource[name] + resource[delta[name].value];
				break;
			case "ref_sub":
				if (!(delta[name].value in resource)) return null;
				copy[name] = resource[name] - resource[delta[name].value];
				break;
			case "ref_set":
				if (!(delta[name].value in resource)) return null;
				copy[name] = resource[delta[name].value];
				break;
			default: return null;
		}
	}
	return copy;
}

