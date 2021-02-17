
import Box from "components/Box";
import ActionList from "components/action/ActionList";
import { useState } from "react";
import ExpandButton from "components/ExpandButton";
import {
	getActiveBranch,
	getActiveSplit,
	getActiveSplitName,
	getSplitCoords,
} from "store/routing/selectors";
import { setSplitCoords } from "store/routing/actions";
import { connect, ConnectedProps } from "react-redux";
import { AppAction } from "apptype";
import { ReduxGlobalState } from "store/store";
import { bindActionCreators, Dispatch } from "@reduxjs/toolkit";
import {
	getActionsHeaderBounds,
	getActionsMainBounds,
	isActionSectionCollapsed,
	isEditingActions
} from "store/application/selectors";
import {
	setActionsCollapsed,
	setEditingActions
} from "store/application/actions";
import { parseCoords } from "data/split";

type ExternalProps = {
	appActions: AppAction
}
const mapStateToProps = (state: ReduxGlobalState) => {
	const activeBranch = getActiveBranch(state);
	const activeSplit = getActiveSplit(state);
	let activeCoords;
	if (activeBranch !== -1 && activeSplit !== -1) {
		activeCoords = getSplitCoords(state, activeBranch, activeSplit);
	}
	return {
		actionMainBounds: getActionsMainBounds(state),
		actionHeaderBounds: getActionsHeaderBounds(state),
		collapsed: isActionSectionCollapsed(state),
		splitName: getActiveSplitName(state),
		editing: isEditingActions(state),
		splitCoords: activeCoords,
		activeBranch,
		activeSplit,
	};
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
	actions: bindActionCreators({
		setActionsCollapsed,
		setEditingActions,
		setSplitCoords,
	}, dispatch)
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & ExternalProps

export const Actions: React.FunctionComponent<Props> = ({
	actionMainBounds, actionHeaderBounds, collapsed, editing, splitName, activeBranch, activeSplit, splitCoords, appActions, actions
}: Props) => {

	const [coordString, setCoordString] = useState("");

	const expandButton = <ExpandButton
		expanded={!collapsed} setExpanded={(expanded) => actions.setActionsCollapsed({ collapsed: !expanded })}
	/>;

	let coordSection = undefined;
	if (splitName !== undefined) {
		if (editing) {
			coordSection =
				<input
					className="space-left-small"
					type="text"
					placeholder="Coords (e.g. -254, -1061.37, 7)"
					value={coordString}
					onChange={(e) => {
						setCoordString(e.target.value);
						const coords = parseCoords(e.target.value);
						if (coords !== undefined) {
							const [x, y, z] = coords;
							actions.setSplitCoords({
								branchIndex: activeBranch,
								splitIndex: activeSplit,
								x,
								y,
								z,
							});
						}
					}} />;
		} else {
			coordSection = <span className="space-left-small"><em>{splitCoords ? splitCoords.join(", ") : "Invalid Coordinates"}</em></span>;
		}
	}

	const buttonSection = splitName !== undefined &&
		<span>
			<button className="space-left-small" onClick={() => {
				if (editing) {
					const coords = parseCoords(coordString);
					if (coords === undefined) {
						const message = <>Invalid coordinates: {coordString}<br />Format: x, y, z</>;
						appActions.showAlert(message);
					} else {
						const [x, y, z] = coords;
						actions.setSplitCoords({
							branchIndex: activeBranch,
							splitIndex: activeSplit,
							x,
							y,
							z,
						});
						actions.setEditingActions({ editing: false });
					}
				} else {
					if (splitCoords !== undefined) {
						setCoordString(splitCoords.join(", "));
					} else {
						setCoordString("");
					}
					actions.setEditingActions({ editing: true });
				}

			}}>
				{editing ? "Finish" : "Edit"}
			</button>
			{coordSection}
			<button className="space-left-small" disabled>Go to Coords</button>
			<button className="space-left-small" disabled>Previous</button>
			<button className="space-left-small" disabled>Next</button>
		</span>;

	return (
		<div >
			<Box layout={actionMainBounds} borderClass="overflow-auto">
				<div>
					{!collapsed && <ActionList appActions={appActions} />}
				</div>
			</Box>
			<Box layout={actionHeaderBounds} >
				<div>
					{expandButton}
					<strong> Split Detail {splitName && " - " + splitName}</strong>
					{!collapsed && <>{buttonSection}<hr /></>}
				</div>
			</Box>
		</div>
	);
};

export default connector(Actions);