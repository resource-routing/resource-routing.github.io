import ExpandButton from "./ExpandButton";
import { setActionPropertyAt } from "./util/data";
import DeltaItem from "./DeltaList";

export default function ActionItem({ name, branchIndex, splitIndex, index, expanded, editing, actions, isLast, deltaString, deltaError, deltas }) {
	const displayName = name || "[Unnamed Action]";
	const actionNode = (
		<tr key={"action_" + index}>
			<td className="icon-button-width">
				{deltaString && <ExpandButton expanded={expanded} setExpanded={(expanded) => {
					actions.doToBranches(setActionPropertyAt(branchIndex, splitIndex, index, "expanded", expanded), `Action ${expanded ? "expanded" : "collapsed"}.`)
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
							actions.doToBranches(setActionPropertyAt(branchIndex, splitIndex, index, "name", e.target.value));
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
							actions.doToBranches(setActionPropertyAt(branchIndex, splitIndex, index, "deltaString", e.target.value), "Delta string changed.", branchIndex, splitIndex);
						}} />
				</td>

			}
			{editing && <td className="icon-button-width">
				<button className="icon-button" disabled={index === 0} title="Move up" onClick={() => {
					//actions.doToBranches(swapBranches(index, index - 1), "Branch moved.", index - 1);
				}} >&uarr;</button>
			</td>}
			{editing &&
				<td className="icon-button-width">
					<button className="icon-button" title="Move down" disabled={isLast} onClick={() => {
						//actions.doToBranches(swapBranches(index, index + 1), "Branch moved.", index);
					}} >&darr;</button>
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

	const deltaNode = <DeltaItem key={"action_" + index + "_delta"} deltaError={deltaError} deltas={deltas} />;

	if (!expanded || !deltaString) return actionNode;
	return [actionNode, deltaNode];
}