import { useState } from 'react';
import ExpandButton from './components/ExpandButton';
import { benchmarkTime } from './components/util/benchmark';
import { readFromFile } from './components/util/storage';
export default function Header({ autoSave, projectName, headerCollapsed, sideCollapsed, actions }) {
	const [file, setFile] = useState(undefined);
	const exportButton = (
		<button className="vertical-center space-left-small" onClick={() => actions.download()}>Export</button>
	);
	const saveButton = (
		<button className="vertical-center space-left-small" onClick={() => actions.saveStateToLocalStorage()}>Save</button>
	);
	const buttonSection = (
		<span>
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
			{exportButton}
			{saveButton}
			<button className="vertical-center space-left-small" onClick={() => actions.setAutoSave(!autoSave)}>{autoSave ? "Auto Save: Enabled" : "Auto Save: Disabled"}</button>
			<button className="vertical-center space-left-small" onClick={() => actions.setAutoSave(!autoSave)} disabled>{autoSave ? "Map: Enabled" : "Map: Disabled"}</button>
			<button className="vertical-center space-left-small" onClick={() => actions.saveStateToLocalStorage()} disabled>Force Update Resources</button>
			<button className="vertical-center space-left-small" onClick={() => actions.saveStateToLocalStorage()} disabled>Help</button>
			<button className="vertical-center space-left-small" onClick={() => actions.saveStateToLocalStorage()} disabled>Reset</button>
		</span>
	)
	const allButtons = (
		<span>
			{!headerCollapsed && buttonSection}
			{headerCollapsed && exportButton}
			{headerCollapsed && saveButton}
		</span>
	)
	return (
		<div className="overflow-hidden">
			{!(sideCollapsed && headerCollapsed) && <h3 className="overflow-hidden">{projectName}</h3>}
			<ExpandButton expanded={!headerCollapsed} setExpanded={(expanded) => actions.setHeaderCollapsed(!expanded)} />
			{!(sideCollapsed && headerCollapsed) && allButtons}

		</div>

	)
}