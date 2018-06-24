/**
 * Databus
 * @auhor clairli
 */
import MathUtil from "MathUtil"
import AffairConstant from "AffairConstant";

let instance
export default class Databus {
    constructor() {
        if (instance)
            return instance

        instance = this

        this.productName = "水果连消乐"
        this.cfgUrl = "https://2zhuji.cn/index.php?g=Wap&m=WxaGame&a=get_config&token=wkgq1527239965"
        this.soundEnable = true
        this.screenWidth = 375
        this.screenHeight = 812
        this.screenWidthRatio = 1
        this.screenHeightRatio = 1
        this.countDownTime = 15
        this.gridColumn = 9
        this.gridRow = 12
        this.interval = 2
        this.itemList = [6, 2, 4, 4, 4, 2, 4, 4, 4, 6, 4, 4, 4, 4, 4, 2, 4, 4]
        this.itemScore = [10, 30, 15, 15, 15, 30, 15, 15, 15, 10, 15, 15, 15, 15, 15, 30, 15, 15]
        this.itemExchangeNum = 3
        this.itemRemoveNum = 3
        this.itemExplodNum = 1
        this.selectItemMode = ""
        this.cacheRandomTypePool = []
    }

    GetInstance() {
        if (instance == null) {
            instance = new Databus()
        }
        return instance
    }

    GetNextFillType(willShift) {
        if(willShift)
        {
            return [this.cacheRandomTypePool.shift(), this.cacheRandomTypePool.shift()]
        }
        else
        {
            return [this.cacheRandomTypePool[0], this.cacheRandomTypePool[1]]
        }
    }

    CreateNextFillType(randRange){
        if(this.cacheRandomTypePool.length == 0)
        {
            var firstRandomType = this.getRandomType(randRange)
            this.cacheRandomTypePool.push(firstRandomType)
            var secondRandomType = this.getRandomType(randRange)
            while(secondRandomType == firstRandomType)
            {
                secondRandomType = this.getRandomType(randRange)
            }
            this.cacheRandomTypePool.push(secondRandomType)
            firstRandomType = this.getRandomType(randRange)
            this.cacheRandomTypePool.push(firstRandomType)
            secondRandomType = this.getRandomType(randRange)
            while(secondRandomType == firstRandomType)
            {
                secondRandomType = this.getRandomType(randRange)
            }
            this.cacheRandomTypePool.push(secondRandomType)
            this.cacheRandomTypePool = MathUtil.Shuffle(this.cacheRandomTypePool)
        }
        else if(this.cacheRandomTypePool.length == 2)
        {
            var firstRandomType = this.cacheRandomTypePool[1]
            var secondRandomType = this.getRandomType(randRange)
            while(secondRandomType == firstRandomType)
            {
                secondRandomType = this.getRandomType(randRange)
            }
            this.cacheRandomTypePool.push(secondRandomType)
            firstRandomType = secondRandomType
            secondRandomType = this.getRandomType(randRange)
            while(secondRandomType == firstRandomType)
            {
                secondRandomType = this.getRandomType(randRange)
            }
            this.cacheRandomTypePool.push(secondRandomType)
            this.cacheRandomTypePool = MathUtil.Shuffle(this.cacheRandomTypePool)
        }
    }

    CreateAffair(randRange){
        if(randRange.length == 0 || randRange.length >= 0.8 * (this.gridRow - 2) * (this.gridColumn - 2))
        {
            var randomAffairType = Math.random();
            if(randomAffairType <= 0.25){
                this.nextAffair = AffairConstant.AffairEnum().UP_MOVE
            }
            else if(randomAffairType <= 0.5){
                this.nextAffair = AffairConstant.AffairEnum().DOWN_MOVE
            }
            else if(randomAffairType <= 0.75){
                this.nextAffair = AffairConstant.AffairEnum().LEFT_MOVE
            }
            else {
                this.nextAffair = AffairConstant.AffairEnum().RIGHT_MOVE
            }
        }
        else if(randRange.length <= 0.33 * (this.gridRow - 2) * (this.gridColumn - 2))
        {
            var randomAffairType = Math.random();
            if(randomAffairType <= 0.05){
                this.nextAffair = AffairConstant.AffairEnum().UP_MOVE
            }
            else if(randomAffairType <= 0.1){
                this.nextAffair = AffairConstant.AffairEnum().DOWN_MOVE
            }
            else if(randomAffairType <= 0.15){
                this.nextAffair = AffairConstant.AffairEnum().LEFT_MOVE
            }
            else if(randomAffairType <= 0.2){
                this.nextAffair = AffairConstant.AffairEnum().RIGHT_MOVE
            }
            else{
                this.nextAffair = AffairConstant.AffairEnum().FILL
            }
        }
        else
        {
            var randomAffairType = Math.random();
            if(randomAffairType <= 0.15){
                this.nextAffair = AffairConstant.AffairEnum().UP_MOVE
            }
            else if(randomAffairType <= 0.3){
                this.nextAffair = AffairConstant.AffairEnum().DOWN_MOVE
            }
            else if(randomAffairType <= 0.45){
                this.nextAffair = AffairConstant.AffairEnum().LEFT_MOVE
            }
            else if(randomAffairType <= 0.6){
                this.nextAffair = AffairConstant.AffairEnum().RIGHT_MOVE
            }
            else{
                this.nextAffair = AffairConstant.AffairEnum().FILL
            }
        }
        return this.nextAffair
    }

    GetNextAffair(){
        return this.nextAffair
    }

    IsExplodType(type){
        return type == 18
    }

    GetLineCountRate(lineCount){
        if(lineCount == 1){
            return 2
        }
        else if(lineCount == 2){
            return 1.5
        }
        else if(lineCount = 3){
            return 1
        }
        return 1
    }

    Reset(){
        this.score = 0
        this.itemExchangeNum = 3
        this.itemRemoveNum = 3
        this.itemExplodNum = 1
        this.selectItemMode = ""
    }

    getRandomType(randRange){
        return randRange[Math.floor(Math.random() * randRange.length)]
    }
}