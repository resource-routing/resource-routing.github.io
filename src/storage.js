
const KEY = "RRT_STATE_v1"


export function readFromFile(file, storedStateCallback) {
	if (file) {

		const reader = new FileReader();
		reader.onloadend = () => {
			const str = reader.result;
			if (str) {
				storedStateCallback(sanitizeState(JSON.parse(str)));
			} else {
				storedStateCallback(sanitizeState());
			}
		}
		reader.readAsText(file);
	}

}

export function downloadToFile(state) {
	const str = JSON.stringify(sanitizeState(state));
	const blob = new Blob([str], { type: "text" });
	const a = document.createElement('a');
	const fileName = state.projectName + ".json" || "Resource_Routing.json";
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
		return sanitizeState(JSON.parse(str));
	} else {
		return sanitizeState();
	}
}

export function saveToLocalStorage(state) {
	const str = JSON.stringify(sanitizeState(state));
	localStorage.setItem(KEY, str);
}

export function clearLocalStorage() {
	localStorage.removeItem(KEY);
}

function sanitizeState(state) {
	if (!state) {
		return {
			projectName: "Untitled Project",
			activeSplit: -1,
			activeBranch: -1,
			branches: []
		}
	}
	const activeBranch = sanitizeIndex(state.activeBranch, state.branches);
	let activeSplit;
	if (activeBranch === -1) {
		activeSplit = -1;
	} else {
		activeSplit = sanitizeIndex(state.activeSplit, state.branches[state.activeBranch].splits);
	}
	return {
		projectName: state.projectName || "Untitled Project",
		activeBranch,
		activeSplit,
		branches: state.branches.map(sanitizeBranch)
	}
}

function sanitizeIndex(i, array) {
	if (!array || !array.length) return -1;
	if (i < 0) return -1;
	if (i > array.length) return -1;
	return i;
}

function sanitizeBranch(branch) {
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

function sanitizeSplit(split) {
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

function sanitizeAction(action) {
	const template = {
		name: "",
		deltas: []
	}
	if (!action) {
		return { ...template };
	}
	const clean = { ...template };
	if (action.name) {
		clean.name = action.name;
	}
	if (action.deltas) {
		clean.deltas = action.deltas.map(sanitizeDelta)
	}
}

function sanitizeDelta(delta) {
	return {};
}

