var TweenScale = cc.Class({
    extends: cc.Component,

    properties: {
        time: 1,                //Tween完成所花費的時間
        timer: 0,               //計時器
        from: cc.v2(1,1),//Tween開始的值
        to: cc.v2(1,1),  //Tween結束的值
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

            var tween = target.getComponent(TweenScale);

            if (tween)
                tween.destroy();

            tween = target.addComponent(TweenScale);
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
        this.node.setScale(this.from)
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
            var x = this.from.x + (this.to.x - this.from.x) * this.repeaterTimer / this.interval
            var y = this.from.y + (this.to.y - this.from.y) * this.repeaterTimer / this.interval
            this.node.setScale(cc.v2(x, y));
        }

        if (this.timer >= this.time) {
            this.isDone = true;

            if (this.onFinishCallBack) {
                this.onFinishCallBack(this.node);
            }
        }
    },
});