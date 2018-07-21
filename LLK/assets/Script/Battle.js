/**
 * 游戏场景
 * @author lijun
 **/
import GameInfo from 'GameInfo'
import EventUtil from 'EventUtil'
import Databus from 'Databus'
import SceneManager from 'SceneManager'
import TweenScale from 'TweenScale'
import AffairConstant from "AffairConstant";
import PrefabUtil from 'PrefabUtil'
import ModuleManager from 'ModuleManager'
import LevelManager from "LevelManager";

let databus = new Databus()
cc.Class({
    extends: cc.Component,
    properties: {
        bgm: {
            default: null,
            type: cc.AudioSource
        },
        bgmSelectSound: {
            default: null,
            type: cc.AudioSource
        },
        bgmWipeOff: {
            default: null,
            type: cc.AudioSource
        },
        bgmWin: {
            default: null,
            type: cc.AudioSource
        },
        bgmLose: {
            default: null,
            type: cc.AudioSource
        },
        bgmExplod: {
            default: null,
            type: cc.AudioSource
        },
        cellContent: {
            default: null,
            type: cc.Node
        },
        spCountDownBar:{
            default: null,
            type: cc.Sprite
        },
        btnPlay:{
            default: null,
            type: cc.Button
        },
        btnPause:{
            default: null,
            type: cc.Button
        },
        btnQuestion:{
            default: null,
            type: cc.Button
        },
        lbScore:{
            default: null,
            type: cc.Label
        },
        lbAffair:{
            default: null,
            type: cc.Label
        },
        conAffairFill:{
            default: null,
            type: cc.Node
        }
    },

    onLoad () {

    },

    update() {

    },

    onDestroy() {

    },

    start() {
        console.log("enter battle start this:", this)
        this.bgmWin.stop()
        this.bgmLose.stop()
        this.bgmExplod.stop()
        this.bgmWipeOff.stop()
        this.bgmSelectSound.stop()
        databus.battleInstance = this
        console.log("enter battle start temp:", databus.battleInstance)
        EventUtil.GetInstance().AddEventListener("PlaySelectSound", function(){
                if(databus.soundEnable)
                    databus.battleInstance.bgmSelectSound.play()
            }
        )
        EventUtil.GetInstance().AddEventListener("PlayWipeOffSound", function(){
                if(databus.soundEnable)
                    databus.battleInstance.bgmWipeOff.play()
            }
        )
        EventUtil.GetInstance().AddEventListener("PlayExplodSound", function() {
                if(databus.soundEnable)
                    databus.battleInstance.bgmExplod.play()
            }
        )
        EventUtil.GetInstance().AddEventListener("ResetCountDown", function(){
            databus.battleInstance.resetCountDown(databus.battleInstance)
            }
        )
        EventUtil.GetInstance().AddEventListener("GameOver", function(){
            databus.battleInstance.gameOver(databus.battleInstance)
            }
        )
        EventUtil.GetInstance().AddEventListener("GameRestart", function(){
            databus.battleInstance.gameRestart(databus.battleInstance)
            }
        )
        EventUtil.GetInstance().AddEventListener("UpdateScore", function(param){
            databus.battleInstance.updateScore(databus.battleInstance, param)
            }
        )
        EventUtil.GetInstance().AddEventListener("CreateAffair", function(affair){
                console.log("enter create affair", databus.battleInstance)
            databus.battleInstance.createAffair(databus.battleInstance, affair)
            }
        )
        EventUtil.GetInstance().AddEventListener("HideRulePanel", function() {
                var countdownBar = databus.battleInstance.spCountDownBar.node.getComponent("UICountDownBar")
                if (countdownBar != null) {
                    countdownBar.Resume()
                }
            }
        )
        EventUtil.GetInstance().AddEventListener("Reborn", function() {
                databus.battleInstance.reborn(databus.battleInstance)
            }
        )
        EventUtil.GetInstance().AddEventListener("ReturnToPreload", function() {
            EventUtil.GetInstance().RemoveEventKey("PlaySelectSound")
            EventUtil.GetInstance().RemoveEventKey("PlayWipeOffSound")
            EventUtil.GetInstance().RemoveEventKey("PlayExplodSound")
            EventUtil.GetInstance().RemoveEventKey("ResetCountDown")
            EventUtil.GetInstance().RemoveEventKey("GameOver")
            EventUtil.GetInstance().RemoveEventKey("GameRestart")
            EventUtil.GetInstance().RemoveEventKey("UpdateScore")
            EventUtil.GetInstance().RemoveEventKey("HideRulePanel")
            EventUtil.GetInstance().RemoveEventKey("CreateAffair")
            EventUtil.GetInstance().RemoveEventKey("Reborn")
                setTimeout(function(){
                    new LevelManager().SwitchLevel("preload", null)
                }, 100)
            }
        )

        if(databus.soundEnable) this.bgm.play()
        SceneManager.GetInstance().rootCanvas = this.node
        console.log("this.lbAffair:" + this.lbAffair.node)
        GameInfo.GetInstance().Start(this.cellContent)
        let countdownBar = this.spCountDownBar.node.getComponent("UICountDownBar")
        if(countdownBar != null){
            countdownBar.Init(databus.countDownTime, function(){
                GameInfo.GetInstance().GameOver(false)
            })
        }
        this.enterPause()
    },

    gameRestart(temp){
        temp.start()
    },

    onPlayClick(){
        this.enterPlay()
    },

    onPauseClick(){
        this.enterPause()
    },

    onQuestionClick(){
        ModuleManager.GetInstance().ShowModule("RuleTipPanel")
        var countdownBar = this.spCountDownBar.node.getComponent("UICountDownBar")
        if(countdownBar != null){
            countdownBar.Pause()
        }
    },

    enterPlay(){
        this.btnPlay.active = false
        this.btnPause.active = true
    },

    enterPause(){
        this.btnPlay.active = true
        this.btnPause.active = false
    },

    resetCountDown(temp){
        var countdownBar = temp.spCountDownBar.node.getComponent("UICountDownBar")
        if(countdownBar != null){
            countdownBar.Restart()
        }
    },

    gameOver(temp){
        temp.bgm.stop()
        if(databus.win){
            if(databus.soundEnable)
            {
                temp.bgmWin.play()
            }
        }else{
            if(databus.soundEnable)
            {
                temp.bgmLose.play()
            }
        }
        var countdownBar = temp.spCountDownBar.node.getComponent("UICountDownBar")
        if(countdownBar != null){
            countdownBar.Pause()
        }
    },

    reborn(temp){
        temp.bgm.play()
        temp.resetCountDown(temp)
    },

    updateScore(temp, param){
        temp.lbScore.string = databus.score
        if(param == true){
            var tweenScale = TweenScale.begin(temp.lbScore.node, cc.v2(1, 1), cc.v2(1.75, 1.75), 0.15, 1)
            tweenScale.onFinishCallBack = function() {
                TweenScale.begin(temp.lbScore.node, cc.v2(1.75, 1.75), cc.v2(1, 1), 0.15, 1)
            }
        }
    },

    createAffair(temp, affair){
        var affairText = null
        if(affair == AffairConstant.AffairEnum().UP_MOVE){
            affairText = "↑"
        }
        else if(affair == AffairConstant.AffairEnum().DOWN_MOVE){
            affairText = "↓"
        }
        else if(affair == AffairConstant.AffairEnum().LEFT_MOVE){
            affairText = "←"
        }
        else if(affair == AffairConstant.AffairEnum().RIGHT_MOVE){
            affairText = "→"
        }
        if(affairText != null)
        {
            console.log("temp:", temp)
            temp.lbAffair.node.active = true
            temp.lbAffair.string = affairText
            temp.conAffairFill.active = false
        }
        else
        {
            temp.lbAffair.node.active = false
            temp.conAffairFill.active = true
            temp.conAffairFill.removeAllChildren()
            var fillTypeArr = databus.GetNextFillType(false)
            var fillType1 = fillTypeArr[0]
            var fillType2 = fillTypeArr[1]
            PrefabUtil.GetPrefabInstance("Prefab/CellPic_" + fillType2, function(success, instance){
                if(success)
                {
                    instance.parent = temp.conAffairFill
                    instance.y = 0
                    PrefabUtil.GetPrefabInstance("Prefab/CellPic_" + fillType1, function(success, instance){
                        if(success)
                        {
                            instance.parent = temp.conAffairFill
                            instance.y = 0
                            console.log("conAffairFill childCount:", temp.conAffairFill.childrenCount)
                        }
                    })
                }
            })
        }
    }
})    