import { DeltaString, DeltaError, ActionDelta } from "./delta";
import { RouteBranch, RouteState, RouteSplit, RouteAction, RouteItem } from "./object";
import { ReduxGlobalState, SettingState } from "./redux";

export function getRouteState(state: ReduxGlobalState): RouteState {
	return state.routeState;
}

export function getInfo(state: ReduxGlobalState): string {
	return getRouteState(state).info;
}

export function getProjectName(state: ReduxGlobalState): string {
	return getRouteState(state).projectName;
}

export function getActiveBranch(state: ReduxGlobalState): number {
	return getRouteState(state).activeBranch;
}

export function getActiveSplit(state: ReduxGlobalState): number {
	return getRouteState(state).activeSplit;
}

function getActiveRouteSplit(state: ReduxGlobalState): RouteSplit | undefined {
	const b = getActiveBranch(state);
	const s = getActiveSplit(state);
	if (b >= 0 && s >= 0) {
		return getSplit(state, b, s);
	}
	return undefined;
}

export function getActiveSplitName(state: ReduxGlobalState): string | undefined {
	return getActiveRouteSplit(state)?.name;
}

function getActiveSplitActions(state: ReduxGlobalState): RouteAction[] | undefined {
	return getActiveRouteSplit(state)?.actions;
}

export function getActiveSplitActionCount(state: ReduxGlobalState): number | undefined {
	return getActiveSplitActions(state)?.length;
}

function getActiveSplitAction(state: ReduxGlobalState, actionIndex: number): RouteAction | undefined {
	const actions = getActiveSplitActions(state);
	return actions === undefined ? undefined : actions[actionIndex];
}

export function getActiveSplitActionName(state: ReduxGlobalState, actionIndex: number): string | undefined {
	return getActiveSplitAction(state, actionIndex)?.name;
}

export function isActiveSplitActionExpanded(state: ReduxGlobalState, actionIndex: number): boolean | undefined {
	return getActiveSplitAction(state, actionIndex)?.expanded;
}

export function getActiveSplitActionDeltaString(state: ReduxGlobalState, actionIndex: number): DeltaString | undefined {
	return getActiveSplitAction(state, actionIndex)?.deltaString;
}

export function getActiveSplitActionDeltaError(state: ReduxGlobalState, actionIndex: number): DeltaError | undefined {
	const error = getActiveSplitAction(state, actionIndex)?.deltaError;
	return error ? error : undefined;
}

export function getActiveSplitActionDeltas(state: ReduxGlobalState, actionIndex: number): ActionDelta | undefined {
	const deltas = getActiveSplitAction(state, actionIndex)?.deltas;
	return deltas ? deltas : undefined;
}

export function getActiveAction(state: ReduxGlobalState): number {
	return getRouteState(state).activeAction;
}

function getBranches(state: ReduxGlobalState): RouteBranch[] {
	return getRouteState(state).branches;
}

function getBranch(state: ReduxGlobalState, branchIndex: number): RouteBranch {
	return getBranches(state)[branchIndex];
}

export function getBranchCount(state: ReduxGlobalState): number {
	return getBranches(state).length;
}

export function getBranchName(state: ReduxGlobalState, branchIndex: number): string {
	return getBranch(state, branchIndex).name;
}

export function isBranchExpanded(state: ReduxGlobalState, branchIndex: number): boolean {
	return getBranch(state, branchIndex).expanded;
}

function getSplits(state: ReduxGlobalState, branchIndex: number): RouteSplit[] {
	return getBranch(state, branchIndex).splits;
}

function getSplit(state: ReduxGlobalState, branchIndex: number, splitIndex: number): RouteSplit {
	return getSplits(state, branchIndex)[splitIndex];
}

export function getSplitCount(state: ReduxGlobalState, branchIndex: number): number {
	return getSplits(state, branchIndex).length;
}

export function getSplitName(state: ReduxGlobalState, branchIndex: number, splitIndex: number): string {
	return getSplit(state, branchIndex, splitIndex).name;
}

export function isSplitExpanded(state: ReduxGlobalState, branchIndex: number, splitIndex: number): boolean {
	return getSplit(state, branchIndex, splitIndex).expanded;
}

function getActions(state: ReduxGlobalState, branchIndex: number, splitIndex: number): RouteAction[] {
	return getSplit(state, branchIndex, splitIndex).actions;
}

function getAction(state: ReduxGlobalState, branchIndex: number, splitIndex: number, actionIndex: number): RouteAction {
	return getActions(state, branchIndex, splitIndex)[actionIndex];
}

export function getActionCount(state: ReduxGlobalState, branchIndex: number, splitIndex: number): number {
	return getActions(state, branchIndex, splitIndex).length;
}

export function isActionNote(state: ReduxGlobalState, branchIndex: number, splitIndex: number, actionIndex: number): boolean {
	return getAction(state, branchIndex, splitIndex, actionIndex).deltaString === "";
}

export function getActionName(state: ReduxGlobalState, branchIndex: number, splitIndex: number, actionIndex: number): string {
	return getAction(state, branchIndex, splitIndex, actionIndex).name;
}

function getItems(state: ReduxGlobalState): RouteItem[] {
	return getRouteState(state).items;
}

function getItemByName(state: ReduxGlobalState, name: string): RouteItem | undefined {
	const match = getItems(state).filter(item => item.name === name);
	if (match.length === 0) return undefined;
	return match[0];
}

export function getItemColor(state: ReduxGlobalState, name: string): string | undefined {
	return getItemByName(state, name)?.color;
}

export function getSettingState(state: ReduxGlobalState): SettingState {
	return state.settingState;
}

export function isAutoSaveEnabled(state: ReduxGlobalState): boolean {
	return getSettingState(state).autoSave;
}

export function isObjectMapLinkEnabled(state: ReduxGlobalState): boolean {
	return getSettingState(state).linkObjectMap;
}