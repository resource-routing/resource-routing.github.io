import ActionItem from "./ActionItem";

import { createActionAt } from './util/data';

export default function ActionList({ actionList, editing, actions, branchIndex, splitIndex, }) {
	return (
		<table>
			<tbody>
				{actionList.map((action, i) => (
					<ActionItem
						name={action.name}
						key={i}
						index={i}
						expanded={action.expanded}
						editing={editing}
						actions={actions}
						isLast={i === actionList.length - 1}
						deltaString={action.deltaString}
						deltaError={action.deltaError}
						deltas={action.deltas}
					/>
				))}
				<tr key="new_action_button">
					<td colSpan="2">
						<button onClick={() => {
							actions.doToBranches(createActionAt(branchIndex, splitIndex, actionList.length), "Action created.", branchIndex, splitIndex);
						}}>Add Action/Notes</button>
					</td>
				</tr>

			</tbody>

		</table>
	)
}