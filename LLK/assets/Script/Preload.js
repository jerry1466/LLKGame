import LevelManager from 'LevelManager'
import SceneManager from "SceneManager";
import InterfaceManager from "InterfaceManager";
import ModuleManager from "ModuleManager";
import Databus from 'Databus'
import ArrayUtil from "ArrayUtil"
import LoginManager from 'LoginManager'

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

                    console.log('尝试用户登录！');
                    temp.loginButton = wx.createUserInfoButton({
                        type: 'text',
                        text: '点击登录',
                        style: {
                            left: 110 * databus.screenWidthRatio,
                            top: 356 * databus.screenHeightRatio,
                            width: 160,
                            height: 40,
                            lineHeight: 40,
                            backgroundColor: '#ff0000',
                            color: '#ffffff',
                            textAlign: 'center',
                            fontSize: 16,
                            borderRadius: 4
                        }
                    })
                    temp.loginButton.onTap((res)=> {
                        console.log(res)
                        console.log('获取用户登录态成功！' + res.errMsg);
                        temp.loginButton.hide()
                        var signature = res.signature
                    wx.login({
                        success: function (res) {
                            // res.code 为用户的登录凭证
                            if (res.code) {
                                console.log('获取用户登录态成功！' + res.code);
                                wx.showToast({title:"登录成功"})
                                /*
                                // 游戏服务器处理用户登录
                                var appId = 'wx4f7170918c7d3896';//微信公众号平台申请的appid
                                var appSecret = '67275c673f40204aaf285bc5bfce3568';//微信公众号平台申请的app secret
                                var js_code = res.code;//调用登录接口获得的用户的登录凭证code
                                wx.request({
                                    url: 'https://developers.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + appSecret + '&js_code=' + js_code + '&grant_type=authorization_code',
                                    data: {},
                                    method: 'GET',
                                    success: function (res) {
                                        var openid = res.data.openid //返回的用户唯一标识符openid
                                        console.log(openid)
                                        console.log("试试吧上面就是获得的openid")
                                        var ACCESS_TOKEN = 'wkgq15272399965'
                                        wx.request({
                                            url:'https://developers.weixin.qq.com/wxa/checksession?access_token=' + ACCESS_TOKEN + '&signature=' + signature + '&openid=' + openid + '&sig_method=SIG_METHOD',
                                            data: {},
                                            method: 'GET',
                                            success: function (res) {
                                                console.log("用户签名返回" + res)
                                                InterfaceManager.GetInstance().CreateAdViedo()
                                            }
                                        })
                                    }
                                })
                                */
                            }
                            else {
                                // 失败处理
                                console.log('获取用户登录态失败！' + res.errMsg);
                                wx.showToast({ title: '获取用户登录态失败！' + res.errMsg + "\n请关闭游戏后重新尝试", icon: 'none', duration:2000 })
                            }
                        },
                        fail: function (res) {
                            // 失败处理
                            console.log('用户登录失败！' + res.errMsg);
                            wx.showToast({ title: '用户登录失败！' + res.errMsg + "\n请关闭游戏后重新尝试", icon: 'none', duration:2000 })
                        }
                    });
                        /*
                        LoginManager.GetInstance().WxLogin(function(fail){
                            if(fail)
                            {
                                console.log("用户登录失败")
                            }
                            else
                            {
                                InterfaceManager.GetInstance().CreateAdViedo()
                            }
                        })
                        */
                    })
                }
            })
        }
    },

    onDestroy(){
        this.loginButton.hide()
    },

    onEnterClick(){
        new LevelManager().SwitchLevel("battle", "0")
        //new LevelManager().SwitchLevel("ad", "0")
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