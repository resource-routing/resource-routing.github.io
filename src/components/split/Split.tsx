import { connect } from "react-redux";
import ActionSummary from "components/action/ActionSummary";
import ExpandButton from "components/ExpandButton";
import {
	getBranchCount,
	getSplitCount,
	getSplitName,
	isSplitExpanded,
	getSplit,
} from "store/routing/selectors";
import { isEditingNav } from "store/application/selectors";
import {
	setSplitExpanded,
	setSplitName,
	deleteSplit,
	breakBranchAt,
	createSplit,
	swapSplits,
	moveFirstSplitToPreviousBranch,
	moveLastSplitToNextBranch,
} from "store/routing/actions";
import {
	setInfo,
	setSplitClipboard,
} from "store/application/actions";
import { getSplitClipboard } from "store/application/selectors";
import { ActionCreatorWithPayload, bindActionCreators, Dispatch } from "@reduxjs/toolkit";
import { benchStart, benchEnd } from "util/benchmark";
import { SPLIT_LIMIT } from "data/limit";
import { AppAction } from "apptype";
import { RouteSplit } from "data/split";
import { ReduxGlobalState } from "store/store";


type Props = {
	branchIndex: number,
	splitIndex: number,
	name: string,
	expanded: boolean,
	isLast: boolean,
	isLastBranch: boolean,
	editing: boolean,
	actions: {
		setSplitExpanded: ActionCreatorWithPayload<{ branchIndex: number, splitIndex: number, expanded: boolean }>,
		setSplitName: ActionCreatorWithPayload<{ branchIndex: number, splitIndex: number, name: string }>,
		deleteSplit: ActionCreatorWithPayload<{ branchIndex: number, splitIndex: number }>,
		breakBranchAt: ActionCreatorWithPayload<{ branchIndex: number, splitIndex: number }>,
		createSplit: ActionCreatorWithPayload<{ branchIndex: number, splitIndex: number, templateSplit?: RouteSplit }>,
		swapSplits: ActionCreatorWithPayload<{ branchIndex: number, i: number, j: number }>,
		moveFirstSplitToPreviousBranch: ActionCreatorWithPayload<{ branchIndex: number }>,
		moveLastSplitToNextBranch: ActionCreatorWithPayload<{ branchIndex: number }>,
		setInfo: ActionCreatorWithPayload<{ info: string }>,
		setSplitClipboard: ActionCreatorWithPayload<{ split: RouteSplit }>,
	},
	appActions: AppAction,
	copiedSplit?: RouteSplit,
	splitToCopy: RouteSplit,
}

