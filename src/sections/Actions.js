
import Box from './components/Box';
import ActionList from "./components/ActionList";
import { useState } from "react";
import ExpandButton from "./components/ExpandButton";

export default function Actions({ layout, resourcesCollapsed, actionList, actions, splitName, splitIndex, branchIndex }) {
	const [editing, setEditing] = useState(false);
	const buttonSection = (
		<span>
			<button className="space-left-small" onClick={() => setEditing(!editing)}>{editing ? "Finish" : "Edit"}</button>
			<button className="space-left-small" disabled>Previous</button>
			<button className="space-left-small" disabled>Next</button>
		</span>
	);
	const actionSection = actionList ? (
		<ActionList
			actionList={actionList}
			editing={editing}
			actions={actions}
			splitIndex={splitIndex}
			branchIndex={branchIndex} />
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
					<strong> Split Detail {actionList && (" - " + splitName)}</strong>
					{!resourcesCollapsed && buttonSection}
					{!resourcesCollapsed && <hr />}
				</div>

			</Box>



		</div>
	)
}