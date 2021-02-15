import Box from "components/Box";
import BranchList from "components/branch/BranchList";
import ExpandButton from "components/ExpandButton";
import { connect, ConnectedProps } from "react-redux";
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

type ExternalProps = {
	appActions: AppAction,
}

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

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & ExternalProps;

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



export default connector(SideNav);