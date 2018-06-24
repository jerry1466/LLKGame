/**
 * 倒计时Bar
 * @author lijun
 */
cc.Class({
    extends:cc.Component,

    properties:{
        barBg:{
            default: null,
            type: cc.Sprite,
        },
        bar:{
            default: null,
            type: cc.Sprite,
        }
    },

    onLoad(){
        this.orignialWidth = this.bar.node.width
    },

    Init(totalTime, callback){
        this.totalTime = totalTime
        this.callback = callback
        this.recordTime = 0
        this.start = false
        this.pause = false
        this.setBarCountDown()
    },

    Pause(){
        this.pause = true
    },

    Resume(){
        this.pause = false
    },

    Restart(){
        this.recordTime = 0
        this.start = true
        this.pause = false
        this.setBarCountDown()
    },

    setBarCountDown(){
        this.bar.node.width = this.orignialWidth * (this.totalTime - this.recordTime) / this.totalTime
    },

    update(dt){
        if(this.start && !this.pause)
        {
            this.recordTime += dt
            this.setBarCountDown()
            if(this.recordTime >= this.totalTime)
            {
                if(this.callback != null)
                {
                    this.callback()
                }
            }
        }
    }
})