/**
 * 连连看单元格
 * @author lijun
 **/
import Databus from 'Databus'
import PrefabUtil from 'PrefabUtil'
import TweenScale from 'TweenScale'
import GameInfo from 'GameInfo'
import EventUtil from 'EventUtil'

let databus = new Databus()
cc.Class({
    extends: cc.Component,
    properties: {
        spCell: {
            default: null,
            type: cc.Sprite
        },
        spSelect: {
            default: null,
            type: cc.Sprite
        }
    },

    update() {

    },

    onDestroy() {

    },

    loadRes(){
        if(this.type > 0)
        {
            var temp = this
            setTimeout(function(){
                PrefabUtil.GetPrefabInstance("Prefab/CellPic_" + temp.type, function(success, instance){
                    if(success)
                    {
                        instance.parent = temp.node
                        instance.parent.active = true
                        instance.parent.setScale(cc.v2(1, 1))
                        instance.x = instance.y = 0
                        instance.width = instance.height = temp.node.width - 5
                        temp.cellPic = instance
                    }
                })
            }, 10)
        }
    },

    onClick(){
        GameInfo.GetInstance().CheckLLK(this)
    },

    Init(type, gridX, gridY, empty) {
        this.type = type
        this.gridX = gridX
        this.gridY = gridY
        this.empty = empty
        this.loadRes()
        this.SetSelect(false)
    },

    SetSelect(select){
        this.select = select
        this.spSelect.node.active = select
    },

    RemoveCell(rate){
        var temp = this
        var tweenScale = TweenScale.begin(this.node, cc.v2(1, 1), cc.v2(0, 0), 0.2, 1)
        tweenScale.onFinishCallBack = function()
        {
            if(temp.cellPic)
            {
                temp.cellPic.removeFromParent()
                console.log("temp.cellPic.destroy()")
                temp.cellPic.destroy()
                temp.cellPic = null
            }
            this.node.active = false
        }
        console.log(rate, this.type)
        if(rate != null && rate > 0 && this.type > 0)
        {
            databus.score += Math.floor(databus.itemScore[this.type - 1] * rate)
        }
        this.type = 0
        this.empty = true
    },

    RemoveCellImmediate(){
        this.node.active = false
        this.type = 0
        this.empty = true
        if(this.cellPic)
        {
            this.cellPic.removeFromParent()
            this.cellPic.destroy()
            this.cellPic = null
        }
    },

    ChangeType(type){
        if(type > 0)
        {
            this.type = type
            this.empty = false
            if(this.cellPic)
            {
                this.cellPic.removeFromParent()
                this.cellPic.destroy()
                this.cellPic = null
            }
            this.node.active = true
            this.node.setScale(cc.v2(1, 1))
            this.loadRes()
        }
        else{
            this.RemoveCellImmediate()
        }
    }
})    