/**
 * 倒计时组件
 * @author lijun
 */
cc.Class({
    extends:cc.Component,

    properties:{
      lbCountDown:{
          default: null,
          type: cc.Label,
      }
    },

    Begin(totalTime, callback){
        this.totalTime = totalTime
        this.callback = callback
        this.recordTime = 0
        this.start = false
        this.pause = false
        this.setLbCountDown()
    },

    Pause(){
        this.pause = true
    },

    Resume(){
        this.pause = false
    },

    setLbCountDown(){
        this.lbCountDown.string = Math.floor(this.totalTime - this.recordTime)
    },

    update(dt){
        if(this.start && !this.pause)
        {
            this.recordTime += dt
            this.setLbCountDown()
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