/**
 * 排行榜
 * @author lijun
 **/
import BasePanel from 'BasePanel'
import Databus from 'Databus'
import ModuleManager from "ModuleManager"
let databus = new Databus()

cc.Class({
    extends: BasePanel,
    name: "RankingView",
    properties: {
        groupFriendButton: cc.Node,
        friendButton: cc.Node,
        gameOverButton: cc.Node,
        rankingScrollView: cc.Sprite,//显示排行榜
        btnGroupFriend:cc.Button,
        btnFriend:cc.Button,
        lbGroupFriend:cc.Label,
        lbFriend:cc.Label
    },
    Init() {

    },
    onLoad() {
    },
    start() {
        console.log("RankViewPanel start " + CC_WECHATGAME)
        if (CC_WECHATGAME) {
            window.wx.showShareMenu({withShareTicket: true});//设置分享按钮，方便获取群id展示群排行榜
            this.tex = new cc.Texture2D();
            //window.sharedCanvas.width = 0.6 * databus.screenWidth;
            //window.sharedCanvas.height = 0.6 * databus.screenHeight;
            this.friendButtonFunc()
        }
        //自动提交分数
        this.submitScoreButtonFunc()
    },
    friendButtonFunc(event) {
        if (CC_WECHATGAME) {
            // 发消息给子域
            window.wx.postMessage({
                messageType: 1 + (databus.isIphoneX?10:0),
                MAIN_MENU_NUM: "x1"
            });
        } else {
            cc.log("获取好友排行榜数据。x1");
        }
        this.lbFriend.node.color = new cc.Color(48, 174, 255, 255);
        this.lbGroupFriend.node.color = new cc.Color(0, 0, 0, 255);
    },

    groupFriendButtonFunc: function (event) {
        if (CC_WECHATGAME) {
            window.wx.shareAppMessage({
                success: (res) => {
                    if (res.shareTickets != undefined && res.shareTickets.length > 0) {
                        window.wx.postMessage({
                            messageType: 5 + (databus.isIphoneX?10:0),
                            MAIN_MENU_NUM: "x1",
                            shareTicket: res.shareTickets[0]
                        });
                    }
                }
            });
        } else {
            cc.log("获取群排行榜数据。x1");
        }
        this.lbGroupFriend.node.color = new cc.Color(48, 174, 255, 255);
        this.lbFriend.node.color = new cc.Color(0, 0, 0, 255);
    },

    gameOverButtonFunc: function (event) {
        if (CC_WECHATGAME) {
            window.wx.postMessage({// 发消息给子域
                messageType: 4 + (databus.isIphoneX?10:0),
                MAIN_MENU_NUM: "x1"
            });
        } else {
            cc.log("获取横向展示排行榜数据。x1");
        }
    },

    submitScoreButtonFunc(){
        var score = databus.score;
        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType: 3 + (databus.isIphoneX?10:0),
                MAIN_MENU_NUM: "x1",
                score: score,
            });
        } else {
            cc.log("提交得分: x1 : " + score)
        }
    },

    closeButtonFunc(){
        ModuleManager.GetInstance().HideModule("RankPanel")
    },

    // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if (window.sharedCanvas != undefined) {
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.rankingScrollView.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    },
    update() {
        this._updateSubDomainCanvas();
    },
});
