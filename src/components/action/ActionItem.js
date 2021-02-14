import ExpandButton from "./ExpandButton";
import { setActionPropertyAt } from "../../data";
import { connect } from "react-redux";
import DeltaList from "./DeltaList";
import { getActiveAction, getActiveSplitActionCount, getActiveSplitActionDeltaError, getActiveSplitActionDeltas, getActiveSplitActionDeltaString, getActiveSplitActionName, isActiveSplitActionExpanded } from "./util/select";

export function ActionItem({ actionIndex, name, expanded, editing, actions, isLast, deltaString, deltaError, deltas }) {
	const displayName = name || "[Unnamed Action]";
	const actionNode = (
		<tr key={"action_" + actionIndex}>
			<td className="icon-button-width">
				{deltaString && <ExpandButton expanded={expanded} setExpanded={(expanded) => {
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

				<td colSpan="6"><span>{deltaString ? <strong>{displayName}</strong> : <em>{displayName}</em>}</span></td>}


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
				<button className="icon-button" disabled={actionIndex === 0} title="Move up" onClick={() => {
					//actions.doToBranches(swapBranches(index, index - 1), "Branch moved.", index - 1);
				}} disabled>&uarr;</button>
			</td>}
			{editing &&
				<td className="icon-button-width">
					<button className="icon-button" title="Move down" disabled={isLast} onClick={() => {
						//actions.doToBranches(swapBranches(index, index + 1), "Branch moved.", index);
					}} disabled>&darr;</button>
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

	const deltaNode = <DeltaList key={"action_" + actionIndex + "_delta"} actionIndex={actionIndex} />;

	if (!expanded || !deltaString) return actionNode;
	return [actionNode, deltaNode];
}


const mapStateToProps = (state, ownProps) => ({
	name: getActiveSplitActionName(state, ownProps.actionIndex),
	expanded: isActiveSplitActionExpanded(state, ownProps.actionIndex),
	isLast: getActiveSplitActionCount(state) === ownProps.actionIndex - 1,
	deltaString: getActiveSplitActionDeltaString(state, ownProps.actionIndex),
	deltaError: getActiveSplitActionDeltaError(state, ownProps.actionIndex),
	deltas: getActiveSplitActionDeltas(state, ownProps.actionIndex),
});

const mapDispatchToProps = (dispatch, ownProps) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(ActionItem);