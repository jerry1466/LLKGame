/**
 * MathUtil
 * @auhor clairli
 */
let instance
export default class MathUtil {
    constructor() {

    }

    static Shuffle(arr) {
        var result = [],
            random;
        while(arr.length>0){
            random = Math.floor(Math.random() * arr.length);
            result.push(arr[random])
            arr.splice(random, 1)
        }
        return result;
    }
}