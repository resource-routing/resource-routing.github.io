(function() {
    const EXAMPLE = {
        settings:{
            headerCollapsed: false,
            resourceCollapsed: false,
            splitsCollpased: false
        },
        current:{
            branch: 0,
            split: 0,
            action: 0
        },
        branches:[
            {
                name: "Branch 1",
                splits: [
                    {
                        name: "Split 1",
                        actions:[
                            {
                                name: "Example Action",
                                delta: ""
                            }
                        ]
                    }
                ]
            }
        ]
    }
    
    let data = {
        settings:{
            headerCollapsed: false,
            resourceCollapsed: false,
            splitsCollapsed: false
        },
        current:{
            branch: -1,
            split: -1,
            action: -1 
        },
        branches:[]
    };

    const dom = {
        buttonToggleCollapseResource: document.getElementById("button_resource_hide"),
        buttonToggleCollapseNavigation: document.getElementById("button_side_hide"),
        divResourceContent:document.getElementById("div_resource_content"),
        divResource:document.getElementById("div_resource"),
        divSplitAction:document.getElementById("div_split_action"),
        divNav:document.getElementById("div_nav"),
        divMain:document.getElementById("div_main")
    }

    dom.buttonToggleCollapseResource.onclick = function(){
        data.settings.resourceCollapsed = !data.settings.resourceCollapsed;
        applyResourceCollapse();
    }
    dom.buttonToggleCollapseNavigation.onclick = function(){
        data.settings.splitsCollapsed = !data.settings.splitsCollapsed;
        applyNavigationCollapse();
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
    function hide(node){
        node.style="display:none";
    }
    function show(node){
        node.style="";
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

})();
