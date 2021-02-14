import { PayloadAction } from "@reduxjs/toolkit";
import { ReduxGlobalState } from "store/store";

export default {
	setItemFilter: (state: ReduxGlobalState, action: PayloadAction<{ filter: string }>): void => {
		state.settingState.itemFilter = action.payload.filter;
	},
};