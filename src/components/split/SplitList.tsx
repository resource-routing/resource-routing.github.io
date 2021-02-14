import { connect } from "react-redux";
import Split from "./Split";
// import { createSplitAt, mergeNextBranchWithCurrentBranch } from "../../data";
import {
	getBranchCount,
	getBranchName,
	getSplitCount
} from "store/routing/selectors";
import { getSplitClipboard, isEditingNav } from "store/application/selectors";
import {
	createSplit,
	mergeNextIntoBranch,
} from "store/routing/actions";
import {
	setInfo
} from "store/application/actions";
import { ActionCreatorWithPayload, bindActionCreators, Dispatch } from "@reduxjs/toolkit";
import { benchEnd, benchStart } from "util/benchmark";
import { SPLIT_LIMIT } from "data/limit";
import { RouteSplit } from "data/split";
import { AppAction } from "apptype";
import { ReduxGlobalState } from "store/store";

type Props = {
	branchIndex: number,
	isLastBranch: boolean,
	length: number,
	editing: boolean,
	copiedSplit?: RouteSplit,
	currentBranchName: string,
	nextBranchName?: string,
	actions: {
		createSplit: ActionCreatorWithPayload<{ branchIndex: number, splitIndex: number, templateSplit?: RouteSplit }>,
		setInfo: ActionCreatorWithPayload<{ info: string }>,
		mergeNextIntoBranch: ActionCreatorWithPayload<{ branchIndex: number }>,
	},
	appActions: AppAction,
}

export const SplitList: React.FunctionComponent<Props> = ({
	branchIndex, isLastBranch, length, editing, copiedSplit, currentBranchName, nextBranchName, actions, appActions
}: Props) => {
	const splitNodes = [];
	for (let i = 0; i < length; i++) {
		splitNodes.push(<Split
			key={`split_${i}_`}
			branchIndex={branchIndex}
			splitIndex={i}
			appActions={appActions}
		/>);
	}
	const handleCreateSplit = (templateSplit?: RouteSplit) => {
		if (length >= SPLIT_LIMIT) {
			const message = `You have reached the maximum number of splits per branch (${SPLIT_LIMIT})`;
			appActions.showAlert(message);
			actions.setInfo({ info: message });
		} else {
			const startTime = benchStart();
			actions.createSplit({
				branchIndex: branchIndex,
				splitIndex: length,
				templateSplit: templateSplit,
			});
			actions.setInfo({ info: `Split created. (${benchEnd(startTime)} ms)` });
		}
	};
	return <>
		{splitNodes}
		<tr>
			<td className="icon-button-width">
				{editing && !isLastBranch &&
					<button className="icon-button" title="Merge branch" disabled={isLastBranch} onClick={() => {
						appActions.showAlert(
							`Merge branch "${nextBranchName}" into "${currentBranchName}"?`,
							[{
								name: "Cancel"
							}, {
								name: "Merge",
								execute: () => {
									const startTime = benchStart();
									actions.mergeNextIntoBranch({ branchIndex });
									actions.setInfo({ info: `Branch merged. (${benchEnd(startTime)} ms)` });
								}
							}]
						);
					}}>^</button>
				}
			</td>
			<td colSpan={10}>
				<button onClick={() => {
					handleCreateSplit(undefined);
				}}>New Split</button>
				<button className="space-left-small" disabled={copiedSplit === undefined} onClick={() => {
					handleCreateSplit(copiedSplit);
				}}>Paste Split</button>
			</td>
		</tr>
	</>;
};

type ExternalProps = {
	branchIndex: number,
	appActions: AppAction,
}

const mapStateToProps = (state: ReduxGlobalState, ownProps: ExternalProps) => ({
	length: getSplitCount(state, ownProps.branchIndex),
	editing: isEditingNav(state),
	isLastBranch: getBranchCount(state) === ownProps.branchIndex + 1,
	currentBranchName: getBranchName(state, ownProps.branchIndex),
	nextBranchName: ownProps.branchIndex === getBranchCount(state) - 1 ? undefined : getBranchName(state, ownProps.branchIndex + 1),
	copiedSplit: getSplitClipboard(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
	actions: bindActionCreators({
		createSplit,
		setInfo,
		mergeNextIntoBranch,
	}, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SplitList);