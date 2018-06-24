/**
 * Ad
 * @author lijun
 **/
import Databus from 'Databus'
import ArrayUtil from "ArrayUtil"
import LevelManager from "LevelManager"

let databus = new Databus()
cc.Class({
    extends: cc.Component,
    properties: {
        spAd: {
            default: null,
            type: cc.Sprite
        },
    },

    onLoad() {
        //console.log(databus.cfgData.set.love_game_ad.type, databus.cfgData.set.love_game_ad.poster)
        wx.previewImage({
            urls:[ArrayUtil.GetRandomValue(databus.cfgData.set.more_game_ad.poster).img],
            success:function(res){
                console.log(res)
            }
        })
    },

    update() {

    },

    onDestroy() {

    },

    Init() {

    },

    onButtonClick() {
        new LevelManager().SwitchLevel("preload", "0")
    },
})    