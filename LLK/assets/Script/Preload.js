import LevelManager from 'LevelManager'
import SceneManager from "SceneManager";
import InterfaceManager from "InterfaceManager";
import ModuleManager from "ModuleManager";
import Databus from 'Databus'
import ArrayUtil from "ArrayUtil"
import EventUtil from "EventUtil";
import StatisticsManager from 'StatisticsManager'

let databus = new Databus()

cc.Class({
    extends: cc.Component,
    properties: {
        bg:{
            default: null,
            type: cc.Sprite,
        },
        btnEnter:{
            default: null,
            type:cc.Button,
        },

        btnRule: {
            default: null,
            type:cc.Button,
        },

        btnShare: {
            default: null,
            type:cc.Button
        },

        lbSubscribe:{
            default: null,
            type:cc.Label
        }
    },

    onLoad:function(){
        var temp = this
        SceneManager.GetInstance().rootCanvas = temp.node
        if(CC_WECHATGAME)
        {
            wx.getSystemInfo({
                success:function(res){
                    databus.screenWidthRatio = res.windowWidth / databus.screenWidth
                    databus.screenHeightRatio = res.windowHeight / databus.screenHeight
                    databus.screenWidth = res.windowWidth
                    databus.screenHeight = res.windowHeight
                    databus.isIphoneX = (databus.screenWidth == 375) && (databus.screenHeight == 812)
                    //temp.bg.node.width = res.windowWidth
                    //temp.bg.node.height = res.windowHeight
                    console.log("设备分辨率:", databus.screenWidth, databus.screenHeight, databus.isIphoneX)


                }
            })
            EventUtil.GetInstance().AddEventListener("EnterBattle", function(){
                ModuleManager.GetInstance().HideModule("LoginPanel")
                new LevelManager().SwitchLevel("battle", "0")
            })
        }
        this.lbSubscribe.label = databus.cfgData.set.subscribe_text
        if(databus.cfgData.audit == 1)
        {
            this.btnShare.node.active = false
        }
        else
        {
            this.btnShare.node.active = true
        }
        if(databus.cfgData.set.wx_bannner != null && databus.cfgData.set.wx_bannner.length > 0)
        {
            InterfaceManager.GetInstance().CreateAdBanner(ArrayUtil.GetRandomValue(databus.cfgData.set.wx_bannner))
        }
    },

    onDestroy(){

    },

    start(){
        setTimeout(function(){
            InterfaceManager.GetInstance().RegisterShareAppMessageHandler()
        }, 300)
    },

    onEnterClick(){
        if(databus.userInfo)
        {
            EventUtil.GetInstance().RemoveEventKey("EnterBattle")
            new LevelManager().SwitchLevel("battle", "0")
        }
        else
        {
            StatisticsManager.getInstance().statistics();
        }
    },

    onRuleClick(){
        ModuleManager.GetInstance().ShowModule("RuleTipPanel")
    },

    onShareClick(){
        InterfaceManager.GetInstance().ShareWithImg()
    },

    onRankClick(){
        ModuleManager.GetInstance().ShowModule("RankPanel")
    },

    onAiWanClick(){
        this.onAdClick()
    },

    onMoreGameClick(){
        ModuleManager.GetInstance().ShowModule("AdPanel")
    },

    onSoundClick(){
        databus.soundEnable = !databus.soundEnable
        var title = databus.soundEnable? "开启音效":"关闭音效"
        wx.showToast({title:title})
    },

    onAdClick(){
        //new LevelManager().SwitchLevel("ad", "0")
        wx.previewImage({
            urls:[ArrayUtil.GetRandomValue(databus.cfgData.set.more_game_ad.poster).img],
            success:function(res){
                console.log(res)
            }
        })
    },
});