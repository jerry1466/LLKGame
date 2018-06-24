/**
 * GameAffair
 * @auhor clairli
 */
import Databus from 'Databus'
import AffairConstant from 'AffairConstant'
import GameInfo from "GameInfo";

let instance
let databus = new Databus()

export default class GameAffair {
    constructor() {

    }

    static GetInstance() {
        if (instance == null) {
            instance = new GameAffair()
        }
        return instance
    }

    Happen(temp, targetGridY, targetGridX, sourceGridY, sourceGridX, explod) {
        /*
        var array = []
        if(explod){
            array.concat(this.surround(targetGridX, targetGridY))
            array.concat(this.surround(sourceGridX, sourceGridY))
        }
        else{
            array.push(cc.v2(targetGridX, targetGridY))
            array.push(cc.v2(sourceGridX, sourceGridY))
        }
        */
        var affairType = databus.GetNextAffair()
        if(affairType == AffairConstant.AffairEnum().UP_MOVE)
        {
            this.upMove(targetGridY, targetGridX, sourceGridY, sourceGridX)
        }
        else if(affairType == AffairConstant.AffairEnum().DOWN_MOVE)
        {
            this.downMove(targetGridY, targetGridX, sourceGridY, sourceGridX)
        }
        else if(affairType == AffairConstant.AffairEnum().LEFT_MOVE)
        {
            this.leftMove(targetGridY, targetGridX, sourceGridY, sourceGridX)
        }
        else if(affairType == AffairConstant.AffairEnum().RIGHT_MOVE)
        {
            this.rightMove(targetGridY, targetGridX, sourceGridY, sourceGridX)
        }
        else if(affairType == AffairConstant.AffairEnum().FILL)
        {
            this.fill(targetGridY, targetGridX, sourceGridY, sourceGridX)
        }
    }

    surround(x, y){
        var arr = []
        arr.push(cc.v2(x, y), cc.v2(x - 1, y), cc.v2(x + 1, y), cc.v2(x, y - 1), cc.v2(x, y + 1))
        return arr
    }

    upMove(targetGridY, targetGridX, sourceGridY, sourceGridX){
        var temp = GameInfo.GetInstance()
        if(targetGridY == sourceGridY){
            var minX = Math.min(targetGridX, sourceGridX)
            for(var i = minX; i <= databus.gridRow - 2; i++)
            {
                if(!temp.unitList[i + 1][targetGridY].empty)
                {
                    var replaceType = temp.unitList[i + 1][targetGridY].type
                    temp.unitList[i][targetGridY].ChangeType(replaceType)
                    temp.unitList[i + 1][targetGridY].RemoveCellImmediate()
                }
            }
        }
        else{
            for(var i = targetGridX; i <= databus.gridRow - 2; i++)
            {
                if(!temp.unitList[i + 1][targetGridY].empty)
                {
                    var replaceType = temp.unitList[i + 1][targetGridY].type
                    temp.unitList[i][targetGridY].ChangeType(replaceType)
                    temp.unitList[i + 1][targetGridY].RemoveCellImmediate()
                }
            }
            for(var i = sourceGridX; i <= databus.gridRow - 2; i++)
            {
                if(!temp.unitList[i + 1][sourceGridY].empty)
                {
                    var replaceType = temp.unitList[i + 1][sourceGridY].type
                    temp.unitList[i][sourceGridY].ChangeType(replaceType)
                    temp.unitList[i + 1][sourceGridY].RemoveCellImmediate()
                }
            }
        }
    }

    downMove(targetGridY, targetGridX, sourceGridY, sourceGridX){
        var temp = GameInfo.GetInstance()
        if(targetGridY == sourceGridY){
            var maxX = Math.max(targetGridX, sourceGridX)
            for(var i = maxX; i >= 2; i--)
            {
                if(!temp.unitList[i - 1][targetGridY].empty)
                {
                    var replaceType = temp.unitList[i - 1][targetGridY].type
                    temp.unitList[i][targetGridY].ChangeType(replaceType)
                    temp.unitList[i - 1][targetGridY].RemoveCellImmediate()
                }
            }
        }
        else{
            for(var i = targetGridX; i >= 2; i--)
            {
                if(!temp.unitList[i - 1][targetGridY].empty)
                {
                    var replaceType = temp.unitList[i - 1][targetGridY].type
                    temp.unitList[i][targetGridY].ChangeType(replaceType)
                    temp.unitList[i - 1][targetGridY].RemoveCellImmediate()
                }
            }
            for(var i = sourceGridX; i >= 2; i--)
            {
                if(!temp.unitList[i - 1][sourceGridY].empty)
                {
                    var replaceType = temp.unitList[i - 1][sourceGridY].type
                    temp.unitList[i][sourceGridY].ChangeType(replaceType)
                    temp.unitList[i - 1][sourceGridY].RemoveCellImmediate()
                }
            }
        }
    }

