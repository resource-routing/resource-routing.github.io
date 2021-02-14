import { connect } from "react-redux";
import ExpandButton from "../ExpandButton";
import SplitList from "components/split/SplitList";
import {
	isBranchExpanded,
	getBranchName,
	getBranchCount
} from "store/routing/selectors";
import {
	createBranch,
	setBranchName,
	setBranchExpanded,
	deleteBranch,
	swapBranches,
} from "store/routing/actions";
import { isEditingNav } from "store/application/selectors";
import {
	setInfo
} from "store/application/actions";
import { ActionCreatorWithPayload, bindActionCreators, Dispatch } from "@reduxjs/toolkit";
import { benchEnd, benchStart } from "util/benchmark";
import { AppAction } from "apptype";
import { ReduxGlobalState } from "store/store";

type Props = {
	index: number,
	name: string,
	expanded: boolean,
	editing: boolean,
	actions: {
		createBranch: ActionCreatorWithPayload<{ branchIndex: number }>,
		setBranchName: ActionCreatorWithPayload<{ branchIndex: number, name: string }>,
		setBranchExpanded: ActionCreatorWithPayload<{ branchIndex: number, expanded: boolean }>,
		deleteBranch: ActionCreatorWithPayload<{ branchIndex: number }>,
		setInfo: ActionCreatorWithPayload<{ info: string }>,
		swapBranches: ActionCreatorWithPayload<{ i: number, j: number }>,
	},
	isLast: boolean,
	appActions: AppAction,
}

export const Branch: React.FunctionComponent<Props> = ({ index, name, expanded, editing, actions, isLast, appActions }: Props) => {
	const displayName = name || "[Unnamed Branch]";
	const isFirst = index === 0;
	const expandButtonCell =
		<td className="icon-button-width">
			<ExpandButton expanded={expanded} setExpanded={(expanded) => {
				actions.setBranchExpanded({ branchIndex: index, expanded });
			}} />
		</td>;
	let branchNode;
	if (editing) {
		branchNode =
			<tr>
				{expandButtonCell}
				<td colSpan={6}>
					<input
						className="full-width"
						placeholder="Branch Name"
						type="text"
						value={name}
						onChange={(e) => {
							actions.setBranchName({ branchIndex: index, name: e.target.value });
						}}
					/>
				</td>
				<td className="icon-button-width">
					{!isFirst &&
						<button className="icon-button" title="Move up" disabled={isFirst} onClick={() => {
							const startTime = benchStart();
							actions.swapBranches({ i: index, j: index - 1 });
							actions.setInfo({ info: `Branch moved. (${benchEnd(startTime)} ms)` });
						}}>&uarr;</button>
					}
				</td>
				<td className="icon-button-width">
					{!isLast &&
						<button className="icon-button" title="Move down" disabled={isLast} onClick={() => {
							const startTime = benchStart();
							actions.swapBranches({ i: index, j: index + 1 });
							actions.setInfo({ info: `Branch moved. (${benchEnd(startTime)} ms)` });
						}}>&darr;</button>
					}
				</td>
				<td className="icon-button-width">
					<button className="icon-button" title="Delete" onClick={() => {
						appActions.showAlert(
							`Delete branch "${name}"? All splits inside this branch will also be deleted. This is NOT reversible!`,
							[{
								name: "Cancel"
							}, {
								name: "Delete",
								execute: () => {
									const startTime = benchStart();
									actions.deleteBranch({ branchIndex: index });
									actions.setInfo({ info: `Branch deleted. (${benchEnd(startTime)} ms)` });
								}
							}]
						);
					}}>X</button>
				</td>
				<td className="icon-button-width">
					<button className="icon-button" title="New Branch Below" onClick={() => {
						actions.createBranch({ branchIndex: index + 1 });
					}}>*</button>
				</td>
			</tr>;
	} else {
		branchNode =
			<tr>
				{expandButtonCell}
				<td colSpan={10}>
					<strong>{displayName}</strong>
				</td>
			</tr>;
	}
	if (!expanded) {
		return branchNode;
	}
	return <>
		{branchNode}
		<SplitList
			branchIndex={index}
			appActions={appActions}
		/>
	</>;

};

type ExternalProps = {
	index: number,
	appActions: AppAction,
}

const mapStateToProps = (state: ReduxGlobalState, ownProps: ExternalProps) => ({
	name: getBranchName(state, ownProps.index),
	expanded: isBranchExpanded(state, ownProps.index),
	isLast: getBranchCount(state) === ownProps.index + 1,
	editing: isEditingNav(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
	actions: bindActionCreators({
		createBranch,
		setBranchName,
		setBranchExpanded,
		deleteBranch,
		setInfo,
		swapBranches,
	}, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Branch);