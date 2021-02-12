import React from 'react';
import './App.css';
import SideNav from './sections/SideNav';
import Header from './sections/Header';
import layout from './sections/components/util/layout';
import Footer from './sections/Footer';
import Box from './sections/components/Box';
import Actions from './sections/Actions';
import { readFromLocalStorage, saveToLocalStorage, downloadToFile, sanitizeSplit } from './sections/components/util/sanitize';
import Alert from './sections/Alert';
import { benchmarkTime, benchmarkDelta } from './sections/components/util/benchmark';
import { tryClearResourceErrorFrom, calculateResourcesAt, getPreviousActionIndices } from './sections/components/util/data';
import Items from './sections/Items';
import { centerMap } from "./sections/components/util/object_map";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sideCollapsed: false,
      resourcesCollapsed: false,
      headerCollapsed: true,
      dimensions: undefined,
      map: {
        x: 0,
        y: 0,
        z: 3,
      }

      // branches: [],
      // items: [],
      // resources: {
      //   content: [],
      //   error: undefined,
      // },

      // activeBranch: -1,
      // activeSplit: -1,
      // activeAction: -1,
      // dirtyBranch: -1,
      // dirtySplit: -1,
      // dirtyAction: 0,

      // autoSave: true,
      // autoSaveHandle: undefined,

      // displayAlert: false,
      // onAlertOk: undefined,
      // onAlertCancel: undefined,
      // alertOkText: undefined,
      // alertCancelText: undefined,
      // alertText: undefined,

      // resourceUpdateHandle: undefined,
      // splitClipboard: undefined,
    }
  }

  setSideCollapsed(sideCollapsed) {
    this.setState({
      sideCollapsed: sideCollapsed,
      dimensions: layout(sideCollapsed, this.state.resourcesCollapsed, this.state.headerCollapsed),
    });
  }

  setResourcesCollapsed(resourcesCollapsed) {
    this.setState({
      resourcesCollapsed: resourcesCollapsed,
      dimensions: layout(this.state.sideCollapsed, resourcesCollapsed, this.state.headerCollapsed),
    });
  }

  setHeaderCollapsed(headerCollapsed) {
    this.setState({
      headerCollapsed: headerCollapsed,
      dimensions: layout(this.state.sideCollapsed, this.state.resourcesCollapsed, headerCollapsed),
    });
  }



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
  //   });

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

  componentDidMount() {
    window.addEventListener('resize', this.calculateDimensions.bind(this));
    this.calculateDimensions();
    //this.loadStoredState(readFromLocalStorage);
    //this.setAutoSave(true);

  }

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

  calculateDimensions() {
    const dimensions = layout(this.state.sideCollapsed, this.state.resourcesCollapsed, this.state.headerCollapsed);
    this.setState({ dimensions });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.calculateDimensions.bind(this));
    if (this.state.autoSaveHandle) {
      window.clearInterval(this.state.autoSaveHandle);
    }
    if (this.state.resourceUpdateHandle) {
      window.clearTimeout(this.state.resourceUpdateHandle);
    }
  }



  // setInformation(info) {
  //   this.setState({ info });
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

  displayAlert(text, okText, onOk, cancelText, onCancel) {
    this.setState({
      displayAlert: true,
      onAlertOk: onOk,
      onAlertCancel: onCancel,
      alertOkText: okText,
      alertCancelText: cancelText,
      alertText: text,
    });
  }

  hideAlert() {
    this.setState({
      displayAlert: false,
      onAlertOk: undefined,
      onAlertCancel: undefined,
      alertOkText: undefined,
      alertCancelText: undefined
    })
  }

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
    if (!this.state.dimensions) {
      return null;
    }

    const actions = {
      setSideCollapsed: this.setSideCollapsed.bind(this),
      setResourcesCollapsed: this.setResourcesCollapsed.bind(this),
      setHeaderCollapsed: this.setHeaderCollapsed.bind(this),
      // setInformation: this.setInformation.bind(this),
      // setAutoSave: this.setAutoSave.bind(this),
      // displayAlert: this.displayAlert.bind(this),
      // hideAlert: this.hideAlert.bind(this),
      // saveStateToLocalStorage: this.saveStateToLocalStorage.bind(this),
      // download: this.downloadStateToFile.bind(this),
      // setProjectName: this.setProjectName.bind(this),
      // loadStoredState: this.loadStoredState.bind(this),
      // recalculateResources: this.recalculateResources.bind(this),
      // doToBranches: this.doToBranches.bind(this),
      // copySplit: (split) => this.setState({ splitClipboard: sanitizeSplit(split), info: "Split copied." }),
      // splitClipboard: this.state.splitClipboard,
      // openSplit: this.openSplit.bind(this),
      // doToItems: this.doToItems.bind(this),
    }

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
    return (

      <div style={{
        width: "100vw",
        height: "100vh"
      }}>
        <Box layout={this.state.dimensions.header} borderClass="border overflow-hidden">
          <Header
            autoSave={this.state.autoSave}
            sideCollapsed={this.state.sideCollapsed}
            headerCollapsed={this.state.headerCollapsed}
            actions={actions} />
        </Box>
        <Box layout={this.state.dimensions.side} borderClass="border">
          <SideNav layout={this.state.dimensions.side} sideCollapsed={this.state.sideCollapsed} actions={actions} />
        </Box>
        <Box layout={this.state.dimensions.footer} borderClass="border">
          <Footer />
        </Box>
        <Box layout={this.state.dimensions.map}>
          {/* {this.state.map && < iframe id="object_map" src={`https://objmap.zeldamods.org/#/map/z${this.state.map.z},${this.state.map.x},${this.state.map.y}`} title="Object Map" width="100%" height="100%"></iframe>} */}
          {/* {console.log(getZ())} */}
        </Box>
        <Box layout={this.state.dimensions.actions} borderClass="border">
          <Actions
            layout={this.state.dimensions.actions}
            resourcesCollapsed={this.state.resourcesCollapsed}
            actions={actions} />
        </Box>
        {!this.state.dimensions.resources.hide &&
          <Box layout={this.state.dimensions.resources} borderClass="border">
            <button onClick={() =>
              this.setState({
                map: undefined,
              }, () => {
                this.setState({
                  map: {
                    x: 1000,
                    y: 1000,
                    z: 6
                  }
                })
              })
            }>test</button>
            {/* <Items
              layout={this.state.dimensions.resources}
              actions={actions}
              resourcesCollapsed={this.state.resourcesCollapsed}
              sideCollapsed={this.state.sideCollapsed}
              items={this.state.items}
              actionResources={actionResources}
              lastActionResources={lastActionResources}
            /> */}
          </Box>}

        <Alert
          enabled={this.state.displayAlert}
          text={this.state.alertText}
          okText={this.state.alertOkText}
          cancelText={this.state.alertCancelText}
          onOk={this.state.onAlertOk}
          onCancel={this.state.onAlertCancel}
        />

      </div>
    );
  }

}

export default App;
