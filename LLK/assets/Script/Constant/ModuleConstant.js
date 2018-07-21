let instance
export default class ModuleConstant {
    constructor() {

    }

    static GetInstance(){
        if(instance)
        {
            return instance
        }
        instance = new ModuleConstant()
        instance.moduleNames = {}
        instance.register()
        return instance
    }

    register(){
        this.moduleNames["PanelMask"] = "Prefab/Panel/PanelMask"
        this.moduleNames["RuleTipPanel"] = "Prefab/Panel/RuleTipPanel"
        this.moduleNames["GameResultPanel"] = "Prefab/Panel/GameResultPanel"
        this.moduleNames["RankPanel"] = "Prefab/Panel/RankPanel"
        this.moduleNames["AdPanel"] = "Prefab/Panel/AdPanel"
        this.moduleNames["LoginPanel"] = "Prefab/Panel/LoginPanel"
    }

    GetModuleUrl(moduleName){
        return this.moduleNames[moduleName]
    }
}