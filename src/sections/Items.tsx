import ItemList from "components/item/ItemList";
import Box from "components/Box";
import { bindActionCreators, Dispatch } from "@reduxjs/toolkit";
import { AppAction } from "App";
import { ReduxGlobalState } from "store/store";
import {
	getResourceCalcError,
	getResourceCalcProgress,
	getResourcesHeaderBounds,
	getResourcesMainBounds,
	isResourcesSectionCollapsed,
	isEditingItems,
	isOnlyShowingChangedResources,

} from "store/application/selectors";
import { setItemFilter } from "store/setting/actions";
import { getItemFilter } from "store/setting/selectors";
import {
	setEditingItems,
	setShowOnlyChangedResources,
	setResourcesCollapsed,
} from "store/application/actions";
import { connect, ConnectedProps } from "react-redux";
import {
	getTotalActionCount,
	getActiveActionName,
} from "store/routing/selectors";
import React from "react";
import ExpandButton from "components/ExpandButton";

type ExternalProps = {
	appActions: AppAction,
}

const mapStateToProps = (state: ReduxGlobalState) => ({
	itemMainBounds: getResourcesMainBounds(state),
	itemHeaderBounds: getResourcesHeaderBounds(state),
	activeActionName: getActiveActionName(state),
	resourcesCollapsed: isResourcesSectionCollapsed(state),
	editing: isEditingItems(state),
	progress: getResourceCalcProgress(state),
	total: getTotalActionCount(state),
	error: getResourceCalcError(state),
	filterString: getItemFilter(state),
	onlyShowChanging: isOnlyShowingChangedResources(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
	actions: bindActionCreators({
		setEditingItems,
		setItemFilter,
		setShowOnlyChangedResources,
		setResourcesCollapsed,
	}, dispatch)
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & ExternalProps;

const Items: React.FunctionComponent<Props> = ({
	itemMainBounds, itemHeaderBounds, resourcesCollapsed, editing, actions, appActions, filterString, progress, total, error, onlyShowChanging, activeActionName
}: Props) => {
	const collapsed = resourcesCollapsed;
	const expandButton = <ExpandButton
		expanded={!collapsed} setExpanded={(expanded) => actions.setResourcesCollapsed({ collapsed: !expanded })}
	/>;
	const buttonSection =
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
			{activeActionName && <>
				<input
					id="show_only_changed_checkbox"
					className="space-left-small"
					type="checkbox"
					checked={onlyShowChanging}
					onChange={(e) => {
						actions.setShowOnlyChangedResources({ showOnlyChangedResources: e.target.checked });
					}} />
				<label htmlFor="show_only_changed_checkbox">Show Only Changed</label></>
			}
		</>;

	let resourceInfo;
	if (error === null) {
		if (progress === total || total === 0) {
			resourceInfo = <span>Resource up to date</span>;
		} else {
			resourceInfo = <span>Updating Resources... ({progress}/{total})</span>;
		}
	} else {
		resourceInfo = <span className="deltastr-error" title={error.message}>{error.message}</span>;
	}
	return (
		<div >
			<Box layout={itemMainBounds} borderClass="overflow-auto">

				<div>
					{!collapsed && <ItemList appActions={appActions} />}
				</div>

			</Box>
			<Box layout={itemHeaderBounds} borderClass="overflow-hidden">
				<div>
					{expandButton}
					<strong>Resources {activeActionName && ` - ${activeActionName}`}</strong>
					{!collapsed && buttonSection}

				</div>
				{!collapsed &&
					<div>
						{resourceInfo}
					</div>}
				{!resourcesCollapsed && <hr />}
			</Box>
		</div>
	);
};

export default connector(Items);