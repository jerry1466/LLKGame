/**
 * AffairConstant
 * @auhor clairli
 */
let instance
let affairEnum = {
    UP_MOVE: "up_move",
    DOWN_MOVE: "down_move",
    LEFT_MOVE: "left_move",
    RIGHT_MOVE: "right_move",
    FILL: "fill"
}

export default class AffairConstant {
    constructor() {

    }

    static AffairEnum(){
        return affairEnum
    }
}