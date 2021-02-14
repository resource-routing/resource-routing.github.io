import { connect } from "react-redux";
import Branch from "./Branch";

import {
	getBranchCount
} from "store/routing/selectors";
import {
	createBranch
} from "store/routing/actions";
import {
	setEditingNav,
	setInfo,
} from "store/application/actions";
import { ActionCreatorWithPayload, bindActionCreators, Dispatch } from "@reduxjs/toolkit";
import { BRANCH_LIMIT } from "data/limit";
import { benchStart, benchEnd } from "util/benchmark";
import { AppAction } from "apptype";
import { ReduxGlobalState } from "store/store";

type Props = {
	length: number,
	actions: {
		createBranch: ActionCreatorWithPayload<{ branchIndex: number }>,
		setEditingNav: ActionCreatorWithPayload<{ editing: boolean }>,
		setInfo: ActionCreatorWithPayload<{ info: string }>,
	},
	appActions: AppAction,
}

export const BranchList: React.FunctionComponent<Props> = ({ length, actions, appActions }: Props) => {
	if (length === 0) return null;
	const branchNodes = [];
	for (let i = 0; i < length; i++) {
		branchNodes.push(<Branch
			index={i}
			key={i}
			appActions={appActions}
		/>);
	}
	return (
		<table>
			<tbody>
				{branchNodes}
				<tr key="new_branch_button">
					<td colSpan={11}>
						<button onClick={() => {
							if (length >= BRANCH_LIMIT) {
								const message = `You have reached the maximum number of branches (${BRANCH_LIMIT})`;
								appActions.showAlert(message);
								actions.setInfo({ info: message });
							} else {
								const startTime = benchStart();
								actions.createBranch({ branchIndex: length });
								actions.setEditingNav({ editing: true });
								actions.setInfo({ info: `Branch created. (${benchEnd(startTime)} ms)` });
							}
						}}>New Branch</button>
					</td>
				</tr>

			</tbody>

		</table>
	);
};


const mapStateToProps = (state: ReduxGlobalState) => ({
	length: getBranchCount(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
	actions: bindActionCreators({
		createBranch,
		setEditingNav,
		setInfo,
	}, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(BranchList);