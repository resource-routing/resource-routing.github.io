import { connect } from "react-redux";
import { fileURLToPath } from "url";
import ActionItem from "./ActionItem";

import { createActionAt } from "../../data";
import { getActionCount, getActiveSplitActionCount, getActiveSplit, getActiveBranch } from "./util/select";

export function ActionList({ length, editing, actions }) {
	const actionNodes = [];
	for (let i = 0; i < length; i++) {
		actionNodes.push(<ActionItem
			key={i}
			actionIndex={i}
			editing={editing}
			actions={actions}
		/>);
	}
	return (
		<table>
			<tbody>
				{/* {actionList.map((action, i) => {
					let deltaError = undefined;
					// if (actions.deltaError) {
					// 	deltaError = actions.deltaError;
					// } else if (resourceError && resourceError.branch === branchIndex && resourceError.split === splitIndex && resourceError.action === i) {
					// 	deltaError = resourceError.message;
					// }
					return <ActionItem
						name={action.name}
						key={i}
						index={i}
						branchIndex={branchIndex}
						splitIndex={splitIndex}
						expanded={action.expanded}
						editing={editing}
						actions={actions}
						isLast={i === actionList.length - 1}
						deltaString={action.deltaString}
						deltaError={deltaError}
						deltas={action.deltas}
					/>
				})} */}
				{actionNodes}
				<tr key="new_action_button">
					<td colSpan="3">
						<button onClick={() => {
							//actions.doToBranches(createActionAt(branchIndex, splitIndex, actionList.length), "Action created.", branchIndex, splitIndex);
						}} disabled>Add Action/Notes</button>
					</td>
				</tr>

			</tbody>

		</table>
	);
}

const mapStateToProps = (state, ownProps) => ({
	length: getActiveSplitActionCount(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(ActionList);