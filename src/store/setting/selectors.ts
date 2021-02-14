import { ReduxGlobalState } from "store/store";
import { SettingState } from "./type";

export function getSettingState(state: ReduxGlobalState): SettingState {
	return state.settingState;
}

export function isAutoSaveEnabled(state: ReduxGlobalState): boolean {
	return getSettingState(state).autoSave;
}

export function isObjectMapLinkEnabled(state: ReduxGlobalState): boolean {
	return getSettingState(state).linkObjectMap;
}
