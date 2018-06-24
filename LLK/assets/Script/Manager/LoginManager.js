let instance
export default class LoginManager{
    constructor(){

    }

    static GetInstance(){
        if(instance == null){
            instance = new LoginManager()
            instance.domain = "https://2zhuji.cn"
            instance.token = "wkgq1527239965"
        }
        return instance
    }

    WxLogin(callback){
        if(callback&&!this.callback){
            this.callback=callback;
        }
        if(this.login_flag){
            return;
        }
        //要实时获取用户信息
        this.login_flag=true;
        this.loginNow();
    }
    loginNow() {
        //要获取unionid,需要先获取session_key,encryptedData和iv
        //调用微信小程序wx.login,获取用户的信息和res.code
        var _this = this;
        wx.login({
            success: function (login_res) {
                _this.sendSession(login_res.code);
            },
            fail: function(res){
                console.log("loginNow:" + res);
                _this.loginFail();
            }
        });
    }
    sendSession(code) {
        var _this = this;
        var post_data={
            token:this.token,
            code:code
        }
        wx.request({
            url: _this.domain+'/index.php?g=Wap&m=Wxaapi&a=login',
            data:post_data,
            success:function(res){
                console.log("sendsession:",res);
                if(res.data.status==1001){
                    _this.data.session_3rd = res.data.session_3rd;
                    _this.data.auth="getSession";
                    //当前用为新用户
                    _this.data.new_user = res.data.new_user;
                    if(res.data.userinfo&&(res.data.userinfo.forbidden=="1")){
                        //当前用户在黑名单，退出
                        _this.callBack=null;
                        _this.login_flag=false;
                        wx.navigateBack(30);
                        return;
                    }
                    if(res.data.userinfo&&res.data.userinfo.wecha_id&&res.data.userinfo.wechaname&&res.data.userinfo.portrait){
                        //服务器存有当前用户的信息，就用这个信息，授权登陆结束
                        var info=res.data.userinfo;
                        _this.host={
                            name:info.wechaname,
                            sex: info.sex,
                            portrait:info.portrait,
                            unionid:"",
                            wecha_id:info.wecha_id,
                            local_wecha_id:info.wecha_id,
                            province: info.province,
                            city: info.city,
                            id:info.id
                        }
                        wx.setStorage({
                            key: _this.key_login,
                            data: {
                                session_3rd: _this.data.session_3rd,
                                host:_this.host
                            }
                        });
                        if(_this.callback){
                            _this.callback();
                            _this.callback=null;
                        }
                        _this.login_flag=false;
                    }else{
                        //新用户首次授权
                        wx.getUserInfo({
                            success: function (res) {
                                var userInfo = res.userInfo;
                                _this.host = {
                                    name: userInfo.nickName,
                                    sex: userInfo.gender,
                                    portrait: userInfo.avatarUrl,
                                    unionid: "",
                                    wecha_id: "",
                                    local_wecha_id: "",
                                    province: userInfo.province,
                                    city: userInfo.city
                                }
                                wx.getUserInfo({
                                    withCredentials: true,
                                    success: function (res) {
                                        _this.data.encryptedData = res.encryptedData;
                                        _this.data.iv = res.iv;
                                        _this.getUserBySession(true);
                                    },
                                    fail: function (res) {
                                        console.log("getUserInfo2 fail");
                                        _this.data.auth="fail";
                                        _this.login_flag=false;
                                        _this.loginFail();
                                    }
                                });
                            },
                            fail: function (res) {
                                console.log("getUserInfo fail");
                                _this.data.auth="fail";
                                _this.login_flag=false;
                                _this.loginFail();
                            }
                        });
                    }
                }else{
                    _this.loginFail();
                }
            }
        });
    }
    getUserBySession() {
        var _this = this;
        //获取unionid
        wx.request({
            url: _this.domain + '/index.php?g=Wap&m=Wxaapi&a=getunionid',
            method: 'GET',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
                session_3rd: _this.data.session_3rd,
                encrypted: _this.data.encryptedData,
                iv: _this.data.iv
            },
            success: function (res) {
                if (res.data && res.data.wecha_id) {
                    _this.host.wecha_id=res.data.wecha_id;
                    _this.host.local_wecha_id=res.data.wecha_id;
                    _this.host.unionid=res.data.unionid;
                    wx.setStorage({
                        key: _this.key_login,
                        data: {
                            session_3rd: _this.data.session_3rd,
                            host:_this.host
                        }
                    });
                    _this.data.auth="success";
                    console.log("done");
                    if(_this.callback){
                        _this.callback();
                        _this.callback=null;
                    }
                    _this.login_flag=false;
                }else{
                    console.log("getUserBySession:" + res)
                    _this.loginFail();
                }
            }
        })
    }
    loginFail(){
        //授权登陆失败
        if(this.callback){
            this.callback("fail");
            this.callback=null;
        }
    }
}