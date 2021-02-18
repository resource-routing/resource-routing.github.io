
import Box from "components/Box";
import ActionList from "components/action/ActionList";
import {
	getActiveSplitName,
} from "store/routing/selectors";
import { connect, ConnectedProps } from "react-redux";
import { AppAction } from "App";
import { ReduxGlobalState } from "store/store";
import { bindActionCreators, Dispatch } from "@reduxjs/toolkit";
import {
	getActionsHeaderBounds,
	getActionsMainBounds,
	isEditingActions
} from "store/application/selectors";
import {
	setEditingActions
} from "store/application/actions";

type ExternalProps = {
	appActions: AppAction
}
const mapStateToProps = (state: ReduxGlobalState) => {
	return {
		actionMainBounds: getActionsMainBounds(state),
		actionHeaderBounds: getActionsHeaderBounds(state),
		splitName: getActiveSplitName(state),
		editing: isEditingActions(state),
	};
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
	actions: bindActionCreators({
		setEditingActions,
	}, dispatch)
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & ExternalProps

export const Actions: React.FunctionComponent<Props> = ({
	actionMainBounds, actionHeaderBounds, editing, splitName, appActions, actions
}: Props) => {

	const buttonSection = splitName !== undefined &&
		<span>
			<button className="space-left-small" onClick={() => {
				actions.setEditingActions({ editing: !editing });
			}}>
				{editing ? "Finish" : "Edit"}
			</button>
			<button className="space-left-small" disabled>Previous Split</button>
			<button className="space-left-small" disabled>Next Split</button>
		</span>;

	return (
		<div >
			<Box layout={actionMainBounds} borderClass="overflow-auto">
				<div>
					<ActionList appActions={appActions} />
				</div>
			</Box>
			<Box layout={actionHeaderBounds} >
				<div>
					<strong> Split Detail {splitName && " - " + splitName}</strong>
					{buttonSection}
					<hr />
				</div>
			</Box>
		</div>
	);
};

export default connector(Actions);