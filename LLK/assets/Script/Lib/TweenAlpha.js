var TweenAlpha = cc.Class({
    extends: cc.Component,

    properties: {
        time: 1,                //Tween完成所花費的時間
        timer: 0,               //計時器
        from: 0,//Tween開始的值
        to: 0,  //Tween結束的值
        count : 1, //Tween次数
        repeater : 0, //循环计数
        interval : 0, //每次间隔
        isDone: false,
        onFinishCallBack: {     //Tween結束之後的回調
            default: null,
            type: Function
        }

    },
    statics: {
        //將target在time秒之內從from移動到to
        begin: function (target, from, to, time, count) {

            var tween = target.getComponent(TweenAlpha);

            if (tween)
                tween.destroy();

            tween = target.addComponent(TweenAlpha);
            tween.from = from;
            tween.to = to;
            tween.time = time;
            tween.count = count == null ? 1 : count
            tween.repeater = 0
            tween.interval = tween.time / tween.count
            return tween;
        }

    },
    // use this for initialization
    onLoad: function () {
        this.node.setOpacity(this.from)
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

        if (this.isDone) {
            this.destroy();
            return;
        }
        this.timer += dt;
        if(this.timer > (this.repeater + 1) * this.interval)
        {
            this.repeater = this.repeater + 1
        }
        if (this.repeater <= this.count - 1)
        {
            this.repeaterTimer = this.timer - this.repeater * this.interval
            this.node.setOpacity(this.from + (this.to - this.from) * (this.repeaterTimer / this.interval));
        }

        if (this.timer >= this.time) {
            this.isDone = true;

            if (this.onFinishCallBack) {
                this.onFinishCallBack(this.node);
            }
        }
    },
});