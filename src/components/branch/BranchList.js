import { connect } from "react-redux";
import Branch from "./Branch";

import {
	getBranchCount
} from "store/routing/selectors";
import {
	createBranch
} from "store/routing/actions";
import {
	setEditingNav
} from "store/application/actions";
import { bindActionCreators } from "@reduxjs/toolkit";

export function BranchList({ length, actions }) {
	if (length === 0) return null;
	const branchNodes = [];
	for (let i = 0; i < length; i++) {
		branchNodes.push(<Branch
			index={i}
			key={i}
		/>);
	}
	return (
		<table>
			<tbody>
				{branchNodes}
				<tr key="new_branch_button">
					<td colSpan="5">
						<button onClick={() => {
							actions.createBranch({ branchIndex: length });
							actions.setEditingNav({ editing: true });
						}}>New Branch</button>
					</td>
				</tr>

			</tbody>

		</table>
	);
}

const mapStateToProps = (state, ownProps) => ({
	length: getBranchCount(state)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	actions: bindActionCreators({
		createBranch,
		setEditingNav,
	}, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(BranchList);