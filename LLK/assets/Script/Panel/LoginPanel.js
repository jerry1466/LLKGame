import LoginManager from 'LoginManager'
import StatisticsManager from 'StatisticsManager'
import BasePanel from 'BasePanel'
import Databus from 'Databus'
import EventUtil from "EventUtil"

let databus = new Databus()
cc.Class({
    extends:BasePanel,

    onLoad(){
        console.log('尝试用户登录！');
        var temp = this
        temp.loginButton = wx.createUserInfoButton({
            type: 'text',
            text: '点击登录',
            style: {
                left: 0.5 * databus.screenWidth - 80,
                top: 0.5 * databus.screenHeight - 20,
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
        console.log(temp.loginButton)
        temp.loginButton.onTap((res)=> {
            if (res["encryptedData"] && res["iv"]) {
                databus.userInfo = res.userInfo
                LoginManager.GetInstance().WxLogin(res,function(fail){
                    if(fail)
                    {
                        console.log("用户登录失败")
                    }
                    else
                    {
                        temp.loginButton.hide()
                        EventUtil.GetInstance().DispatchEvent("EnterBattle")
                    }
                    StatisticsManager.getInstance().statsTunnelUv();
                })
            }
        })
    },

    Init(){

    }
})