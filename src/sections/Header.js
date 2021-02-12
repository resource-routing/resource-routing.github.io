import { useState } from 'react';
import { connect } from 'react-redux';
import ExpandButton from './components/ExpandButton';
import { benchmarkTime } from './components/util/benchmark';
import { readFromFile } from './components/util/sanitize';
import { getProjectName, isAutoSaveEnabled, isObjectMapLinkEnabled } from './components/util/select';
import clsx from "clsx";
export function Header({ autoSaveEnabled, linkToMapEnabled, projectName, headerCollapsed, sideCollapsed, actions }) {
	// const [file, setFile] = useState(undefined);
	const exportButton = (
		<button className="vertical-center space-left-small" disabled>Import/Export</button>
	);
	const saveButton = (
		<button className="vertical-center space-left-small" disabled>Save</button>
	);
	const buttonSection = (
		<span>
			<button className="vertical-center space-left-small" disabled>Edit Project Name</button>
			{/* <input className="vertical-center space-left-small" type="file" onChange={(e) => {
				console.log(e);
				setFile(e.target.files);
			}} /> */}

			{exportButton}
			{saveButton}
			<button className="vertical-center space-left-small" disabled>{autoSaveEnabled ? "Auto Save: Enabled" : "Auto Save: Disabled"}</button>
			<button className="vertical-center space-left-small" disabled>{linkToMapEnabled ? "Link Map: Enabled" : "Link Map: Disabled"}</button>
			<button className="vertical-center space-left-small" disabled>Force Update Resources</button>
			<button className="vertical-center space-left-small" disabled>Help</button>
			<button className="vertical-center space-left-small" disabled>Reset</button>
		</span>
	);
	const allButtons = (
		<span>
			{!headerCollapsed && buttonSection}
			{headerCollapsed && exportButton}
			{headerCollapsed && saveButton}
		</span>
	)

	return (
		<div className="overflow-hidden">

			{
				!sideCollapsed && <h3 className="overflow-hidden">
					{projectName}

				</h3>
			}





			<ExpandButton expanded={!headerCollapsed} setExpanded={(expanded) => actions.setHeaderCollapsed(!expanded)} />


			{!sideCollapsed && allButtons}

		</div>

	)
};

const mapStateToProps = (state, ownProps) => ({
	projectName: getProjectName(state),
	autoSaveEnabled: isAutoSaveEnabled(state),
	linkToMapEnabled: isObjectMapLinkEnabled(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	actions: {
		...ownProps.actions,
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);