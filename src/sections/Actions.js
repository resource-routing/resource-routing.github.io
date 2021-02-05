import ExpandButton from "./components/ExpandButton";
import Box from './components/Box';
import ActionList from "./components/ActionList";

export default function Actions({ layout, resourcesCollapsed, actionList, actions, splitName, splitIndex, branchIndex }) {
	const buttonSection = (
		<span>
			<button className="space-left-small" disabled>Edit</button>
			<button className="space-left-small" disabled>Previous</button>
			<button className="space-left-small" disabled>Next</button>
		</span>
	);
	const actionSection = actionList ? (
		<ActionList
			actionList={actionList}
			editing={false}
			actions={actions}
			splitIndex={splitIndex}
			branchIndex={branchIndex} />
	) : (
			"Click on a split to view details."
		);
	return (
		<div >
			<Box layout={layout.header} >
				<div>
					<ExpandButton
						expanded={!resourcesCollapsed} setExpanded={(expanded) => actions.setResourcesCollapsed(!expanded)} />
					<strong> Split Detail {actionList && (" - " + splitName)}</strong>
					{!resourcesCollapsed && buttonSection}

				</div>
				<hr />
			</Box>
			<Box layout={layout.main} borderClass="overflow-auto">
				<div>
					{!resourcesCollapsed && actionSection}
				</div>
			</Box>


		</div>
	)
}