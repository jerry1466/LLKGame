import SceneManager from "SceneManager";
import Databus from 'Databus'

let databus = new Databus()
/**
 * InterfaceManager
 * @auhor clairli
 */
let instance
export default class InterfaceManager {
    constructor() {

    }

    static GetInstance() {
        if (instance == null) {
            instance = new InterfaceManager()
        }
        return instance
    }

    Share(title){
        wx.shareAppMessage({title:title})
    }

    RegisterShareAppMessageHandler(){
        wx.showShareMenu()
        var imageArr = databus.cfgData.set.share.img
        var imageUrlIndex = Math.floor(Math.random() * imageArr.length)
        var temp = this
        wx.onShareAppMessage(function() {
            return {
                title: temp.getTitle(),
                imageUrl: imageArr[imageUrlIndex]
            }
        })
    }

    ShareWithImg(){
        this.Share(this.getTitle())
        var imageArr = databus.cfgData.set.share.img
        var imageUrlIndex = Math.floor(Math.random() * imageArr.length)
        var temp = this
        wx.onShareAppMessage(function () {
            return {
                title: temp.getTitle(),
                imageUrl: imageArr[imageUrlIndex]
            }
        })
    }

    ShareWithScore(){
        this.Share(this.getTitleWithScore())
        var imageArr = databus.cfgData.set.share.img
        var imageUrlIndex = Math.floor(Math.random() * imageArr.length)
        var temp = this
        wx.onShareAppMessage(function () {
            return {
                title: temp.getTitleWithScore(),
                imageUrl: imageArr[imageUrlIndex]
            }
        })
    }

    getTitle(){
        return databus.cfgData.set.share.title[0].replace("%name", databus.productName)
    }

    getTitleWithScore(){
        var withScoreStr = databus.cfgData.set.share.score_title[0].replace("%score", databus.score)
        return withScoreStr.replace("%name", databus.productName)
    }

    CreateAdViedo(adUnitId){
        var videoAdd = wx.createRewardedVideoAd({
            adUnitId:adUnitId
        })
        videoAdd.onLoad(()=>{console.log("广告组件拉取成功")})
        videoAdd.show()
            .catch(err => {
            videoAdd.load()
            .then(() => videoAdd.show())
        })
        videoAdd.onClose(res=>{
            if(res && res.isEnded || res === undefined)
            {
            //正常结束
            }
            else
            {
                //异常退出
                console.log(res)
            }
        })
    }

    CreateAdBanner(adUnitId){
        var bannerAd = wx.createBannerAd({
            adUnitId: adUnitId,
            style: {
                left: 0,
                top: databus.screenHeight - databus.adHeight,
                width: databus.screenWidth
            }
        })

        bannerAd.show().catch(err => console.log(err))
        bannerAd.onError(err => {
            console.log(err)
        })
    }
}