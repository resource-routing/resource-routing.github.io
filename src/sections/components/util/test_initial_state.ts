
export default {
	routeState: {
		projectName: "Test Project Name",
		activeBranch: 0,
		activeSplit: 1,
		activeAction: 1,
		branches: [{
			name: "Test Branch 1",
			expanded: true,
			splits: [{
				name: "Test B1 Split 1",
				mapX: 0,
				mapY: 0,
				mapZ: 3,
				expanded: true,
				actions: [{
					name: "B1S1 Action1",
					deltaString: "",
					expanded: false,
					deltas: {},
					deltaError: null,
				}, {
					name: "B1S1 Action2",
					deltaString: "",
					expanded: false,
					deltas: {},
					deltaError: null,
				}],
			}, {
				name: "Test B1 Split 2",
				mapX: 0,
				mapY: 0,
				mapZ: 3,
				expanded: true,
				actions: [{
					name: "B1S2 Action1",
					deltaString: "[hello]+1",
					expanded: true,
					deltas: {
						"hello": {
							type: "add",
							value: 1,
						}
					},
					deltaError: null,
				}],
			}]
		}, {
			name: "Test Branch 2",
			expanded: true,
			splits: [{
				name: "Test B2 Split 1",
				mapX: 0,
				mapY: 0,
				mapZ: 3,
				expanded: false,
				actions: [],
			}, {
				name: "Test B2 Split 2",
				mapX: 0,
				mapY: 0,
				mapZ: 3,
				expanded: true,
				actions: [],
			}]
		}],
		items: [{
			name: "hello",
			color: "orange",
		}],
		resources: {
			error: null,
			content: [],
		},
		info: "Test Info",
	},
	settingState: {
		autoSave: false,
		linkObjectMap: false,
	}
};