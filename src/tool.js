(function() {
    const EXAMPLE = {
        settings:{
            resourceCollapsed: false,
            splitsCollpased: false,
			displayHelp: false,
        },
        current:{
            branch: 0,
            split: 0,
            action: 0
        },
        branches:[
            {
                name: "Branch 1",
				editing: false,
				expanded: false,
                splits: [
                    {
                        name: "Split 1",
						editing: false,
                        actions:[
                            {
                                name: "Example Action",
                                delta: {
									"resource 1": {
										type: "set",
										value: 1
									},
									"resource 2": {
										type: "add",
										value: 1
									},
									"resource 3": {
										type: "ref_set",
										value: "resource 2"
									},
									"resource 4": {
										type: "ref_add",
										value: "resource 2"
									}
								}
                            },{
                                name: "Example Note",
                                delta: {}
                            },
                        ]
                    },{
						name: "Split 2",
						editing: false,
						actions:[]
					}
                ]
            },{
				name: "Branch 2",
				editing: false,
				expanded: false,
				splits:[
					{
						name: "Split 2",
						editing: false,
						actions:[]
					}
				]
			}
        ]
    }
    
    let data = {
		...EXAMPLE,
        settings:{
            resourceCollapsed: false,
            splitsCollapsed: false,
			displayHelp: false,
        },
        current:{
            branch: -1,
            split: -1,
            action: -1 
        },
    };

    const dom = {
        buttonToggleCollapseResource: document.getElementById("button_resource_hide"),
        buttonToggleCollapseNavigation: document.getElementById("button_side_hide"),
		buttonHelp:document.getElementById("button_help"),
        divResourceContent:document.getElementById("div_resource_content"),
        divResource:document.getElementById("div_resource"),
        divSplitAction:document.getElementById("div_split_action"),
        divNav:document.getElementById("div_nav"),
        divMain:document.getElementById("div_main"),
		divHelp:document.getElementById("div_help"),
		divSplit:document.getElementById("div_split"),
    }

    dom.buttonToggleCollapseResource.onclick = function(){
        data.settings.resourceCollapsed = !data.settings.resourceCollapsed;
        applyResourceCollapse();
    }
    dom.buttonToggleCollapseNavigation.onclick = function(){
        data.settings.splitsCollapsed = !data.settings.splitsCollapsed;
        applyNavigationCollapse();
    }
	dom.buttonHelp.onclick = function(){
		data.settings.displayHelp = !data.settings.displayHelp;
		applyDisplayHelp();
	}
    function applyResourceCollapse(){
        if(!data.settings) return;
        if(!data.settings.resourceCollapsed){
            show(dom.divResourceContent);
            dom.divResource.className="";
            dom.divSplitAction.className="";
            dom.buttonToggleCollapseResource.innerText="Collapse";
        }else{
            hide(dom.divResourceContent);
            dom.divResource.className="resource-collapsed";
            dom.divSplitAction.className="resource-collapsed";
            dom.buttonToggleCollapseResource.innerText="Expand";
        }
    }
    function applyNavigationCollapse(){
        if(!data.settings) return;
        if(!data.settings.splitsCollapsed){
            dom.divNav.className="";
            dom.divMain.className="";
            dom.buttonToggleCollapseNavigation.innerText="Collapse Navigation";
        }else{
            dom.divNav.className="nav-collapsed";
            dom.divMain.className="nav-collapsed";
            dom.buttonToggleCollapseNavigation.innerText="Expand Navigation";
        }
    }
	function applyDisplayHelp(){
		if(!data.settings) return;
		if(data.settings.displayHelp){
            hide(dom.divSplit);
            show(dom.divHelp);
			dom.buttonHelp.innerText="Hide Help";
        }else{
            show(dom.divSplit);
            hide(dom.divHelp);
			dom.buttonHelp.innerText="Show Help";
        }
	}
    function hide(node){
        node.style="display:none";
    }
    function show(node){
        node.style="";
    }
	function clearChildren(node){
		while(node.firstChild){
			node.removeChild(node.firstChild);
		}
	}
    function isDataLoaded(){
        return data.branches;
    }
    function isActiveBranchValid(){
        return isDataLoaded() && data.current.branch >=0 && data.current.branch < data.branches.length;
    }
    function isActiveSplitValid(){
        if(!isActiveBranchValid()) return false;
        const branch = data.current.branch;
        return data.current.split >= 0 && data.current.split < data.branches[branch].splits.length;
    }
    function isActiveActionValid(){
        if(!isActiveSplitValid()) return false;
        const branch = data.current.branch;
        const split = data.current.split;
        return data.current.action >=0 && data.current.action < data.branches[branch].splits[split].actions.length;
    }
    function loadResourceSection(){
        if(!isActiveActionValid()) return;
    }
	function loadNavSection(){
		clearChildren(dom.divNav);
		const rootList = document.createElement("ol");
		for(let i=0;i<data.branches.length;i++){
			loadNavSectionBranch(rootList, i);
		}
		dom.divNav.appendChild(rootList);
	}
	function loadNavSectionBranch(rootList, branchIndex){
		const branchListItem = document.createElement("li");
		const branchExpandButton = document.createElement("button");
		const branchName = document.createElement("span");
		const branchEditButton = document.createElement("button");
		const branchSplitList = document.createElement("ul");
		const applyBranchExpansion = () =>{
			if(!isDataLoaded()) return;
			if(data.branches[branchIndex].expanded){
				branchExpandButton.innerText="-";
				show(branchSplitList);
			}else{
				branchExpandButton.innerText="+";
				hide(branchSplitList);
			}
		}
		branchExpandButton.onclick= function(){
			if(!isDataLoaded()) return;
			data.branches[branchIndex].expanded = !data.branches[branchIndex].expanded;
			applyBranchExpansion();
		}
		applyBranchExpansion();
		const branchNameInner = document.createElement("strong");
		branchNameInner.innerText = data.branches[branchIndex].name;
		branchName.appendChild(branchNameInner);
		branchEditButton.innerText="Edit";
		branchListItem.appendChild(branchExpandButton);
		branchListItem.appendChild(branchName);
		branchListItem.appendChild(branchEditButton);
		branchListItem.appendChild(branchSplitList);
		rootList.appendChild(branchListItem);
	}
	
	applyResourceCollapse();
	applyNavigationCollapse();
	applyDisplayHelp();
	
	loadNavSection();

})();
