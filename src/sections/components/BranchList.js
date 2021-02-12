import { connect } from "react-redux";
import Branch from "./Branch";

import { createBranchAt } from './util/data';
import { getBranchCount } from "./util/select";

export function BranchList({ length, editing, actions }) {
	if (length === 0) return null;
	const branchNodes = [];
	for (let i = 0; i < length; i++) {
		branchNodes.push(<Branch
			index={i}
			key={i}
			editing={editing}
			actions={actions}
		/>);
	};
	return (
		<table>
			<tbody>
				{branchNodes}
				<tr key="new_branch_button">
					<td colSpan="5">
						<button onClick={() => {
							//const len = branches.length;
							//actions.doToBranches(createBranchAt(len), "Branch created.", len);
							//setEditing(true);
						}} disabled>New Branch</button>
					</td>
				</tr>

			</tbody>

		</table>
	)
};

const mapStateToProps = (state, ownProps) => ({
	length: getBranchCount(state)
});

const mapDispatchToProps = (dispatch, ownProps) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(BranchList);