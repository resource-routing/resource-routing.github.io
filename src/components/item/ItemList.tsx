import ItemEdit from "./ItemEdit";
import ItemDisplay from "./ItemDisplay";
import { AppAction } from "apptype";
import {
	getFilteredItemIndices,
	getItemCount
} from "store/routing/selectors";
import { ReduxGlobalState } from "store/store";
import { getItemFilter } from "store/setting/selectors";
import { isEditingItems } from "store/application/selectors";
import { ActionCreatorWithPayload, bindActionCreators, Dispatch } from "@reduxjs/toolkit";
import { connect, ConnectedProps } from "react-redux";
import { ITEM_LIMIT } from "data/limit";
import {
	setInfo,
} from "store/application/actions";
import { createItem } from "store/routing/actions";
import { benchStart, benchEnd } from "util/benchmark";

type ExternalProps = {
	appActions: AppAction,
}

const mapStateToProps = (state: ReduxGlobalState, ownProps: ExternalProps) => {
	const filterString = getItemFilter(state);
	const filter = (!filterString) ? [] : filterString.split(",").map(s => s.trim());
	return {
		itemIndices: getFilteredItemIndices(state, filter),
		editing: isEditingItems(state),
		itemCount: getItemCount(state),
	};
};

const mapDispatchToProps = (dispatch: Dispatch, ownProps: ExternalProps) => ({
	actions: bindActionCreators({
		setInfo,
		createItem,
	}, dispatch)
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & ExternalProps;

const ItemList: React.FunctionComponent<Props> = ({ itemIndices, editing, actions, appActions, itemCount }) => {
	let itemSection;

	if (editing) {
		itemSection = itemIndices.map(i =>
			<ItemEdit
				key={i}
				index={i}
				appActions={appActions}
			/>
		);
	} else {
		itemSection = [];
		for (let i = 0; i < itemIndices.length; i += 4) {

			itemSection.push(
				<tr key={i}>
					{<ItemDisplay
						index={itemIndices[i]}
						delta={undefined} />}
					{i + 1 < itemIndices.length &&
						<ItemDisplay
							index={itemIndices[i + 1]}
							delta={undefined} />}
					{i + 2 < itemIndices.length &&
						<ItemDisplay
							index={itemIndices[i + 2]}
							delta={undefined} />}
					{i + 3 < itemIndices.length &&
						<ItemDisplay
							index={itemIndices[i + 3]}
							delta={undefined} />}
				</tr>
			);
		}
	}
	return (
		<table>
			<tbody>
				{itemSection}
				<tr key="new_item_button">
					<td colSpan={5}>
						<button onClick={() => {
							if (itemCount >= ITEM_LIMIT) {
								const message = `You have reached the maximum number of items (${ITEM_LIMIT})`;
								appActions.showAlert(message);
								actions.setInfo({ info: message });
							} else {
								const startTime = benchStart();
								actions.createItem({
									index: itemCount
								});
								actions.setInfo({ info: `Item created. (${benchEnd(startTime)} ms)` });
							}
						}}>New Item</button>
					</td>
				</tr>
			</tbody>

		</table>
	);
};



export default connector(ItemList);