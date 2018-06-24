/**
 * TipManager
 * @auhor lijun
 */
import PrefabUtil from 'PrefabUtil'

let instance
export default class TipManager {
    constructor() {

    }

    static GetInstance() {
        if (instance == null) {
            instance = new TipManager()
        }
        return instance
    }

    RegisterCallback(button, callback) {
        button.node.on(cc.Node.EventType.TOUCH_END, callback)
    }

    RegisterShowToast(button, tip) {
        button.node.on(cc.Node.EventType.TOUCH_END, function(){
            wx.showToast({ title: tip, icon: 'none', duration:2000 })
        })
    }
}