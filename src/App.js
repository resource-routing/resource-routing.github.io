import React from 'react';
import './App.css';
import SideNav from './SideNav';
import Header from './Header';
import layout from './layout';
import Footer from './Footer';
import Box from './Box';
import Actions from './Actions';
import { readFromLocalStorage, saveToLocalStorage, downloadToFile } from './storage';
import Alert from './Alert';
import { BRANCH_LIMIT, SPLIT_LIMIT } from './limit';
import { benchmarkTime, benchmarkDelta } from './benchmark';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: "Loading...",
      projectName: "Loading...",
      sideCollapsed: false,
      resourcesCollapsed: false,
      dimensions: undefined,
      branches: [],
      activeBranch: -1,
      activeSplit: -1,
      autoSave: true,
      autoSaveHandle: undefined,
      displayAlert: false,
      onAlertOk: undefined,
      onAlertCancel: undefined,
      alertOkText: undefined,
      alertCancelText: undefined,
      alertText: undefined,
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.calculateDimensions.bind(this));
    this.calculateDimensions();
    this.loadStoredState(readFromLocalStorage);
    this.setAutoSave(true);
  }

  createDeepCopyOfBranchesFromState() {
    function deepCopyDelta(delta) {
      return { ...delta }
    }
    function deepCopyAction(action) {
      return {
        name: action.name,
        deltas: action.deltas.map(deepCopyDelta)
      }
    }
    function deepCopySplit(split) {
      return {
        name: split.name,
        expanded: split.expanded,
        actions: split.actions.map(deepCopyAction)
      }
    }
    return this.state.branches.map(branch => {
      return {
        name: branch.name,
        expanded: branch.expanded,
        splits: branch.splits.map(deepCopySplit)
      }
    })
  }

  setAutoSave(autoSave) {
    if (!autoSave) {
      if (this.state.autoSaveHandle) {
        const handle = this.state.autoSaveHandle;
        this.setState({
          autoSaveHandle: undefined,
          autoSave: false
        }, () => {
          window.clearInterval(handle)
        })
      } else {
        this.setState({
          autoSave: false
        });
      }
      this.setInformation("Auto save is now off.");
    } else {
      if (this.state.autoSaveHandle) {
        const handle = this.state.autoSaveHandle;
        this.setState({
          autoSaveHandle: window.setInterval(() => {
            this.saveStateToLocalStorage();
          }, 20000),
          autoSave: true
        }, () => {
          window.clearInterval(handle)
        })
      } else {
        this.setState({
          autoSaveHandle: window.setInterval(() => {
            this.saveStateToLocalStorage();
          }, 20000),
          autoSave: true
        })
      };
      this.saveStateToLocalStorage();
    }
  }


  loadStoredState(storedStateLoadFunction, start) {
    const startTime = start || benchmarkTime();
    const storedState = storedStateLoadFunction();
    if (storedState) {
      this.setState({
        branches: storedState.branches,
        activeBranch: storedState.activeBranch,
        activeSplit: storedState.activeSplit,
        projectName: storedState.projectName,
      }, () => {
        this.setInformation(`Data loaded in ${benchmarkDelta(startTime)} ms`);
      })
    }
  }

  saveStateToLocalStorage() {
    const startTime = benchmarkTime();
    saveToLocalStorage(this.getStateToStore());
    this.setInformation(`Saved to local storage in ${benchmarkDelta(startTime)} ms. Last saved at ${new Date()}`);
  }

  getStateToStore() {
    return {
      branches: this.state.branches,
      activeBranch: this.state.activeBranch,
      activeSplit: this.state.activeSplit,
      projectName: this.state.projectName,
    }
  }

  calculateDimensions() {
    const dimensions = layout(this.state.sideCollapsed, this.state.resourcesCollapsed);
    this.setState({ dimensions });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.calculateDimensions.bind(this));
    if (this.state.autoSaveHandle) {
      window.clearInterval(this.state.autoSaveHandle);
    }
  }

  setSideCollapsed(sideCollapsed) {
    this.setState({
      sideCollapsed: sideCollapsed,
      dimensions: layout(sideCollapsed, this.state.resourcesCollapsed),
    });
  }

  setResourcesCollapsed(resourcesCollapsed) {
    this.setState({
      resourcesCollapsed: resourcesCollapsed,
      dimensions: layout(this.state.sideCollapsed, resourcesCollapsed),
    });
  }

  setInformation(info) {
    this.setState({ info });
  }

  setProjectName(name) {
    this.setState({
      projectName: name
    })
  }

  setBranchPropertyAt(index, property, value) {
    const branchesCopy = this.createDeepCopyOfBranchesFromState();
    branchesCopy[index][property] = value;
    this.setState({
      branches: branchesCopy
    });
  }
  swapBranchesAt(i, j) {
    if (i >= 0 && i < this.state.branches.length && j >= 0 && j < this.state.branches.length && i !== j) {
      const startTime = benchmarkTime();
      const branchCopy = this.createDeepCopyOfBranchesFromState();
      const temp = branchCopy[i];
      branchCopy[i] = branchCopy[j];
      branchCopy[j] = temp;
      let newActiveBranch = this.state.activeBranch;
      if (this.state.activeBranch === i) {
        newActiveBranch = j;
      } else if (this.state.activeBranch === j) {
        newActiveBranch = i;
      }
      this.setState({
        branches: branchCopy,
        activeBranch: newActiveBranch,
      }, () => {
        this.setInformation(`Branch moved in ${benchmarkDelta(startTime)} ms`);
      });
    }
  }

  createBranchAt(index) {
    if (this.state.branches.length >= BRANCH_LIMIT) {
      this.displayAlert(`You have reached the maximum number of branches allowed (${BRANCH_LIMIT})`,
        "OK", () => { this.hideAlert() });
      this.setInformation("Branch Limit Reached.");
      return;
    }
    const startTime = benchmarkTime();
    const branchCopy = this.createDeepCopyOfBranchesFromState();
    const newBranch = {
      name: `Branch ${branchCopy.length + 1}`,
      expanded: true,
      splits: []
    }
    let newActiveBranch = this.state.activeBranch;
    if (index >= branchCopy.length) {
      branchCopy.push(newBranch);
    } else {
      branchCopy.splice(index, 0, newBranch);
      if (newActiveBranch >= index) {
        newActiveBranch++;
      }
    }
    this.setState({
      branches: branchCopy,
      activeBranch: newActiveBranch,
    }, () => {
      this.setInformation(`Branch added in ${benchmarkDelta(startTime)} ms`);
    });
  }

  deleteBranchAt(index) {
    const startTime = benchmarkTime();
    const branchCopy = this.createDeepCopyOfBranchesFromState();
    let newActiveBranch = this.state.activeBranch;
    let newActiveSplit = this.state.activeSplit;
    branchCopy.splice(index, 1);
    if (newActiveBranch === index) {
      newActiveBranch = -1;
      newActiveSplit = -1;
    } else if (newActiveBranch > index) {
      newActiveBranch--;
    }
    this.setState({
      branches: branchCopy,
      activeBranch: newActiveBranch,
      activeSplit: newActiveSplit,
    }, () => {
      this.setInformation(`Branch deleted in ${benchmarkDelta(startTime)} ms`);
    })
  }

  createSplitAt(branchIndex, index) {
    if (this.state.branches[branchIndex].splits.length >= SPLIT_LIMIT) {
      this.displayAlert(`You have reached the maximum number of splits allowed in one branch (${SPLIT_LIMIT})`,
        "OK", () => { this.hideAlert() });
      this.setInformation("Split Limit Reached.");
      return;
    }
    const startTime = benchmarkTime();
    const branchCopy = this.createDeepCopyOfBranchesFromState();

    const newSplit = {
      name: `Unnamed Split`,
      expanded: true,
      actions: []
    }
    let newActiveSplit = this.state.activeSplit;
    if (index >= branchCopy[branchIndex].splits.length) {
      branchCopy[branchIndex].splits.push(newSplit);
    } else {
      branchCopy[branchIndex].splits.splice(index, 0, newSplit);
      if (this.state.activeBranch == branchIndex && newActiveSplit >= index) {
        newActiveSplit++;
      }
    }
    this.setState({
      branches: branchCopy,
      activeSplit: newActiveSplit,
    }, () => {
      this.setInformation(`Split added in ${benchmarkDelta(startTime)} ms`);
    });

  }

  setSplitPropertyAt(branchIndex, index, property, value) {
    const branchCopy = this.createDeepCopyOfBranchesFromState();
    branchCopy[branchIndex].splits[index][property] = value;
    this.setState({
      branches: branchCopy
    })
  }

  deleteSplitAt(branchIndex, index) {
    const startTime = benchmarkTime();
    const branchCopy = this.createDeepCopyOfBranchesFromState();
    let newActiveBranch = this.state.activeBranch;
    let newActiveSplit = this.state.activeSplit;
    branchCopy[branchIndex].splits.splice(index, 1);
    if (newActiveBranch === branchIndex) {
      if (newActiveSplit === index) {
        newActiveBranch = -1;
        newActiveSplit = -1;
      } else if (newActiveSplit > index) {
        newActiveSplit--;
      }
    }

    this.setState({
      branches: branchCopy,
      activeBranch: newActiveBranch,
      activeSplit: newActiveSplit,
    }, () => {
      this.setInformation(`Split deleted in ${benchmarkDelta(startTime)} ms`);
    })
  }

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

  downloadStateToFile() {
    downloadToFile(this.getStateToStore());
  }
  render() {
    if (!this.state.dimensions) {
      return null;
    }

    const actions = {
      setSideCollapsed: this.setSideCollapsed.bind(this),
      setResourcesCollapsed: this.setResourcesCollapsed.bind(this),
      setInformation: this.setInformation.bind(this),
      setBranchExpandedAt: (i, value) => this.setBranchPropertyAt(i, "expanded", value),
      setBranchNameAt: (i, value) => this.setBranchPropertyAt(i, "name", value),
      createBranchAt: this.createBranchAt.bind(this),
      setAutoSave: this.setAutoSave.bind(this),
      deleteBranchAt: this.deleteBranchAt.bind(this),
      displayAlert: this.displayAlert.bind(this),
      hideAlert: this.hideAlert.bind(this),
      swapBranchesAt: this.swapBranchesAt.bind(this),
      saveStateToLocalStorage: this.saveStateToLocalStorage.bind(this),
      createSplitAt: this.createSplitAt.bind(this),
      setSplitExpandedAt: (b, i, value) => this.setSplitPropertyAt(b, i, "expanded", value),
      setSplitNameAt: (b, i, value) => this.setSplitPropertyAt(b, i, "name", value),
      deleteSplitAt: this.deleteSplitAt.bind(this),
      download: this.downloadStateToFile.bind(this),
      setProjectName: this.setProjectName.bind(this),
      loadStoredState: this.loadStoredState.bind(this),
    }
    return (

      <div style={{
        width: "100vw",
        height: "100vh"
      }}>
        <Box layout={this.state.dimensions.header} borderClass="border">
          <Header autoSave={this.state.autoSave} projectName={this.state.projectName} actions={actions} />
        </Box>
        <Box layout={this.state.dimensions.side} borderClass="border">
          <SideNav layout={this.state.dimensions.side} sideCollapsed={this.state.sideCollapsed} actions={actions} branches={this.state.branches} />
        </Box>
        <Box layout={this.state.dimensions.footer} borderClass="border">
          <Footer text={this.state.info} />
        </Box>
        <Box layout={this.state.dimensions.map} borderClass="border">
          <iframe src="https://objmap.zeldamods.org/#/map/z3,0,4" title="Object Map" width="100%" height="100%"></iframe>
        </Box>
        <Box layout={this.state.dimensions.actions} borderClass="border">
          <Actions resourcesCollapsed={this.state.resourcesCollapsed} setResourcesCollapsed={(c) => this.setResourcesCollapsed(c)} />
        </Box>
        <Box layout={this.state.dimensions.resources} borderClass="border">
          [WIP]
        </Box>

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
