/**
 * ArrayUtil
 * @auhor clairli
 */
export default class ArrayUtil {
    constructor() {

    }

    static Remove(arr, element) {
        if(arr != null) {
            var index = arr.indexOf(element)
            if (index >= 0) {
                this.arr.splice(index, 1)
            }
        }

        return arr
    }

    static Each(arr, handler) {
        if(arr != null && handler != null)
        {
            for(var i = 0; i < arr.length; i++)
            {
                handler(arr[i])
            }
        }
    }

    static GetRandomValue(arr) {
        console.log("arr=======", arr)
        return arr[Math.floor(Math.random() * arr.length)]
    }

    static GameRandomValueForJson(){
        return arr[Math.floor(Math.random() * arr.size())]
    }
}