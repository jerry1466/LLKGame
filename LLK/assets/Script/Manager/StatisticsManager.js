import ModuleManager from "ModuleManager";
import EventUtil from "EventUtil"
let appid = "wx03661dbbbce9c0af"
let token = "sgxxlb1529915009"
let options = {}
let host = {}
let login_data = {};
let login_callback = null;
let domain = "https://2zhuji.cn";
let login_key = "game_userinfo";
let uv_key = "game_tunnel_uv";
let music_off;
let relive_time = -1;
let shareTickets = "";
let authMask;
let authButton;

let instance;

export default class StatisticsManager {
    static getInstance() {
        if (instance == null) {
            instance = new StatisticsManager();
        }
        return instance;
    }

    //统计入口
    statistics() {
        if (CC_WECHATGAME) {
            var _options = wx.getLaunchOptionsSync();
            console.log("options:", _options);
            options = _options["query"] || {};
            if (options.shareTicket) {
                console.log("options:", options);
                shareTickets = options.shareTicket;
            }
            this.getUserInfo();
            this.statsTunnelPv();
        }
    }

    //pv统计，在小游戏入口处判断
    statsTunnelPv() {
        //统计渠道
        var _options = options;
        console.log("_options", _options)
        if (!_options["wxa_tunnel"] || !token) return;
        let wxa_tunnel = _options["wxa_tunnel"] || "";
        let wxa_appid = _options["from_appid"] || "";
        let from_wecha = _options["from_wecha"] || "";
        let request = new XMLHttpRequest();
        request.open("get", domain + '/index.php?g=Wap&m=WxaDistribution&a=pv_statistics&tunnel_id=' + wxa_tunnel + '&token=' + token + "&from_appid=" + wxa_appid + "&from_wecha=" + from_wecha, true);
        request.send(null);
        request.onreadystatechange = function () {
            // readyState 五种状态
            // 0 － （未初始化）调用了open()方法，未调用send()方法
            // 1 － （载入）send()方法,正在发送请求
            // 2 － （载入完成）send()方法执行完成，已经接收到全部响应内容
            // 3 － （交互）正在解析响应内容
            // 4 － （完成）响应内容解析完成
            if (request.readyState == 4) {
                // status：http状态码
                if (request.status == 200) {
                    console.log(JSON.parse(request.responseText));
                } else {
                    console.log("post error : ");
                }
            }
        }
    }

    getUserInfo() {
        let that = this;
        wx.getStorage({
            key: login_key,
            complete: function (res) {
                if (res.data) {
                    //本地存储的信息
                    login_data.session_3rd = res.data.session_3rd;
                    if (res.data.host) {
                        that.host = res.data.host;
                        that.statsTunnelUv();
                        EventUtil.GetInstance().DispatchEvent("EnterBattle")
                    }
                } else {
                    ModuleManager.GetInstance().ShowModule('LoginPanel')
                }
            }
        });
    }

    //uv统计，在授权登陆获取wecha_id后
    statsTunnelUv() {
        //统计uv
        var _options = options;
        if (!_options["wxa_tunnel"] || !token || !host["wecha_id"]) return
        let wxa_tunnel = _options["wxa_tunnel"]
        let uv;
        let that = this;
        wx.getStorage({
            key: uv_key,
            success: function (res) {
            },
            fail: function (res) {
            },
            complete: function (res) {
                let time = new Date();
                let timeFormat = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate();
                let obj = res.data;
                if (obj) {
                    if (res.data["uv" + wxa_tunnel] == timeFormat) {
                        uv = 0;
                    } else {
                        uv = 1;
                        obj["uv" + wxa_tunnel] = timeFormat;
                        wx.setStorage({
                            key: uv_key,
                            data: obj,
                            success: function (res) {
                            },
                            fail: function (res) {
                            },
                            complete: function (res) {
                            }
                        })
                    }
                } else {
                    uv = 1;
                    let obj = {};
                    obj["uv" + wxa_tunnel] = timeFormat;
                    wx.setStorage({
                        key: uv_key,
                        data: obj,
                        success: function (res) {
                        },
                        fail: function (res) {
                        },
                        complete: function (res) {
                        }
                    })
                }
                if (uv) {
                    let post_data = {
                        tunnel_id: wxa_tunnel,
                        wecha_id: host.wecha_id,
                        token: token
                    }
                    if (options.from_wecha) {
                        post_data["from_wecha"] = options.from_wecha
                    }
                    if (options.from_appid) {
                        post_data["from_appid"] = options.from_appid
                    }
                    if (login_data.new_user) {
                        post_data["new_user"] = login_data.new_user
                    }
                    let request = new XMLHttpRequest();
                    request.open("get", domain + '/index.php?g=Wap&m=WxaDistribution&a=uv_statistics', true);
                    request.setRequestHeader("Content-Type", "application/json");
                    request.send(post_data);
                    request.onreadystatechange = function () {
                        // readyState 五种状态
                        // 0 － （未初始化）调用了open()方法，未调用send()方法
                        // 1 － （载入）send()方法,正在发送请求
                        // 2 － （载入完成）send()方法执行完成，已经接收到全部响应内容
                        // 3 － （交互）正在解析响应内容
                        // 4 － （完成）响应内容解析完成
                        if (request.readyState == 4) {
                            // status：http状态码
                            if (request.status == 200) {
                                console.log(JSON.parse(request.responseText));
                            } else {
                                console.log("post error : ");
                            }
                        }
                    }
                }
            }
        })
    }
}