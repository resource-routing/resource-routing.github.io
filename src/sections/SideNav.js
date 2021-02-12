import { useState } from "react";
import Box from "./components/Box";
import BranchList from "./components/BranchList";
import ExpandButton from "./components/ExpandButton";
import { collapseAll } from "./components/util/data";
import { connect } from "react-redux";

export function SideNav({ layout, sideCollapsed, actions }) {
	const [editing, setEditing] = useState(false);
	let buttonSection = (
		<span>
			<button className="space-left-small" onClick={() => setEditing(!editing)}>{editing ? "Finish" : "Edit"}</button>
			<button className="space-left-small" disabled >Collapse All</button>
		</span>
	);
	let branchSection =
		<BranchList
			editing={editing}
			actions={{ ...actions, setEditing }} />;
	return (
		<div>
			<Box layout={layout.main} borderClass="overflow-auto">
				<div>
					{!sideCollapsed && branchSection}
				</div>
			</Box>
			<Box layout={layout.header} >
				<div>
					<ExpandButton expanded={!sideCollapsed} setExpanded={(expanded) => {
						actions.setSideCollapsed(!expanded);
					}} />
					{!sideCollapsed && buttonSection}
				</div>
				<hr />
			</Box>
		</div>
	);
}

const mapStateToProps = (state, ownProps) => ({

})

const mapDispatchToProps = (dispatch, ownProps) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(SideNav);