export const Split: React.FunctionComponent<Props> = ({
	branchIndex, splitIndex, name, expanded, isLast, isLastBranch, editing, actions, appActions, copiedSplit, splitToCopy
}) => {
	const isFirstBranch = branchIndex === 0;
	const isFirst = splitIndex === 0;
	const displayName = name || "[Unnamed Split]";
	const expandButtonCell =
		<td className="icon-button-width">
			<ExpandButton expanded={expanded} setExpanded={(expanded: boolean) => {
				actions.setSplitExpanded({ branchIndex, splitIndex, expanded });
			}} />
		</td>;
	const handleCreateSplit = (templateSplit?: RouteSplit) => {
		if (length >= SPLIT_LIMIT) {
			const message = `You have reached the maximum number of splits per branch (${SPLIT_LIMIT})`;
			appActions.showAlert(message, undefined);
			actions.setInfo({ info: message });
		} else {
			const startTime = benchStart();
			actions.createSplit({
				branchIndex: branchIndex,
				splitIndex: splitIndex + 1,
				templateSplit: templateSplit,
			});
			actions.setInfo({ info: `Split created. (${benchEnd(startTime)} ms)` });
		}
	};
	let splitNode;
	if (editing) {
		splitNode =
			<tr>
				<td className="icon-button-width">
					<button className="icon-button" title="Break branch" onClick={() => {
						const startTime = benchStart();
						actions.breakBranchAt({ branchIndex, splitIndex });
						actions.setInfo({ info: `Branch broken. (${benchEnd(startTime)} ms)` });
					}}>{"/"}</button>
				</td>
				{expandButtonCell}
				<td colSpan={3}>
					<input
						className="full-width"
						placeholder="Split Name"
						type="text"
						value={name}
						onChange={(e) => {
							actions.setSplitName({ branchIndex, splitIndex, name: e.target.value });
						}} />
				</td>

				<td className="icon-button-width">
					{!(isFirst && isFirstBranch) &&
						<button className="icon-button" disabled={isFirst && isFirstBranch} title="Move up" onClick={() => {
							const startTime = benchStart();
							if (isFirst) {
								actions.moveFirstSplitToPreviousBranch({ branchIndex });
								actions.setInfo({ info: `Split moved into previous branch. (${benchEnd(startTime)} ms)` });
							} else {
								actions.swapSplits({ branchIndex, i: splitIndex, j: splitIndex - 1 });
								actions.setInfo({ info: `Split moved. (${benchEnd(startTime)} ms)` });
							}
						}} >&uarr;</button>
					}

				</td>
				<td className="icon-button-width">
					{!(isLast && isLastBranch) &&
						<button className="icon-button" title="Move down" disabled={isLast && isLastBranch} onClick={() => {
							const startTime = benchStart();
							if (isLast) {
								actions.moveLastSplitToNextBranch({ branchIndex });
								actions.setInfo({ info: `Split moved into next branch. (${benchEnd(startTime)} ms)` });
							} else {
								actions.swapSplits({ branchIndex, i: splitIndex, j: splitIndex + 1 });
								actions.setInfo({ info: `Split moved. (${benchEnd(startTime)} ms)` });
							}
						}} >&darr;</button>
					}

				</td>
				<td className="icon-button-width">
					<button className="icon-button" title="Copy" onClick={() => {
						const startTime = benchStart();
						actions.setSplitClipboard({ split: splitToCopy });
						actions.setInfo({ info: `Split copied. (${benchEnd(startTime)} ms)` });
					}} >c</button>
				</td>
				<td className="icon-button-width">
					{copiedSplit !== undefined &&
						<button className="icon-button" title="Paste Split Below" disabled={copiedSplit === undefined} onClick={() => {
							handleCreateSplit(copiedSplit);
						}} >p</button>
					}

				</td>
				<td className="icon-button-width">
					<button className="icon-button" title="Delete" onClick={() => {
						appActions.showAlert(
							`Delete split "${name}"? All actions inside this split will also be deleted. This is NOT reversible!`,
							[{
								name: "Cancel"
							}, {
								name: "Delete",
								execute: () => {
									const startTime = benchStart();
									actions.deleteSplit({ branchIndex, splitIndex });
									actions.setInfo({ info: `Split deleted. (${benchEnd(startTime)} ms)` });
								}
							}]
						);
					}}>X</button>
				</td>
				<td className="icon-button-width">
					<button className="icon-button" title="New Split Below" onClick={() => {
						handleCreateSplit(undefined);
					}}>*</button>
				</td>
			</tr>;
	} else {
		splitNode =
			<tr>
				<td className="icon-button-width" />
				{expandButtonCell}
				<td colSpan={9}>
					<u className="split-link" onClick={() => {
						//actions.openSplit(branchIndex, index);
					}}>{displayName}</u>
				</td>
			</tr>;
	}
	if (!expanded)
		return splitNode;
	return <>{splitNode}<ActionSummary branchIndex={branchIndex} splitIndex={splitIndex} /></>;
};
// key="split_action_list" 

type ExternalProps = {
	branchIndex: number,
	splitIndex: number,
}
const mapStateToProps = (state: ReduxGlobalState, ownProps: ExternalProps) => ({
	name: getSplitName(state, ownProps.branchIndex, ownProps.splitIndex),
	expanded: isSplitExpanded(state, ownProps.branchIndex, ownProps.splitIndex),
	isLast: getSplitCount(state, ownProps.branchIndex) === ownProps.splitIndex + 1,
	isLastBranch: getBranchCount(state) === ownProps.branchIndex + 1,
	editing: isEditingNav(state),
	copiedSplit: getSplitClipboard(state),
	splitToCopy: getSplit(state, ownProps.branchIndex, ownProps.splitIndex),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
	actions: bindActionCreators({
		setSplitExpanded,
		setSplitName,
		breakBranchAt,
		setInfo,
		deleteSplit,
		createSplit,
		setSplitClipboard,
		swapSplits,
		moveFirstSplitToPreviousBranch,
		moveLastSplitToNextBranch,
	}, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Split);