import { useState } from 'react';
import { benchmarkTime } from './benchmark';
import { readFromFile } from './storage';
export default function Header({ autoSave, projectName, actions }) {
	const [file, setFile] = useState(undefined);
	return (
		<div>
			<h1>{projectName}</h1>
			<button className="vertical-center space-left-small" onClick={() => {
				actions.setProjectName(prompt("Enter Project Name", projectName));
			}}>Edit Project Name</button>
			<input className="vertical-center space-left-small" type="file" onChange={(e) => {
				console.log(e);
				setFile(e.target.files);
			}} />
			<button className="vertical-center space-left-small" disabled={!file} onClick={() => {
				if (file && file[0]) {
					const startTime = benchmarkTime();
					readFromFile(file[0], (storedState) => {
						actions.loadStoredState(() => storedState, startTime);
					})
				}


			}}>Import</button>
			<button className="vertical-center space-left-small" onClick={() => actions.download()}>Export</button>
			<button className="vertical-center space-left-small" onClick={() => actions.setAutoSave(!autoSave)}>{autoSave ? "Auto Save: Enabled" : "Auto Save: Disabled"}</button>
			<button className="vertical-center space-left-small" onClick={() => actions.saveStateToLocalStorage()}>Save</button>
		</div>

	)
}