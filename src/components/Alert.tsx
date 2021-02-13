import Box from "components/Box";

import { calc } from "util/layout";
import {
	getAlertActions,
	getAlertText
} from "store/application/selectors";
import {
	hideAlert
} from "store/application/actions";
import { Dispatch, bindActionCreators, ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import { connect } from "react-redux";
import { ReduxGlobalState } from "store/store";
import { ReactNode } from "react";

type Props = {
	show: boolean,
	text: string | undefined
	alertActions: {
		name: string,
		execute: () => void
	}[],
	actions: {
		hideAlert: ActionCreatorWithoutPayload
	}
}

export const Alert: React.FunctionComponent<Props> = ({ show, text, alertActions, actions }: Props) => {
	//console.log(component);
	if (!show) {
		return null;
	}


	const width = "50%";
	const height = "12rem";
	return (
		<div>
			<div
				style={{
					backgroundColor: "rgba(0,0,0,0.6)",
					position: "absolute",
					top: 0,
					left: 0,
					width: "100vw",
					height: "100vh"
				}}
			/>
			<Box layout={{
				x: calc(calc("100vw", "-", width), "/", "2"),
				y: calc(calc("100vh", "-", height), "/", "2"),
				w: width,
				h: height,
			}}>
				<div style={{ backgroundColor: "white", height: "100%", boxSizing: "border-box", padding: "1rem" }}>
					{text}
					<div style={{
						position: "absolute",
						bottom: "1rem",
						right: "1rem"
					}}
					>
						{alertActions.map((alertAction, i) => <button
							key={i}
							className="margin-small"
							onClick={() => {
								alertAction.execute();
								actions.hideAlert();
							}}>
							{alertAction.name}
						</button>)}
					</div>
				</div>
			</Box>
		</div>
	);
};

const mapStateToProps = (state: ReduxGlobalState) => ({
	text: getAlertText(state),
	alertActions: getAlertActions(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
	actions: bindActionCreators({
		hideAlert,
	}, dispatch),
	dispatch
});

const mergeProps = (stateProps: {
	text: string | undefined,
	alertActions: Record<string, ActionCreatorWithoutPayload | undefined>,
}, dispatchProps: {
	dispatch: Dispatch,
	actions: {
		hideAlert: ActionCreatorWithoutPayload
	}
}) => ({
	show: stateProps.text !== undefined,
	text: stateProps.text,
	alertActions: (() => {
		const alertActionCreators = stateProps.alertActions;
		const array = [];
		for (const actionName in alertActionCreators) {
			array.push({
				name: actionName,
				execute: () => {
					const actionCreator = alertActionCreators[actionName];
					if (actionCreator !== undefined) {
						dispatchProps.dispatch(actionCreator());
					}
				},
			});
		}
		return array;
	})(),
	actions: dispatchProps.actions,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Alert);