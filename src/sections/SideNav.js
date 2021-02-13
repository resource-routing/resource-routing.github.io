import Box from "components/Box";
import BranchList from "components/branch/BranchList";
import ExpandButton from "components/ExpandButton";
import { connect } from "react-redux";
import {
	getSideHeaderBounds,
	getSideMainBounds,
	isEditingNav,
	isSideSectionCollapsed
} from "store/application/selectors";
import {
	setSideCollapsed,
	setEditingNav
} from "store/application/actions";
import { bindActionCreators } from "@reduxjs/toolkit";


export function SideNav({
	sideHeaderBounds,
	sideMainBounds,
	sideCollapsed,
	actions,
	editing,
}) {
	const buttonSection = (
		<span>
			<button className="space-left-small" onClick={() => actions.setEditingNav({ editing: !editing })} >{editing ? "Finish" : "Edit"}</button>
			<button className="space-left-small" disabled >Collapse All</button>
		</span>
	);
	return (
		<div>
			<Box layout={sideMainBounds} borderClass="overflow-auto">
				<div>
					{!sideCollapsed && <BranchList />}
				</div>
			</Box>
			<Box layout={sideHeaderBounds} >
				<div>
					<ExpandButton expanded={!sideCollapsed} setExpanded={(expanded) => {
						actions.setSideCollapsed({ collapsed: !expanded });
					}} />
					{!sideCollapsed && buttonSection}
				</div>
				<hr />
			</Box>
		</div>
	);
}

const mapStateToProps = (state) => ({
	sideHeaderBounds: getSideHeaderBounds(state),
	sideMainBounds: getSideMainBounds(state),
	sideCollapsed: isSideSectionCollapsed(state),
	editing: isEditingNav(state),
});

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		setSideCollapsed,
		setEditingNav
	}, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SideNav);