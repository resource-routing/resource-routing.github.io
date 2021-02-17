import React from "react";
import "./App.css";
import SideNav from "sections/SideNav";
import Header from "sections/Header";
import Footer from "sections/Footer";
import Actions from "sections/Actions";
import Box from "components/Box";
import {
	getActionsBounds,
	getFooterBounds,
	getHeaderBounds,
	getMapBounds,
	getResourcesBounds,
	getSideBounds,
	isResourcesSectionHidden
} from "store/application/selectors";
import {
	setWindowWidth,
	doLayout
} from "store/application/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import Alert from "dialog/Alert";
import Items from "sections/Items";
import { startResourceCalcClock, stopResourceCalcClock } from "data/resource";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			alertContent: undefined,
			alertActions: [],
		};
	}

	componentDidMount() {
		window.addEventListener("resize", this.redoLayout.bind(this));
		this.props.actions.doLayout();
		startResourceCalcClock();
	}

	redoLayout() {
		this.props.actions.setWindowWidth({ width: window.innerWidth });
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.redoLayout.bind(this));
		stopResourceCalcClock();
		// if (this.state.autoSaveHandle) {
		//   window.clearInterval(this.state.autoSaveHandle);
		// }
		// if (this.state.resourceUpdateHandle) {
		//   window.clearTimeout(this.state.resourceUpdateHandle);
		// }
	}

	showAlert(content = undefined, actions = [{ name: "OK" }]) {
		this.setState({
			alertContent: content,
			alertActions: actions,
		});
	}

	// setSideCollapsed(sideCollapsed) {
	//   this.setState({
	//     sideCollapsed: sideCollapsed,
	//     dimensions: layout(sideCollapsed, this.state.resourcesCollapsed, this.state.headerCollapsed),
	//   });
	// }
	// setResourcesCollapsed(resourcesCollapsed) {
	//   this.setState({
	//     resourcesCollapsed: resourcesCollapsed,
	//     dimensions: layout(this.state.sideCollapsed, resourcesCollapsed, this.state.headerCollapsed),
	//   });
	// }
	// setHeaderCollapsed(headerCollapsed) {
	//   this.setState({
	//     headerCollapsed: headerCollapsed,
	//     dimensions: layout(this.state.sideCollapsed, this.state.resourcesCollapsed, headerCollapsed),
	//   });
	// }
	// recalculateResources(branch, split) {
	//   if (this.state.resourceUpdateHandle) {
	//     if (branch > this.state.branches.length) return;
	//     if (branch > this.state.dirtyBranch) return;
	//     if (branch === this.state.dirtyBranch && split > this.state.dirtySplit) return;
	//   }
	//   if (this.state.resourceUpdateHandle) {
	//     window.clearTimeout(this.state.resourceUpdateHandle);
	//   }
	//   this.setState({
	//     dirtyBranch: branch,
	//     dirtySplit: split,
	//     dirtyAction: 0,
	//     resourceUpdateHandle: undefined,
	//     ...tryClearResourceErrorFrom(this.state.resources, branch, split),
	//   }, () => {
	//     const handle = window.setTimeout(() => {
	//       this.doCalcResources();
	//     }, 100);
	//     this.setState({
	//       resourceUpdateHandle: handle,
	//       info: "Updating Resources",
	//     })
	//   })
	// }
	// doCalcResources() {
	//   let b = this.state.dirtyBranch;
	//   let s = this.state.dirtySplit;
	//   let a = this.state.dirtyAction;
	//   console.log(`calc resource, b=${b}, s=${s}, a=${a}`);
	//   if (b >= this.state.branches.length) {
	//     this.finishResourceUpdate();
	//     return;
	//   }
	//   while (s >= this.state.branches[b].splits.length) {
	//     b++;
	//     if (b >= this.state.branches.length) {
	//       this.finishResourceUpdate();
	//       return;
	//     }
	//     s = 0;
	//   }
	//   while (a >= this.state.branches[b].splits[s].actions.length) {
	//     s++;
	//     while (s >= this.state.branches[b].splits.length) {
	//       b++;
	//       if (b >= this.state.branches.length) {
	//         this.finishResourceUpdate();
	//         return;
	//       }
	//       s = 0;
	//     }
	//     a = 0;
	//   }
	//   const newResources = calculateResourcesAt(this.state.resources, this.state.branches, this.state.items, b, s, a);
	//   this.setState({
	//     dirtyBranch: b,
	//     dirtySplit: s,
	//     dirtyAction: a + 1,
	//     ...newResources,
	//   }, () => {
	//     const handle = window.setTimeout(() => {
	//       this.doCalcResources();
	//     }, 100);
	//     this.setState({
	//       resourceUpdateHandle: handle,
	//       info: `Resources updated for "${this.state.branches[b].name}" Branch, "${this.state.branches[b].splits[s].name}" Split: ${this.state.branches[b].splits[s].actions[a].name}`,
	//     });
	//   })
	// }
	// finishResourceUpdate() {
	//   if (this.state.resourceUpdateHandle) {
	//     window.clearTimeout(this.state.resourceUpdateHandle);
	//   }
	//   this.setState({
	//     resourceUpdateHandle: undefined,
	//     info: `Resources update finished.`,
	//   })
	// }
	// setAutoSave(autoSave) {
	//   if (!autoSave) {
	//     if (this.state.autoSaveHandle) {
	//       const handle = this.state.autoSaveHandle;
	//       this.setState({
	//         autoSaveHandle: undefined,
	//         autoSave: false
	//       }, () => {
	//         window.clearInterval(handle)
	//       })
	//     } else {
	//       this.setState({
	//         autoSave: false
	//       });
	//     }
	//     this.setInformation("Auto save is now off.");
	//   } else {
	//     if (this.state.autoSaveHandle) {
	//       const handle = this.state.autoSaveHandle;
	//       this.setState({
	//         autoSaveHandle: window.setInterval(() => {
	//           this.saveStateToLocalStorage();
	//         }, 20000),
	//         autoSave: true
	//       }, () => {
	//         window.clearInterval(handle)
	//       })
	//     } else {
	//       this.setState({
	//         autoSaveHandle: window.setInterval(() => {
	//           this.saveStateToLocalStorage();
	//         }, 20000),
	//         autoSave: true
	//       })
	//     };
	//     this.saveStateToLocalStorage();
	//   }
	// }
	// loadStoredState(storedStateLoadFunction, start) {
	//   const startTime = start || benchmarkTime();
	//   const storedState = storedStateLoadFunction();
	//   if (storedState) {
	//     this.setState({
	//       branches: storedState.branches,
	//       activeBranch: storedState.activeBranch,
	//       activeSplit: storedState.activeSplit,
	//       projectName: storedState.projectName,
	//       items: storedState.items,
	//     }, () => {
	//       this.setInformation(`Data loaded in ${benchmarkDelta(startTime)} ms`);
	//       this.recalculateResources(0, 0);
	//     })
	//   }
	// }
	// saveStateToLocalStorage() {
	//   const startTime = benchmarkTime();
	//   saveToLocalStorage(this.getStateToStore());
	//   this.setInformation(`Saved to local storage in ${benchmarkDelta(startTime)} ms. Last saved at ${new Date()}`);
	// }
	// getStateToStore() {
	//   return {
	//     branches: this.state.branches,
	//     activeBranch: this.state.activeBranch,
	//     activeSplit: this.state.activeSplit,
	//     activeAction: this.state.activeAction,
	//     projectName: this.state.projectName,
	//     itmes: this.state.items,
	//   }
	// }
	// setProjectName(name) {
	//   this.setState({
	//     projectName: name
	//   })
	// }
	// doToBranches(transitionFunction, info, dirtyBranch, dirtySplit) {
	//   const startTime = benchmarkTime();
	//   this.setState({
	//     ...transitionFunction({
	//       branches: this.state.branches,
	//       activeBranch: this.state.activeBranch,
	//       activeAction: this.state.activeAction,
	//       activeSplit: this.state.activeSplit,
	//     })
	//   }, () => {
	//     if (info) {
	//       this.setInformation(`${info} (${benchmarkDelta(startTime)}ms)`);
	//     }
	//     if (dirtyBranch !== undefined) {
	//       this.recalculateResources(dirtyBranch, dirtySplit || 0);
	//     }
	//   })
	// }
	// doToItems(transitionFunction, info, doRecalculate) {
	//   const startTime = benchmarkTime();
	//   this.setState({
	//     ...transitionFunction({
	//       branches: this.state.branches,
	//       items: this.state.items,
	//     })
	//   }, () => {
	//     if (info) {
	//       this.setInformation(`${info} (${benchmarkDelta(startTime)}ms)`);
	//     }
	//     if (doRecalculate) {
	//       this.recalculateResources(0, 0);
	//     }
	//   })
	// }
	// downloadStateToFile() {
	//   downloadToFile(this.getStateToStore());
	// }
	// openSplit(b, s) {
	//   const startTime = benchmarkTime();
	//   this.setState({
	//     activeBranch: b,
	//     activeSplit: s,
	//     activeAction: -1,
	//   }, () => {
	//     this.setInformation(`Split detail opened. (${benchmarkDelta(startTime)}ms)`);
	//   })
	// }
	// openAction(a) {
	//   if (this.state.activeBranch >= 0 && this.state.activeSplit >= 0) {
	//     const startTime = benchmarkTime();
	//     this.setState({
	//       activeAction: a,
	//     }, () => {
	//       this.setInformation(`Action resources opened. (${benchmarkDelta(startTime)}ms)`);
	//     })
	//   }
	// }
	render() {
		// if (!this.state.dimensions) {
		//   return null;
		// }

		const appActions = {
			showAlert: this.showAlert.bind(this),
		};

		// const showAction = this.state.activeBranch >= 0 &&
		//   this.state.activeBranch < this.state.branches.length &&
		//   this.state.activeSplit >= 0 &&
		//   this.state.activeSplit < this.state.branches[this.state.activeSplit].splits.length;

		// let actionResources, lastActionResources;
		// if (showAction) {
		//   const rec = this.state.resources.content;
		//   if (rec) {
		//     const branchRec = this.state.resources.content[this.state.activeBranch];
		//     if (branchRec) {
		//       const splitRec = this.state.resources.content[this.state.activeBranch][this.state.activeSplit];
		//       if (splitRec) {
		//         actionResources = this.state.resources.content[this.state.activeBranch][this.state.activeSplit][this.state.activeAction];
		//         const [prevB, prevS, prevA, hasPrev] = getPreviousActionIndices(this.state.branches, this.state.activeBranch, this.state.activeSplit, this.state.activeAction);
		//         lastActionResources = {};
		//         if (hasPrev) {
		//           const prevBranchRec = this.state.resources.content[prevB];
		//           if (prevBranchRec) {
		//             const prevSplitRec = this.state.resources.content[prevB][prevS];
		//             if (prevSplitRec) {
		//               lastActionResources = this.state.resources.content[prevB][prevS][prevA];
		//             }
		//           }
		//         }
		//       }
		//     }
		//   }
		// }
		const {
			headerBounds,
			sideBounds,
			actionsBounds,
			footerBounds,
			mapBounds,
			resourcesHidden,
			resourcesBounds,
		} = this.props;
		return (
			<div style={{
				width: "100vw",
				height: "100vh"
			}}>
				<Box layout={headerBounds} borderClass="border overflow-hidden">
					<Header appActions={appActions} />
				</Box>
				<Box layout={sideBounds} borderClass="border">
					<SideNav appActions={appActions} />
				</Box>
				<Box layout={footerBounds} borderClass="border">
					<Footer appActions={appActions} />
				</Box>
				<Box layout={mapBounds}>
					{/* {this.state.map && < iframe id="object_map" src={`https://objmap.zeldamods.org/#/map/z${this.state.map.z},${this.state.map.x},${this.state.map.y}`} title="Object Map" width="100%" height="100%"></iframe>} */}
					{/* {console.log(getZ())} */}
                    [WIP]
				</Box>
				<Box layout={actionsBounds} borderClass="border">
					<Actions appActions={appActions} />
				</Box>
				{!resourcesHidden &&
					<Box layout={resourcesBounds} borderClass="border">
						<Items appActions={appActions} />
					</Box>
				}
				<Alert content={this.state.alertContent} alertActions={this.state.alertActions} actions={{
					hideAlert: () => this.showAlert()
				}} />
			</div>
		);
	}

}

const mapStateToProps = (state) => ({
	headerBounds: getHeaderBounds(state),
	sideBounds: getSideBounds(state),
	actionsBounds: getActionsBounds(state),
	footerBounds: getFooterBounds(state),
	mapBounds: getMapBounds(state),
	resourcesHidden: isResourcesSectionHidden(state),
	resourcesBounds: getResourcesBounds(state),
});

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		setWindowWidth,
		doLayout
	}, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
