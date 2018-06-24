/**
 * RuleTipPanel
 * @author lijun
 **/
import BasePanel from 'BasePanel'
import EventUtil from 'EventUtil'
import Databus from 'Databus'

let databus = new Databus()

cc.Class({
    extends: BasePanel,
    properties: {
        lbRule: {
            default: null,
            type: cc.RichText
        }
    },

    update() {

    },

    onDestroy() {
        EventUtil.GetInstance().DispatchEvent("HideRulePanel")
    },

    Init() {
        this.lbRule.maxWidth = 280
        this.lbRule.fontSize = 14
        this.lbRule.string = "<color=#AD152E>" + "规则说明:\n" +
            "1.选择</c><color=#3E964F>相同</c><color=#AD152E>的两个水果连接可消除并获得积分；\n" +
            "2.连接线不能超过</c><color=#3E964F>3根</c><color=#AD152E>且越少分数越高；\n" +
            "3.每次消除后，您有</c><color=#3E964F>" + databus.countDownTime +"</c><color=#AD152E>秒的时间思考下一次选择；\n" +
            "4.消除辣椒会爆炸，直接消除周围四格水果；\n" +
            "5.巧妙的利用道具可以让你更有策略；\n" +
            "6.每回合后产生随机事件：\n" +
            "<color=#3E964F>↑</c> 消除格以下向上移动\n" +
            "<color=#3E964F>↓</c> 消除格以上向下移动\n" +
            "<color=#3E964F>←</c> 消除格以右向左移动\n" +
            "<color=#3E964F>→</c> 消除格以左向右移动\n" +
            "          消除格将会被二者填充</color>"
        this._super()
    }
})    