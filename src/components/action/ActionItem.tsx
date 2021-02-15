import { connect, ConnectedProps } from "react-redux";
import DeltaList from "./DeltaList";
import {
	getActiveSplitActionCount,
	getActiveSplitActionDeltaError,
	getActiveSplitActionDeltas,
	getActiveSplitActionDeltaString,
	getActiveSplitActionName,
	isActiveSplitActionExpanded
} from "store/routing/selectors";
import { DeltaError, ActionDelta } from "data/delta";
import { AppAction } from "apptype";
import { ReduxGlobalState } from "store/store";
import { bindActionCreators, Dispatch } from "@reduxjs/toolkit";
import React from "react";
import ExpandButton from "components/ExpandButton";
import { isEditingActions } from "store/application/selectors";


type ExternalProps = {
	index: number,
	appActions: AppAction,
}

const mapStateToProps = (state: ReduxGlobalState, { index }: ExternalProps) => ({
	name: getActiveSplitActionName(state, index),
	expanded: isActiveSplitActionExpanded(state, index),
	length: getActiveSplitActionCount(state),
	deltaString: getActiveSplitActionDeltaString(state, index),
	deltaError: getActiveSplitActionDeltaError(state, index),
	deltas: getActiveSplitActionDeltas(state, index),
	editing: isEditingActions(state),
});

const mapDispatchToProps = (dispatch: Dispatch, ownProps: ExternalProps) => ({
	actions: bindActionCreators({

	}, dispatch)
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type Props = ConnectedProps<typeof connector> & ExternalProps;

export const ActionItem: React.FunctionComponent<Props> = ({
	index, name = "", expanded = false, editing, actions, deltaString = "", deltaError = null, deltas, length = 0, appActions,
}: Props) => {
	const displayName = name || "[Unnamed Action]";
	const isFirst = index === 0;
	const isLast = index === length - 1;
	const actionNode = (
		<tr>
			<td className="icon-button-width">
				{deltaString && <ExpandButton expanded={expanded} setExpanded={() => {
					//actions.doToBranches(setActionPropertyAt(branchIndex, splitIndex, index, "expanded", expanded), `Action ${expanded ? "expanded" : "collapsed"}.`)
				}} />

				}

			</td>
			{editing &&
				<td className="action-name-width">
					<input
						className="action-name-width"
						placeholder="Action Title/Notes"
						type="text"
						value={name}
						onChange={(e) => {
							//actions.doToBranches(setActionPropertyAt(branchIndex, splitIndex, index, "name", e.target.value));
						}} />
				</td>

			}

			{!editing &&

				<td colSpan={6}><span>{deltaString ? <strong>{displayName}</strong> : <em>{displayName}</em>}</span></td>}


			{editing &&
				<td>
					<input
						className="full-width"
						placeholder="Delta String"
						type="text"
						value={deltaString}
						onChange={(e) => {
							//actions.doToBranches(setActionPropertyAt(branchIndex, splitIndex, index, "deltaString", e.target.value), "Delta string changed.", branchIndex, splitIndex);
						}} />
				</td>

			}
			{editing && <td className="icon-button-width">
				<button className="icon-button" disabled={isFirst} title="Move up" onClick={() => {
					//actions.doToBranches(swapBranches(index, index - 1), "Branch moved.", index - 1);
				}}>&uarr;</button>
			</td>}
			{editing &&
				<td className="icon-button-width">
					<button className="icon-button" title="Move down" disabled={isLast} onClick={() => {
						//actions.doToBranches(swapBranches(index, index + 1), "Branch moved.", index);
					}}>&darr;</button>
				</td>}
			{editing &&
				<td className="icon-button-width">
					<button className="icon-button" title="Delete" onClick={() => {

					}} disabled>X</button>
				</td>
			}
			{editing &&
				<td className="icon-button-width">
					<button className="icon-button" title="New Branch Below" onClick={() => {

					}} disabled>*</button>
				</td>
			}
		</tr>
	);

	//const deltaNode = <DeltaList key={"action_" + actionIndex + "_delta"} actionIndex={actionIndex} />;

	//if (!expanded || !deltaString) 
	return actionNode;
	//return [actionNode, deltaNode];
}


export default connector(ActionItem);