    leftMove(targetGridY, targetGridX, sourceGridY, sourceGridX){
        var temp = GameInfo.GetInstance()
        if(targetGridX == sourceGridX){
            var minY = Math.min(targetGridY, sourceGridY)
            for(var i = minY; i <= databus.gridColumn - 2; i++)
            {
                if(!temp.unitList[targetGridX][i + 1].empty)
                {
                    var replaceType = temp.unitList[targetGridX][i + 1].type
                    temp.unitList[targetGridX][i].ChangeType(replaceType)
                    temp.unitList[targetGridX][i + 1].RemoveCellImmediate()
                }
            }
        }
        else{
            for(var i = targetGridY; i <= databus.gridColumn - 2; i++)
            {
                if(!temp.unitList[targetGridX][i + 1].empty)
                {
                    var replaceType = temp.unitList[targetGridX][i + 1].type
                    temp.unitList[targetGridX][i].ChangeType(replaceType)
                    temp.unitList[targetGridX][i + 1].RemoveCellImmediate()
                }
            }
            for(var i = sourceGridY; i <= databus.gridColumn - 2; i++)
            {
                if(!temp.unitList[sourceGridX][i + 1].empty)
                {
                    var replaceType = temp.unitList[sourceGridX][i + 1].type
                    temp.unitList[sourceGridX][i].ChangeType(replaceType)
                    temp.unitList[sourceGridX][i + 1].RemoveCellImmediate()
                }
            }
        }
    }

    rightMove(targetGridY, targetGridX, sourceGridY, sourceGridX){
        var temp = GameInfo.GetInstance()
        if(targetGridX == sourceGridX){
            var maxY = Math.max(targetGridY, sourceGridY)
            for(var i = maxY; i >= 2; i--)
            {
                if(!temp.unitList[targetGridX][i - 1].empty)
                {
                    var replaceType = temp.unitList[targetGridX][i - 1].type
                    temp.unitList[targetGridX][i].ChangeType(replaceType)
                    temp.unitList[targetGridX][i - 1].RemoveCellImmediate()
                }
            }
        }
        else{
            for(var i = targetGridY; i >= 2; i--)
            {
                if(!temp.unitList[targetGridX][i - 1].empty)
                {
                    var replaceType = temp.unitList[targetGridX][i - 1].type
                    temp.unitList[targetGridX][i].ChangeType(replaceType)
                    temp.unitList[targetGridX][i - 1].RemoveCellImmediate()
                }
            }
            for(var i = sourceGridY; i >= 2; i--)
            {
                if(!temp.unitList[sourceGridX][i - 1].empty)
                {
                    var replaceType = temp.unitList[sourceGridX][i - 1].type
                    temp.unitList[sourceGridX][i].ChangeType(replaceType)
                    temp.unitList[sourceGridX][i - 1].RemoveCellImmediate()
                }
            }
        }
    }
    /*
    upMove(temp, points){
        points.sort(function(a, b){
            return b.y - a.y
        })
        for(var i = 0; i < points.length; i++)
        {
            var x = points[i].x
            var y = points[i].y
            for(var j = x; j <= databus.gridRow - 2; j++)
            {
                var replaceType = temp.unitList[j + 1][y].type
                temp.unitList[j][y].ChangeType(replaceType)
            }
        }
    }

    downMove(temp, points){
        points.sort(function(a, b){
            return a.y - b.y
        })
        for(var i = 0; i < points.length; i++)
        {
            var x = points[i].x
            var y = points[i].y
            for(var j = x; j >= 1; j--)
            {
                var replaceType = temp.unitList[j - 1][y].type
                temp.unitList[j][y].ChangeType(replaceType)
            }
        }
    }

    leftMove(temp, points){
        points.sort(function(a, b){
            return b.x - a.x
        })
        for(var i = 0; i < points.length; i++)
        {
            var x = points[i].x
            var y = points[i].y
            for(var j = y; j <= databus.gridColumn - 2; j++)
            {
                var replaceType = temp.unitList[x][j + 1].type
                temp.unitList[x][j].ChangeType(replaceType)
            }
        }
    }

    rightMove(temp, points){
        points.sort(function(a, b){
            return a.x - b.x
        })
        for(var i = 0; i < points.length; i++)
        {
            var x = points[i].x
            var y = points[i].y
            for(var j = y; j >= 1; j--)
            {
                var replaceType = temp.unitList[x][j - 1].type
                temp.unitList[x][j].ChangeType(replaceType)
            }
        }
    }
    */

    fill(targetGridY, targetGridX, sourceGridY, sourceGridX){
        var temp = GameInfo.GetInstance()
        var replaceTypeArr = databus.GetNextFillType(true)
        var replaceType1 = replaceTypeArr[0]
        var replaceType2 = replaceTypeArr[1]
        temp.unitList[targetGridX][targetGridY].ChangeType(replaceType1)
        temp.unitList[sourceGridX][sourceGridY].ChangeType(replaceType2)
    }
}