/**
 * ModuleManager
 * @auhor lijun
 */
import ModuleConstant from 'ModuleConstant'
import PrefabUtil from 'PrefabUtil'
import SceneManager from 'SceneManager'
import TweenScale from 'TweenScale'

let instance
let mask
export default class ModuleManager {
    constructor() {

    }

    static GetInstance() {
        if (instance == null) {
            instance = new ModuleManager()
            instance.moduleMap = {}
        }
        return instance
    }

    ShowModule(moduleName, param){
        if(this.moduleMap[moduleName] != null)
        {
            instance = this.moduleMap[moduleName]
            instance.getComponent('BasePanel').Init(param)
        }
        else
        {
            var temp = this
            if(this.mask == null)
            {
                var maskUrl = ModuleConstant.GetInstance().GetModuleUrl("PanelMask")
                PrefabUtil.GetPrefabInstance(maskUrl, function(success, instance){
                    if(success)
                    {
                        temp.mask = instance
                        temp.loadModule(temp, moduleName, param)
                    }
                })
            }
            else
            {
                this.loadModule(this, moduleName, param)
            }
        }
    }

    loadModule(object, moduleName, param){
        var prefabUrl = ModuleConstant.GetInstance().GetModuleUrl(moduleName)
        PrefabUtil.GetPrefabInstance(prefabUrl, function(success, instance){
            if(success)
            {
                object.moduleMap[moduleName] = instance
                object.mask.parent = SceneManager.GetInstance().rootCanvas
                object.mask.width = SceneManager.GetInstance().rootCanvas.width
                object.mask.height = SceneManager.GetInstance().rootCanvas.height
                object.mask.x = object.mask.y = 0
                var panelMask = object.mask.getComponent("PanelMask")
                panelMask.Init(moduleName)
                instance.parent = SceneManager.GetInstance().rootCanvas
                instance.x = 0
                instance.y = 0
                var basePanel = instance.getComponent('BasePanel')
                basePanel.Init(param)
                if(basePanel.openAnim)
                {
                    TweenScale.begin(instance,cc.v2(0, 0), cc.v2(1, 1), 0.2, 1)
                }
                panelMask.RegisterBlankClose(basePanel.blankClose)
            }
        })
    }

    HideModule(moduleName){
        var instance = this.moduleMap[moduleName]
        if(instance)
        {
            instance.removeFromParent()
            console.log("instance.destroy()")
            instance.destroy()
            instance = null
            this.moduleMap[moduleName] = null
            this.mask.removeFromParent()
        }
    }
}