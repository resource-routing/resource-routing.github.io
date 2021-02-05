import ExpandButton from "./ExpandButton";

export default function ActionItem({ name, index, expanded, editing, actions, isLast, deltaString, deltaError, deltas }) {

	return (
		<tr key={"action_" + index}>
			<td className="icon-button-width">
				{deltaString && <ExpandButton expanded={expanded} setExpanded={(expanded) => {
					//actions.doToBranches(setBranchPropertyAt(index, "expanded", expanded), `Branch ${expanded ? "expanded" : "collapsed"}.`)
				}} />

				}

			</td>
			<td >
				{editing ?
					<input
						className="full-width"
						placeholder="Action Title/Notes"
						type="text"
						value={name}
						onChange={(e) => {
							//actions.doToBranches(setBranchPropertyAt(index, "name", e.target.value))
						}} />
					: <span>{deltaString ? name : <em>*{name}</em>}</span>}

			</td>
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
}