import { stringToDelta } from "./delta";
const KEY = "RRT_STATE_v1";


// export function readFromFile(file, storedStateCallback) {
// 	if (file) {

// 		const reader = new FileReader();
// 		reader.onloadend = () => {
// 			const str = reader.result;
// 			if (str) {
// 				storedStateCallback(stringToState(JSON.parse(str)));
// 			} else {
// 				storedStateCallback(stringToState(""));
// 			}
// 		};
// 		reader.readAsText(file);
// 	}

// }

// export function downloadToFile(state) {
// 	const str = JSON.stringify(minimize(state));
// 	const blob = new Blob([str], { type: "text" });
// 	const a = document.createElement("a");
// 	const fileName = (state.projectName || "Resource_Routing") + ".json";
// 	a.download = fileName;
// 	a.href = URL.createObjectURL(blob);
// 	a.dataset.downloadurl = ["text", a.download, a.href].join(":");
// 	a.style.display = "none";
// 	document.body.appendChild(a);
// 	a.click();
// 	document.body.removeChild(a);
// 	setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
// }

// export function readFromLocalStorage() {
// 	const str = localStorage.getItem(KEY);
// 	if (str) {
// 		return stringToState(JSON.parse(str));
// 	} else {
// 		return stringToState("");
// 	}
// }

// export function saveToLocalStorage(state) {
// 	const str = JSON.stringify(minimize(state));
// 	localStorage.setItem(KEY, str);
// }

// export function clearLocalStorage() {
// 	localStorage.removeItem(KEY);
// }
