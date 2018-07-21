/**
 * ItemBar
 * @author lijun
 **/
import Databus from 'Databus'
import EventUtil from 'EventUtil'
let databus = new Databus()

cc.Class({
    extends: cc.Component,
    properties: {
        btnExchange: {
            default: null,
            type: cc.Button,
        },

        btnRemove: {
            default: null,
            type: cc.Button,
        },

        btnExplod: {
            default: null,
            type: cc.Button,
        },

        lbExchangeNum: {
            default: null,
            type: cc.Label,
        },

        lbRemoveNum: {
            default: null,
            type: cc.Label,
        },

        lbExplodNum: {
            default: null,
            type: cc.Label,
        },
    },

    update() {
        this.lbExchangeNum.string = "X" + databus.itemExchangeNum
        this.lbRemoveNum.string = "X" + databus.itemRemoveNum
        this.lbExplodNum.string = "X" + databus.itemExplodNum
    },

    onLoad() {

    },

    start(){
        databus.itemBarInstance = this
        EventUtil.GetInstance().AddEventListener("UnselectItem", function(){
            databus.selectItemMode = ""
            if(databus.itemBarInstance.btnExchange)
            {
                databus.itemBarInstance.btnExchange.node.setScale(cc.v2(0.8,0.8))
                databus.itemBarInstance.btnRemove.node.setScale(cc.v2(0.8,0.8))
                databus.itemBarInstance.btnExplod.node.setScale(cc.v2(0.8,0.8))
            }
        })
        this.btnExchange.node.setScale(cc.v2(0.8,0.8))
        this.btnRemove.node.setScale(cc.v2(0.8,0.8))
        this.btnExplod.node.setScale(cc.v2(0.8,0.8))
    },

    onDestroy() {

    },

    onExchangeClick(){
        if(databus.selectItemMode == "ExchangeItem")
        {
            databus.selectItemMode = ""
            this.btnExchange.node.setScale(cc.v2(0.8,0.8))
        }
        else if(databus.itemExchangeNum > 0){
            databus.selectItemMode = "ExchangeItem"
            this.btnExchange.node.setScale(cc.v2(1,1))
            this.btnRemove.node.setScale(cc.v2(0.8,0.8))
            this.btnExplod.node.setScale(cc.v2(0.8,0.8))
        }
    },

    onRemoveClick(){
        if(databus.selectItemMode == "RemoveItem")
        {
            databus.selectItemMode = ""
            this.btnRemove.node.setScale(cc.v2(0.8,0.8))
        }
        else if(databus.itemRemoveNum > 0) {
            databus.selectItemMode = "RemoveItem"
            this.btnExchange.node.setScale(cc.v2(0.8,0.8))
            this.btnRemove.node.setScale(cc.v2(1,1))
            this.btnExplod.node.setScale(cc.v2(0.8,0.8))
        }
    },

    onExplodClick(){
        if(databus.selectItemMode == "ExplodItem")
        {
            databus.selectItemMode = ""
            this.btnExplod.node.setScale(cc.v2(0.8,0.8))
        }
        else if(databus.itemExplodNum > 0) {
            databus.selectItemMode = "ExplodItem"
            this.btnExchange.node.setScale(cc.v2(0.8,0.8))
            this.btnRemove.node.setScale(cc.v2(0.8,0.8))
            this.btnExplod.node.setScale(cc.v2(1,1))
        }
    },


    Init() {

    }
})    