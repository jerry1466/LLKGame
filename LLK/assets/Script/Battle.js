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
        var temp = this
        EventUtil.GetInstance().AddEventListener("PlaySelectSound", function(){
                if(databus.soundEnable)
                    temp.bgmSelectSound.play()
            }
        )
        EventUtil.GetInstance().AddEventListener("PlayWipeOffSound", function(){
                if(databus.soundEnable)
                    temp.bgmWipeOff.play()
            }
        )
        EventUtil.GetInstance().AddEventListener("PlayExplodSound", function() {
                if(databus.soundEnable)
                    temp.bgmExplod.play()
            }
        )
        EventUtil.GetInstance().AddEventListener("ResetCountDown", function(){
                    temp.resetCountDown(temp)
            }
        )
        EventUtil.GetInstance().AddEventListener("GameOver", function(){
                temp.gameOver(temp)
            }
        )
        EventUtil.GetInstance().AddEventListener("GameRestart", function(){
                temp.gameRestart(temp)
            }
        )
        EventUtil.GetInstance().AddEventListener("UpdateScore", function(param){
                temp.updateScore(temp, param)
            }
        )
        EventUtil.GetInstance().AddEventListener("CreateAffair", function(affair){
                temp.createAffair(temp, affair)
            }
        )
        EventUtil.GetInstance().AddEventListener("HideRulePanel", function() {
                var countdownBar = temp.spCountDownBar.node.getComponent("UICountDownBar")
                if (countdownBar != null) {
                    countdownBar.Resume()
                }
            }
        )
    },

    update() {

    },

    onDestroy() {
        EventUtil.GetInstance().RemoveEventKey("PlaySelectSound")
        EventUtil.GetInstance().RemoveEventKey("PlayWipeOffSound")
        EventUtil.GetInstance().RemoveEventKey("PlayExplodSound")
        EventUtil.GetInstance().RemoveEventKey("ResetCountDown")
        EventUtil.GetInstance().RemoveEventKey("GameOver")
        EventUtil.GetInstance().RemoveEventKey("GameRestart")
        EventUtil.GetInstance().RemoveEventKey("UpdateScore")
        EventUtil.GetInstance().RemoveEventKey("HideRulePanel")
    },

    start() {
        if(databus.soundEnable) this.bgm.play()
        SceneManager.GetInstance().rootCanvas = this.node
        GameInfo.GetInstance().Start(this.cellContent)
        var countdownBar = this.spCountDownBar.node.getComponent("UICountDownBar")
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
                temp.bgmWin.play()
        }else{
            if(databus.soundEnable)
                temp.bgmLose.play()
        }
        var countdownBar = temp.spCountDownBar.node.getComponent("UICountDownBar")
        if(countdownBar != null){
            countdownBar.Pause()
        }
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
                        }
                    })
                }
            })
        }
    }
})    