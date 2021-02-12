import { stringToDelta } from "./delta";
const KEY = "RRT_STATE_v1"


export function readFromFile(file, storedStateCallback) {
	if (file) {

		const reader = new FileReader();
		reader.onloadend = () => {
			const str = reader.result;
			if (str) {
				storedStateCallback(stringToState(JSON.parse(str)));
			} else {
				storedStateCallback(stringToState(""));
			}
		}
		reader.readAsText(file);
	}

}

export function downloadToFile(state) {
	const str = JSON.stringify(minimize(state));
	const blob = new Blob([str], { type: "text" });
	const a = document.createElement('a');
	const fileName = (state.projectName || "Resource_Routing") + ".json";
	a.download = fileName
	a.href = URL.createObjectURL(blob);
	a.dataset.downloadurl = ["text", a.download, a.href].join(':');
	a.style.display = "none";
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
}

export function readFromLocalStorage() {
	const str = localStorage.getItem(KEY);
	if (str) {
		return stringToState(JSON.parse(str));
	} else {
		return stringToState("");
	}
}

export function saveToLocalStorage(state) {
	const str = JSON.stringify(minimize(state));
	localStorage.setItem(KEY, str);
}

export function clearLocalStorage() {
	localStorage.removeItem(KEY);
}

function stringToState(str) {
	return fillActionDeltas(sanitizeState(str));
}

function fillActionDeltas(state) {
	state.branches.forEach(branch => branch.splits.forEach(split => split.actions.forEach(action => {
		if (action.deltaString) {
			const [delta, error] = stringToDelta(action.deltaString);
			if (error) {
				action.deltaError = error;
				action.deltas = {};
			} else {
				action.deltaError = undefined;
				action.deltas = delta;
			}
		} else {
			action.deltaError = undefined;
			action.deltas = {};
		}

	})));
	return state;
}

export function sanitizeState(state) {
	if (!state) {
		return {
			projectName: "Untitled Project",
			activeSplit: -1,
			activeBranch: -1,
			activeAction: -1,
			branches: [],
			items: [],
		}
	}
	const activeBranch = sanitizeIndex(state.activeBranch, state.branches);
	let activeSplit;
	if (activeBranch === -1) {
		activeSplit = -1;
	} else {
		activeSplit = sanitizeIndex(state.activeSplit, state.branches[activeBranch].splits);
	}
	let activeAction;
	if (activeSplit === -1) {
		activeAction = -1;
	} else {
		activeAction = sanitizeIndex(state.activeAction, state.branches[activeBranch].splits[activeSplit].actions.length);
	}
	return {
		projectName: state.projectName || "Untitled Project",
		activeBranch,
		activeSplit,
		activeAction,
		branches: sanitizeArray(state.branches).map(sanitizeBranch),
		items: sanitizeArray(state.items).map(sanitizeItem),
	}
}

function sanitizeArray(array) {
	return array || [];
}

function sanitizeIndex(i, array) {
	if (i !== 0 && !i) return -1;
	if (!array || !array.length) return -1;
	if (i < 0) return -1;
	if (i >= array.length) return -1;
	return i;
}

export function sanitizeBranch(branch) {
	const template = {
		name: "",
		expanded: false,
		splits: []
	}
	if (!branch) {
		return { ...template };
	}
	const clean = { ...template };
	if (branch.name) {
		clean.name = branch.name;
	}
	if (branch.expanded) {
		clean.expanded = true;
	}
	if (branch.splits) {
		clean.splits = branch.splits.map(sanitizeSplit)
	}
	return clean;
}

export function sanitizeSplit(split) {
	const template = {
		name: "",
		expanded: false,
		actions: []
	}
	if (!split) {
		return { ...template };
	}
	const clean = { ...template };
	if (split.name) {
		clean.name = split.name;
	}
	if (split.expanded) {
		clean.expanded = true;
	}
	if (split.actions) {
		clean.actions = split.actions.map(sanitizeAction)
	}
	return clean;
}

export function sanitizeAction(action) {
	const template = {
		name: "",
		expanded: false,
		deltaString: "",
		deltaError: undefined,
		deltas: {},
	}
	if (!action) {
		return { ...template };
	}
	const clean = { ...template };
	if (action.name) {
		clean.name = action.name;
	}
	if (action.deltaString) {
		clean.deltaString = action.deltaString;
	}
	if (action.expanded) {
		clean.expanded = true;
	}
	if (action.deltaError) {
		clean.deltaError = action.deltaError;
	}
	if (action.deltas) {
		clean.deltas = sanitizeDelta(action.deltas)
	}
	return clean;
}

export function sanitizeDelta(delta) {
	const types = ["add", "set", "ref_add", "ref_set", "ref_sub"];
	const copy = {};
	for (const key in delta) {
		const t = delta[key].type
		if (t && types.includes(t)) {
			if (t === "add" || t === "set") {
				if (Number.isInteger(delta[key].value)) {
					copy[key] = {
						type: t,
						value: delta[key].value,
					}
				}
			} else {
				copy[key] = {
					type: t,
					value: delta[key].value.toString(),
				}
			}
		}
	}
	return copy;
}

export function sanitizeItem(item) {
	const template = {
		name: "",
		color: "",
	}
	if (!item) return { ...template };
	const copy = { ...template };
	if (item.name) {
		copy.name = item.name;
	}
	if (item.color) {
		copy.color = item.color;
	}
	return copy;
}

function minimize(state) {
	state = sanitizeState(state);
	return {
		...state,
		branches: state.branches.map(branch => (
			{
				...branch,
				splits: branch.splits.map(split => (
					{
						...split,
						actions: split.actions.map(action => (
							{
								...action,
								deltas: {}
							}
						))
					}
				))
			}
		))
	}
}
