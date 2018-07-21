/**
 * GameResultPanel
 * @author lijun
 **/
import ModuleManager from 'ModuleManager'
import BasePanel from 'BasePanel'
import InterfaceManager from "InterfaceManager"
import Databus from 'Databus'
import GameInfo from "GameInfo";
import EventUtil from 'EventUtil'
import ArrayUtil from 'ArrayUtil'

let databus = new Databus()

cc.Class({
    extends: BasePanel,
    properties: {
        lbScore: {
            default: null,
            type: cc.RichText
        },

        btnShare: {
            default: null,
            type: cc.Button
        },

        btnReplay: {
            default: null,
            type: cc.Button
        },

        btnRank: {
            default: null,
            type: cc.Button
        },

        spWinEmo:{
            default: null,
            type: cc.Sprite
        },

        spLoseEmo:{
            default: null,
            type: cc.Sprite
        }
    },

    onLoad(){
        var temp = this
        EventUtil.GetInstance().AddEventListener("VideoWatchOver", function(){
            temp.reborn()
        })

        if(databus.cfgData.audit == 1)
        {
            this.btnShare.node.active = false
        }
        else
        {
            this.btnShare.node.active = true
        }
    },

    start(){
        //InterfaceManager.GetInstance().CreateAdViedo(ArrayUtil.GetRandomValue(databus.cfgData.set.wx_video))
    },

    update() {

    },

    onDestroy() {
        EventUtil.GetInstance().RemoveEventKey("VideoWatchOver")
    },


    Init(win) {
        this.spWinEmo.node.active = win
        this.spLoseEmo.node.active = false
        var resultColor = win ? "#AD152E" : "#3E964F"
        var resultText = win ? "": "游戏结束"
        var label = "<color=" + resultColor + ">" + resultText + "</c>\n" + "<color=#03AEFF>最终积分：" + databus.score +"</color>"
        this.lbScore.string = label
    },

    onShareClick() {
        InterfaceManager.GetInstance().ShareWithScore()
    },

    onReplayClick() {
        ModuleManager.GetInstance().HideModule("GameResultPanel")
        EventUtil.GetInstance().DispatchEvent("ReturnToPreload")
        //EventUtil.GetInstance().DispatchEvent("VideoWatchOver")
    },

    onRankClick() {
        ModuleManager.GetInstance().ShowModule("RankPanel")
    },

    reborn(){
        if(databus.cfgData.set.relive_time > 0)
        {
            GameInfo.GetInstance().Reborn()
        }
    }
})    