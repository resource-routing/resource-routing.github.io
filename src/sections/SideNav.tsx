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
import { ActionCreatorWithPayload, bindActionCreators, Dispatch } from "@reduxjs/toolkit";
import { Bounds } from "util/layout";
import { AppAction } from "apptype";
import { ReduxGlobalState } from "store/store";

type Props = {
	sideHeaderBounds: Bounds,
	sideMainBounds: Bounds,
	sideCollapsed: boolean,
	actions: {
		setSideCollapsed: ActionCreatorWithPayload<{ collapsed: boolean }>,
		setEditingNav: ActionCreatorWithPayload<{ editing: boolean }>,
	},
	appActions: AppAction,
	editing: boolean,
}

export const SideNav: React.FunctionComponent<Props> = ({
	sideHeaderBounds,
	sideMainBounds,
	sideCollapsed,
	actions,
	appActions,
	editing,
}: Props) => {
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
					{!sideCollapsed && <BranchList appActions={appActions} />}
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
};

const mapStateToProps = (state: ReduxGlobalState) => ({
	sideHeaderBounds: getSideHeaderBounds(state),
	sideMainBounds: getSideMainBounds(state),
	sideCollapsed: isSideSectionCollapsed(state),
	editing: isEditingNav(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
	actions: bindActionCreators({
		setSideCollapsed,
		setEditingNav
	}, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SideNav);