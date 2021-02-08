import ActionItem from "./ActionItem";

import { createActionAt } from './util/data';

export default function ActionList({ actionList, editing, actions, branchIndex, splitIndex, resourceError }) {
	return (
		<table>
			<tbody>
				{actionList.map((action, i) => {
					let deltaError = undefined;
					if (actions.deltaError) {
						deltaError = actions.deltaError;
					} else if (resourceError && resourceError.branch === branchIndex && resourceError.split === splitIndex && resourceError.action === i) {
						deltaError = resourceError.message;
					}
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
				})}
				<tr key="new_action_button">
					<td colSpan="3">
						<button onClick={() => {
							actions.doToBranches(createActionAt(branchIndex, splitIndex, actionList.length), "Action created.", branchIndex, splitIndex);
						}}>Add Action/Notes</button>
					</td>
				</tr>

			</tbody>

		</table>
	)
}