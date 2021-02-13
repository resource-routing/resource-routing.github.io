import { connect } from "react-redux";
import ExpandButton from "components/ExpandButton";
import {
	isHeaderCollapsed,
	isSideSectionCollapsed
} from "store/application/selectors";
import {
	getProjectName
} from "store/routing/selectors";
import {
	isAutoSaveEnabled,
	isObjectMapLinkEnabled,
} from "store/setting/selectors";
import {
	setHeaderCollapsed
} from "store/application/actions";
import { bindActionCreators } from "@reduxjs/toolkit";
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
	);

	return (
		<div className="overflow-hidden">

			{
				!sideCollapsed && <h3 className="overflow-hidden">
					{projectName}

				</h3>
			}

			<ExpandButton expanded={!headerCollapsed} setExpanded={(expanded) => actions.setHeaderCollapsed({ collapsed: !expanded })} />


			{!sideCollapsed && allButtons}

		</div>

	);
}

const mapStateToProps = (state) => ({
	projectName: getProjectName(state),
	autoSaveEnabled: isAutoSaveEnabled(state),
	linkToMapEnabled: isObjectMapLinkEnabled(state),
	sideCollapsed: isSideSectionCollapsed(state),
	headerCollapsed: isHeaderCollapsed(state),
});

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		setHeaderCollapsed
	}, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);