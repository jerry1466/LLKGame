/**
 * AdPanel
 * @author lijun
 **/
import Databus from 'Databus'
import BasePanel from 'BasePanel'
import ArrayUtil from "ArrayUtil"

let databus = new Databus()
cc.Class({
    extends: BasePanel,
    properties: {
        spAd: {
            default: null,
            type: cc.Sprite
        },

        btnDownload: {
            default: null,
            type: cc.Button
        }
    },

    onLoad() {
        //console.log(databus.cfgData.set.love_game_ad.type, databus.cfgData.set.love_game_ad.poster)
        var randomItem = ArrayUtil.GetRandomValue(databus.cfgData.set.love_game_ad.poster)
        this.imageUrl =  randomItem.img
        var temp = this
        if(randomItem.preview == 1)
        {
            this.btnDownload.node.active = false
            wx.previewImage({
                urls:[temp.imageUrl],
                success:function(res){
                }
            })
            ModuleManager.GetInstance().HideModule("AdPanel")
        }
        else
        {
            this.btnDownload.node.active = true
            cc.loader.load(this.imageUrl, function(err, texture){
                var width = texture.width
                var height = texture.height
                var frame = new cc.SpriteFrame(texture)
                temp.spAd.spriteFrame = frame
                temp.spAd.node.width = 300
                temp.spAd.node.height = 500
            })
        }
    },

    update() {

    },

    onDestroy() {

    },

    onDownload() {
        var imageUrl = this.imageUrl
        wx.downloadFile({
            url: imageUrl,
            success: function (res) {
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: function (res) {
                        wx.showToast({title:'保存成功！\n请在手机相册里查看'})
                    },
                    fail: function (res) {
                        console.log(res)
                        wx.showToast({title:'保存失败！\n请稍候重试'})
                    }
                })
            },
            fail: function () {
                wx.showToast({title:'保存失败！\n请稍候重试'})
            }
        })
    },

    Init() {

    }
})    