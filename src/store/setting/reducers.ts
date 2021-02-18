import { PayloadAction } from "@reduxjs/toolkit";
import { ReduxGlobalState } from "store/store";
import { SettingState } from "./type";

export default {
	setSettingState(state: ReduxGlobalState, action: PayloadAction<{ settingState: SettingState }>): void {
		state.settingState = action.payload.settingState;
	},
	setItemFilter(state: ReduxGlobalState, action: PayloadAction<{ filter: string }>): void {
		state.settingState.itemFilter = action.payload.filter;
	},
	setAutoSaveEnabled(state: ReduxGlobalState, action: PayloadAction<{ enabled: boolean }>): void {
		state.settingState.autoSave = action.payload.enabled;
	}
};