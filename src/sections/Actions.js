
import Box from './components/Box';
import ActionList from "./components/ActionList";
import { useState } from "react";
import ExpandButton from "./components/ExpandButton";
import { getActiveBranch, getActiveSplitName, getActiveSplit } from './components/util/select';
import { connect } from 'react-redux';

export function Actions({ layout, splitName, resourcesCollapsed, actions }) {
	const [editing, setEditing] = useState(false);
	const buttonSection = (
		<span>
			<button className="space-left-small" onClick={() => setEditing(!editing)}>{editing ? "Finish" : "Edit"}</button>
			<button className="space-left-small" disabled>Previous</button>
			<button className="space-left-small" disabled>Next</button>
		</span>
	);
	const actionSection = splitName ? (
		<ActionList
			editing={editing}
			actions={actions} />
	) : (
			"Click on a split to view details."
		);
	return (
		<div >
			<Box layout={layout.main} borderClass="overflow-auto">
				<div>
					{!resourcesCollapsed && actionSection}
				</div>
			</Box>
			<Box layout={layout.header} >
				<div>
					<ExpandButton
						expanded={!resourcesCollapsed} setExpanded={(expanded) => actions.setResourcesCollapsed(!expanded)} />
					<strong> Split Detail {splitName && (" - " + splitName)}</strong>
					{!resourcesCollapsed && buttonSection}
					{!resourcesCollapsed && <hr />}
				</div>

			</Box>



		</div>
	)
};

const mapStateToProps = (state, ownProps) => ({
	splitName: getActiveSplitName(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Actions);