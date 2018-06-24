/**
 * GameResultPanel
 * @author lijun
 **/
import ModuleManager from 'ModuleManager'
import BasePanel from 'BasePanel'
import InterfaceManager from "InterfaceManager"
import Databus from 'Databus'
import GameInfo from "GameInfo";

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

    update() {

    },

    onDestroy() {
        GameInfo.GetInstance().Replay()
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
    },

    onRankClick() {
        ModuleManager.GetInstance().ShowModule("RankPanel")
    }
})    