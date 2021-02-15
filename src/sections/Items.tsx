import ItemList from "components/item/ItemList";
import Box from "components/Box";
import { Bounds } from "util/layout";
import { ActionCreatorWithPayload, bindActionCreators, Dispatch } from "@reduxjs/toolkit";
import { AppAction } from "apptype";
import { ReduxGlobalState } from "store/store";
import { getItemsInfo, getResourcesHeaderBounds, getResourcesMainBounds, isActionSectionCollapsed, isEditingItems } from "store/application/selectors";
import { setItemFilter } from "store/setting/actions";
import { getItemFilter } from "store/setting/selectors";
import { setEditingItems } from "store/application/actions";
import { connect, ConnectedProps } from "react-redux";

type ExternalProps = {
	appActions: AppAction,
}

const mapStateToProps = (state: ReduxGlobalState) => ({
	itemMainBounds: getResourcesMainBounds(state),
	itemHeaderBounds: getResourcesHeaderBounds(state),
	resourcesCollapsed: isActionSectionCollapsed(state),
	itemsInfo: getItemsInfo(state),
	editing: isEditingItems(state),
	filterString: getItemFilter(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
	actions: bindActionCreators({
		setEditingItems,
		setItemFilter,
	}, dispatch)
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & ExternalProps;

const Items: React.FunctionComponent<Props> = ({
	itemMainBounds, itemHeaderBounds, resourcesCollapsed, itemsInfo, editing, actions, appActions, filterString
}: Props) => {
	const collapsed = resourcesCollapsed;
	const buttonSection = (
		<>
			<button className="space-left-small" onClick={() => actions.setEditingItems({ editing: !editing })}>{editing ? "Finish" : "Edit"}</button>
			<input
				className="space-left-small"
				type="text"
				value={filterString}
				placeholder="Filter (use , to separate)"
				onChange={(e) => actions.setItemFilter({ filter: e.target.value })}
			/>
			<button className="space-left-small icon-button" title="Clear" onClick={() => actions.setItemFilter({ filter: "" })}>X</button>
		</>
	);
	return (
		<div >
			<Box layout={itemMainBounds} borderClass="overflow-auto">

				<div>
					{!collapsed && <ItemList appActions={appActions} />}
				</div>

			</Box>
			<Box layout={itemHeaderBounds} >
				<div>

					<strong>Resources</strong>
					{!collapsed && buttonSection}

				</div>
				{!collapsed &&
					<div>
						{itemsInfo}
					</div>}
				{!resourcesCollapsed && <hr />}
			</Box>
		</div>
	);
};



export default connector(Items);


