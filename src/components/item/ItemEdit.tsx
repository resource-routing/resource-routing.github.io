import { ActionCreatorWithPayload, bindActionCreators, Dispatch } from "@reduxjs/toolkit";
import { isValidNonWhiteColor, shouldMakeTextWhiteForBackground } from "util/color";

import {
	getItemColorByIndex,
	getItemCount,
	getItemNameByIndex
} from "store/routing/selectors";
import {
	createItem,
	setItemName,
	setItemColor,
	deleteItem,
	swapItems,
} from "store/routing/actions";
import {
	setInfo,
} from "store/application/actions";
import { ReduxGlobalState } from "store/store";
import { connect, ConnectedProps } from "react-redux";
import { AppAction } from "apptype";
import { benchEnd, benchStart } from "util/benchmark";
import { ITEM_LIMIT } from "data/limit";

type ExternalProps = {
	index: number,
	appActions: AppAction,
}

const mapStateToProps = (state: ReduxGlobalState, ownProps: ExternalProps) => {
	const color = getItemColorByIndex(state, ownProps.index);
	return {
		name: getItemNameByIndex(state, ownProps.index),
		color,
		background: isValidNonWhiteColor(color) ? color : "white",
		foreground: shouldMakeTextWhiteForBackground(color) ? "white" : "black",
		itemCount: getItemCount(state),
	}
};

const mapDispatchToProps = (dispatch: Dispatch, ownProps: ExternalProps) => ({
	actions: bindActionCreators({
		createItem,
		setItemName,
		setItemColor,
		setInfo,
		deleteItem,
		swapItems,
	}, dispatch)
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & ExternalProps;

const ItemEdit: React.FunctionComponent<Props> = ({ name, color, foreground, background, index, itemCount, actions, appActions }) => {
	const isLast = index === itemCount - 1;
	const isFirst = index === 0;
	return (
		<tr>
			<td className="icon-button-width"
				style={{
					backgroundColor: background,
					color: foreground
				}}>
				{index + 1}.
			</td>
			<td>
				<input
					className="full-width"
					placeholder="Item Name"
					type="text"
					value={name}
					onChange={(e) => {
						actions.setItemName({ index, name: e.target.value });//todo: rename in deltas
					}} />

			</td>
			<td>
				<input

					className="full-width"
					placeholder="Color (e.g, red, #FF0000, rgb(255, 0, 0)"
					type="text"
					value={color}
					onChange={(e) => {
						actions.setItemColor({ index, color: e.target.value });
					}} />
			</td>
			<td className="icon-button-width">
				{!isFirst &&
					<button className="icon-button" disabled={isFirst} title="Move up" onClick={() => {
						const startTime = benchStart();
						actions.swapItems({ i: index, j: index - 1 });
						actions.setInfo({ info: `Item moved. (${benchEnd(startTime)} ms)` });
					}}>&uarr;</button>
				}

			</td>

			<td className="icon-button-width">
				{!isLast &&
					<button className="icon-button" title="Move down" disabled={isLast} onClick={() => {
						const startTime = benchStart();
						actions.swapItems({ i: index, j: index + 1 });
						actions.setInfo({ info: `Item moved. (${benchEnd(startTime)} ms)` });
					}}>&darr;</button>
				}

			</td>

			<td className="icon-button-width">
				<button className="icon-button" title="Delete" onClick={() => {
					appActions.showAlert(
						`Delete item "${name}"? Any split that uses the item will have errors. This is NOT reversible!`,
						[{
							name: "Cancel"
						}, {
							name: "Delete",
							execute: () => {
								const startTime = benchStart();
								actions.deleteItem({ index });//TODO delete in deltas
								actions.setInfo({ info: `Item deleted. (${benchEnd(startTime)} ms)` });
							}
						}]
					);
				}} disabled>X</button>
			</td>


			<td className="icon-button-width">
				<button className="icon-button" title="New Item Below" onClick={() => {
					if (itemCount >= ITEM_LIMIT) {
						const message = `You have reached the maximum number of items (${ITEM_LIMIT})`;
						appActions.showAlert(message);
						actions.setInfo({ info: message });
					} else {
						const startTime = benchStart();
						actions.createItem({
							index: index + 1
						});
						actions.setInfo({ info: `Item created. (${benchEnd(startTime)} ms)` });
					}
				}}>*</button>
			</td>

		</tr>
	);
};



export default connector(ItemEdit);