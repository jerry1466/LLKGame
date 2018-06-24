var TweenPosition = cc.Class({
    extends: cc.Component,

    properties: {
        time: 1,                //Tween完成所花費的時間
        timer: 0,               //計時器
        from: new cc.Vec2(0, 0),//Tween開始的值
        to: new cc.Vec2(0, 0),  //Tween結束的值
        isDone: false,
        onFinishCallBack: {     //Tween結束之後的回調
            default: null,
            type: Function
        }

    },
    statics: {
        //將target在time秒之內從from移動到to
        begin: function (target, from, to, time) {

            var tween = target.getComponent(TweenPosition);

            if (tween)
                tween.destroy();

            tween = target.addComponent(TweenPosition);
            tween.from = from;
            tween.to = to;
            tween.time = time;
            return tween;
        }

    },
    // use this for initialization
    onLoad: function () {

        this.node.setPosition(this.from.x, this.from.y);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

        if (this.isDone) {
            this.destroy();
            return;
        }

        this.timer += dt;
        this.node.setPosition(
            this.from.x + (this.to.x - this.from.x) * (this.timer / this.time),
            this.from.y + (this.to.y - this.from.y) * (this.timer / this.time)
        );

        if (this.timer >= this.time) {
            this.isDone = true;

            if (this.onFinishCallBack) {
                this.onFinishCallBack();
            }
        }
    },
});