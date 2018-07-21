/**
 * GameInfo
 * @auhor clairli
 */
import Databus from 'Databus'
import PrefabUtil from 'PrefabUtil'
import EventUtil from 'EventUtil'
import TweenAlpha from 'TweenAlpha'
import SceneManager from 'SceneManager'
import ModuleManager from "ModuleManager";
import GameAffair from "GameAffair";
import EffectUtil from "EffectUtil";
import AffairConstant from "AffairConstant";

let instance
let databus = new Databus()
let unitList
export default class GameInfo {
    constructor() {

    }

    static GetInstance() {
        if (instance == null) {
            instance = new GameInfo()
        }
        return instance
    }

    Start(cellContent){
        databus.Reset()
        this.inCheck = false
        this.cellContent = cellContent
        this.unitList = new Array()
        for(var row = 0; row < databus.gridRow; row++)
        {
            this.unitList[row] = new Array()
            for(var column = 0; column < databus.gridColumn; column++)
            {
                this.unitList[row][column] = null
            }
        }
        EventUtil.GetInstance().DispatchEvent("UpdateScore", false)
        this.createAffair()
        this.initBattle()
    }

    GameOver(win){
        databus.win = win
        EventUtil.GetInstance().DispatchEvent("GameOver")
        ModuleManager.GetInstance().ShowModule("GameResultPanel", win)
    }

    CheckLLK(targetUnit){
        if(databus.win != null || this.inCheck == true)
        {
            return
        }
        console.log("CheckLLK 11111111")
        if(databus.selectItemMode == "RemoveItem")
        {
            console.log("CheckLLK 22222222222")
            databus.itemRemoveNum--
            targetUnit.RemoveCell(1)
            targetUnit.empty = true
            EventUtil.GetInstance().DispatchEvent("UnselectItem")
            EventUtil.GetInstance().DispatchEvent("ResetCountDown")
            EventUtil.GetInstance().DispatchEvent("UpdateScore", true)
            if(this.checkGameOver())
            {
                GameInfo.GetInstance().GameOver(true)
            }
            return
        }
        else if(databus.selectItemMode == "ExplodItem")
        {
            console.log("CheckLLK 3333333333")
            databus.itemExplodNum--
            targetUnit.RemoveCell(1)
            targetUnit.empty = true
            var targetGridX = targetUnit.gridX
            var targetGridY = targetUnit.gridY
            this.unitList[targetGridX - 1][targetGridY].RemoveCell(1)
            this.unitList[targetGridX + 1][targetGridY].RemoveCell(1)
            this.unitList[targetGridX][targetGridY - 1].RemoveCell(1)
            this.unitList[targetGridX][targetGridY + 1].RemoveCell(1)
            this.unitList[targetGridX - 1][targetGridY].empty = true
            this.unitList[targetGridX + 1][targetGridY].empty = true
            this.unitList[targetGridX][targetGridY - 1].empty = true
            this.unitList[targetGridX][targetGridY + 1].empty = true
            EffectUtil.PlayEffect("Prefab/Effect/Explod", this.unitList[targetGridX][targetGridY].node.parent, this.unitList[targetGridX][targetGridY].node.getPosition())
            EventUtil.GetInstance().DispatchEvent("UnselectItem")
            EventUtil.GetInstance().DispatchEvent("PlayExplodSound")
            EventUtil.GetInstance().DispatchEvent("ResetCountDown")
            EventUtil.GetInstance().DispatchEvent("UpdateScore", true)
            if(this.checkGameOver())
            {
                GameInfo.GetInstance().GameOver(true)
            }
            return
        }
        if(!targetUnit.empty && targetUnit != this.sourceUnit)
        {
            if(this.sourceUnit == null || targetUnit.type != this.sourceUnit.type)
            {
                if(this.sourceUnit != null && databus.selectItemMode == "ExchangeItem")
                {
                    databus.itemExchangeNum--
                    var tempType = targetUnit.type
                    targetUnit.ChangeType(this.sourceUnit.type)
                    this.sourceUnit.ChangeType(tempType)
                    targetUnit.SetSelect(false)
                    this.sourceUnit.SetSelect(false)
                    this.sourceUnit = null
                    EventUtil.GetInstance().DispatchEvent("UnselectItem")
                    EventUtil.GetInstance().DispatchEvent("ResetCountDown")
                    return
                }
                else
                {
                    targetUnit.SetSelect(true)
                    this.sourceUnit = targetUnit
                    this.unSelectOther(targetUnit)
                }
                EventUtil.GetInstance().DispatchEvent("PlaySelectSound")
            }
            else
            {
                EventUtil.GetInstance().DispatchEvent("PlaySelectSound")
                this.inCheck = true
                var arr = this.tryLLK(this.sourceUnit, targetUnit)
                var line = arr[0]
                var lineCount = arr[1]
                var rate = databus.GetLineCountRate(lineCount)
                if(line.length > 0)
                {
                    EventUtil.GetInstance().DispatchEvent("ResetCountDown")
                    var targetGridX = targetUnit.gridX
                    var targetGridY = targetUnit.gridY
                    var sourceGridX = this.sourceUnit.gridX
                    var sourceGridY = this.sourceUnit.gridY
                    var targetType = targetUnit.type
                    targetUnit.empty = true
                    this.sourceUnit.empty = true
                    targetUnit.SetSelect(false)
                    this.sourceUnit.SetSelect(false)
                    this.sourceUnit = null

                    var temp = this
                    this.drawLine(line, function(){
                        EventUtil.GetInstance().DispatchEvent("PlayWipeOffSound")
                        temp.unitList[targetGridX][targetGridY].RemoveCell(rate)
                        temp.unitList[sourceGridX][sourceGridY].RemoveCell(rate)

                        if(temp.checkGameOver())
                        {
                            GameInfo.GetInstance().GameOver(true)
                        }
                        else
                        {
                            var explod = false
                            if(databus.IsExplodType(targetType))
                            {
                                explod = true
                                EventUtil.GetInstance().DispatchEvent("PlayExplodSound")
                                temp.unitList[targetGridX - 1][targetGridY].RemoveCell(rate)
                                temp.unitList[targetGridX + 1][targetGridY].RemoveCell(rate)
                                temp.unitList[targetGridX][targetGridY - 1].RemoveCell(rate)
                                temp.unitList[targetGridX][targetGridY + 1].RemoveCell(rate)
                                temp.unitList[targetGridX - 1][targetGridY].empty = true
                                temp.unitList[targetGridX + 1][targetGridY].empty = true
                                temp.unitList[targetGridX][targetGridY - 1].empty = true
                                temp.unitList[targetGridX][targetGridY + 1].empty = true
                                temp.unitList[sourceGridX - 1][sourceGridY].RemoveCell(rate)
                                temp.unitList[sourceGridX + 1][sourceGridY].RemoveCell(rate)
                                temp.unitList[sourceGridX][sourceGridY - 1].RemoveCell(rate)
                                temp.unitList[sourceGridX][sourceGridY + 1].RemoveCell(rate)
                                temp.unitList[sourceGridX - 1][sourceGridY].empty = true
                                temp.unitList[sourceGridX + 1][sourceGridY].empty = true
                                temp.unitList[sourceGridX][sourceGridY - 1].empty = true
                                temp.unitList[sourceGridX][sourceGridY + 1].empty = true
                                EffectUtil.PlayEffect("Prefab/Effect/Explod", temp.unitList[targetGridX][targetGridY].node.parent, temp.unitList[targetGridX][targetGridY].node.getPosition())
                                EffectUtil.PlayEffect("Prefab/Effect/Explod", temp.unitList[sourceGridX][sourceGridY].node.parent, temp.unitList[sourceGridX][sourceGridY].node.getPosition())
                                //EffectUtil.PlayEffect("Prefab/Effect/Explod", temp.unitList[targetGridX][targetGridY - 1].node.parent, temp.unitList[targetGridX][targetGridY - 1].node.getPosition())
                                //EffectUtil.PlayEffect("Prefab/Effect/Explod", temp.unitList[targetGridX][targetGridY + 1].node.parent, temp.unitList[targetGridX][targetGridY + 1].node.getPosition())
                                //EffectUtil.PlayEffect("Prefab/Effect/Explod", temp.unitList[sourceGridX - 1][sourceGridY].node.parent, temp.unitList[sourceGridX - 1][sourceGridY].node.getPosition())
                                //EffectUtil.PlayEffect("Prefab/Effect/Explod", temp.unitList[sourceGridX + 1][sourceGridY].node.parent, temp.unitList[sourceGridX - 1][sourceGridY].node.getPosition())
                                //EffectUtil.PlayEffect("Prefab/Effect/Explod", temp.unitList[sourceGridX][sourceGridY - 1].node.parent, temp.unitList[sourceGridX][sourceGridY - 1].node.getPosition())
                                //EffectUtil.PlayEffect("Prefab/Effect/Explod", temp.unitList[sourceGridX][sourceGridY + 1].node.parent, temp.unitList[sourceGridX][sourceGridY + 1].node.getPosition())
                            }
                            EventUtil.GetInstance().DispatchEvent("UpdateScore", true)
                            setTimeout(function(){
                                GameAffair.GetInstance().Happen(temp, targetGridY, targetGridX, sourceGridY, sourceGridX, explod)
                                temp.createAffair()
                                temp.inCheck = false
                            }, 250)
                            setTimeout(function(){
                                temp.fixBattleField()
                            }, 500)
                        }
                    })
                }
                else
                {
                    targetUnit.SetSelect(true)
                    this.sourceUnit = targetUnit
                    this.unSelectOther(targetUnit)
                    this.inCheck = false
                }
            }
        }
    }

    fixBattleField(){
        /*
        for(var i = 1; i < databus.gridRow - 1; i++)
        {
            for(var j = 1; j < databus.gridColumn - 1; j++)
            {
                if(this.unitList[i][j].type > 0)
                {
                    this.unitList[i][j].empty = false
                    this.unitList[i][j].ChangeType(this.unitList[i][j].type)
                }
                if(this.unitList[i][j] != null && !this.unitList[i][j].empty && this.unitList[i][j].type > 0)
                {
                    this.unitList[i][j].node.setScale(cc.v2(1, 1))
                }
            }
        }
        */
    }

    createAffair(){
        var randRange = new Array()
        for(var i = 1; i < databus.gridRow - 1; i++)
        {
            for(var j = 1; j < databus.gridColumn - 1; j++)
            {
                if(this.unitList[i][j] != null && !this.unitList[i][j].empty && this.unitList[i][j].type > 0)
                {
                    randRange.push(this.unitList[i][j].type)
                }
            }
        }
        var affair = databus.CreateAffair(randRange)
        if(affair == AffairConstant.AffairEnum().FILL)
        {
            databus.CreateNextFillType(randRange)
        }
        EventUtil.GetInstance().DispatchEvent("CreateAffair", affair)
    }

    initBattle(){
        this.itemCountArr = databus.itemList.slice()
        this.loadCell(0, this)
        EventUtil.GetInstance().DispatchEvent("UnselectItem")
    }

    loadCell(index, temp){
        var row = Math.floor(index / databus.gridColumn)
        var column = Math.floor(index % databus.gridColumn)
        if(row < databus.gridRow && column < databus.gridColumn)
        {
            PrefabUtil.GetPrefabInstance("Prefab/Cell", function(success, instance){
                if(success)
                {
                    instance.parent = temp.cellContent
                    if(column < databus.gridColumn * 0.5)
                    {
                        instance.x = (column - databus.gridColumn * 0.5) * instance.width + 0.5 * instance.width - Math.ceil(column - databus.gridColumn * 0.5) * databus.interval
                    }
                    else
                    {
                        instance.x = (column - databus.gridColumn * 0.5) * instance.width + 0.5 * instance.width + Math.floor(column - databus.gridColumn * 0.5) * databus.interval
                    }
                    //instance.x = 0 + (column - databus.gridColumn * 0.5) *(instance.width + databus.interval) - instance.width * 0.5
                    instance.y = 0 + temp.cellContent.height * 0.5 - row * (instance.height + databus.interval) + instance.height
                    var llkUnit = instance.getComponent("LLKUnit")
                    if(row == 0 || row == databus.gridRow - 1 || column == 0 || column == databus.gridColumn - 1)
                    {
                        instance.active = false;
                        llkUnit.Init(0, row, column, true)
                    }
                    else
                    {
                        instance.active = true;
                        var randResult = Math.floor(Math.random() * temp.itemCountArr.length)
                        while(temp.itemCountArr[randResult] == 0)
                        {
                            randResult = Math.floor(Math.random() * temp.itemCountArr.length)
                        }
                        temp.itemCountArr[randResult]--;
                        llkUnit.Init(randResult + 1, row, column, false)
                    }
                    temp.unitList[row][column] = llkUnit
                    temp.loadCell(index + 1, temp)
                }
            })
        }
        else
        {
            setTimeout(function(){
                EventUtil.GetInstance().DispatchEvent("ResetCountDown")
            }, 500)
        }
    }

    unSelectOther(targetUnit){
        for(var row = 0; row < databus.gridRow; row++)
        {
            for(var column = 0; column < databus.gridColumn; column++)
            {
                if(this.unitList[row][column] != targetUnit)
                {
                    this.unitList[row][column].SetSelect(false)
                }
            }
        }
    }

    drawLine(path, callback){
        var effectContainer = new cc.Node()
        effectContainer.parent = SceneManager.GetInstance().rootCanvas
        effectContainer.x = 0
        effectContainer.y = 0
        effectContainer.width = SceneManager.GetInstance().rootCanvas.width
        effectContainer.height = SceneManager.GetInstance().rootCanvas.height
        var i = 0
        this.loadLine(i, path, this, effectContainer, callback)
    }

    loadLine(i, path, temp, effectContainer, callback){
        if(i < path.length - 1)
        {
            PrefabUtil.GetPrefabInstance("Prefab/Line", function(success, instance){
                if(success)
                {
                    instance.parent = effectContainer
                    //console.log(path[i + 1].x, path[i + 1].y, path[i].x, path[i].y)
                    if(path[i + 1].x == path[i].x)
                    {
                        if(path[i + 1].y >= path[i].y)
                        {
                            instance.width = Math.abs(temp.unitList[path[i + 1].x][path[i + 1].y].node.x - temp.unitList[path[i].x][path[i].y].node.x)
                            instance.rotation = 0
                            instance.y = temp.unitList[path[i].x][path[i].y].node.y
                            instance.x = 0.5 * (temp.unitList[path[i + 1].x][path[i + 1].y].node.x + temp.unitList[path[i].x][path[i].y].node.x + 0.5 * temp.unitList[path[i].x][path[i].y].node.width - 3)
                        }
                        else
                        {
                            instance.width = Math.abs(temp.unitList[path[i].x][path[i].y].node.x - temp.unitList[path[i + 1].x][path[i + 1].y].node.x)
                            instance.rotation = 180
                            instance.y = temp.unitList[path[i].x][path[i].y].node.y
                            instance.x = 0.5 * (temp.unitList[path[i + 1].x][path[i + 1].y].node.x + temp.unitList[path[i].x][path[i].y].node.x + 0.5 * temp.unitList[path[i].x][path[i].y].node.width - 3)
                        }
                    }
                    else if(path[i + 1].y == path[i].y)
                    {
                        if(path[i + 1].x >= path[i].x)
                        {
                            instance.width = Math.abs(temp.unitList[path[i + 1].x][path[i + 1].y].node.y - temp.unitList[path[i].x][path[i].y].node.y)
                            instance.rotation = 90
                            instance.y = 0.5 * (temp.unitList[path[i + 1].x][path[i + 1].y].node.y + temp.unitList[path[i].x][path[i].y].node.y)
                            instance.x = temp.unitList[path[i].x][path[i].y].node.x + 0.25 * temp.unitList[path[i].x][path[i].y].node.width - 3
                        }
                        else
                        {
                            instance.width = Math.abs(temp.unitList[path[i].x][path[i].y].node.y - temp.unitList[path[i + 1].x][path[i + 1].y].node.y)
                            instance.rotation = 270
                            instance.y = 0.5 * (temp.unitList[path[i + 1].x][path[i + 1].y].node.y + temp.unitList[path[i].x][path[i].y].node.y)
                            instance.x = temp.unitList[path[i].x][path[i].y].node.x + 0.25 * temp.unitList[path[i].x][path[i].y].node.width - 3
                        }
                    }
                    instance.y -= 1.5 * temp.unitList[path[i].x][path[i].y].node.height
                    instance.x -= 0.25 * temp.unitList[path[i].x][path[i].y].node.width
                    //console.log(instance.x, instance.y, instance.width, instance.height)
                    temp.loadLine(i + 1, path, temp, effectContainer, callback)
                }
            })
        }
        else{
            var tweenAlpha = TweenAlpha.begin(effectContainer, 255, 70, 0.5, 2)
            tweenAlpha.onFinishCallBack = function() {
                effectContainer.removeFromParent()
                effectContainer.destroy()
                if (callback != null) {
                    callback()
                }
            }
        }
    }

    checkGameOver(){
        var allEmpty = true
        for(var row = 0; row < databus.gridRow; row++)
        {
            for(var column = 0; column < databus.gridColumn; column++)
            {
                if(this.unitList[row][column].empty == false)
                {
                    allEmpty = false
                    break
                }
            }
        }
        return allEmpty
    }

    tryLLK(unit1, unit2) {
        var rtnArr = this.trySingleLine(unit1, unit2)
        var lineCount = 0
        if(rtnArr.length > 0)
        {
            //console.log("获得单线匹配")
            lineCount = 1
        }
        else
        {
            rtnArr = this.tryDoubleLine(unit1, unit2)
            if(rtnArr.length > 0)
            {
                //console.log("获得双线匹配")
                lineCount = 2
            }
            else
            {
                rtnArr = this.tryTriggerLine(unit1, unit2)
                if(rtnArr.length > 0)
                {
                    //console.log("获得三线匹配")
                    lineCount = 3
                }
            }
        }
        return [rtnArr, lineCount]
    }

    trySingleLine(unit1, unit2) {
        var rtnArr = new Array()
        if(unit1.gridX == unit2.gridX)
        {
            if(unit1.gridY >= unit2.gridY)
            {
                for(var j = unit1.gridY; j >= unit2.gridY; j--)
                {
                    if(this.unitList[unit1.gridX][j].empty == false && this.unitList[unit1.gridX][j] != unit1 && this.unitList[unit1.gridX][j] != unit2)
                    {
                        rtnArr = new Array();
                        break;
                    }
                    else
                    {
                        rtnArr.push(cc.v2(unit1.gridX, j));
                    }
                }
            }
            else
            {
                for(j = unit1.gridY ; j <= unit2.gridY; j++)
                {
                    if(this.unitList[unit1.gridX][j].empty == false && this.unitList[unit1.gridX][j] != unit1 && this.unitList[unit1.gridX][j] != unit2)
                    {
                        rtnArr = new Array();
                        break;
                    }
                    else
                    {
                        rtnArr.push(cc.v2(unit1.gridX, j));
                    }
                }
            }
        }
        else if(unit1.gridY == unit2.gridY)
        {
            if(unit1.gridX >= unit2.gridX)
            {
                for(var i = unit1.gridX; i >= unit2.gridX; i--)
                {
                    if(this.unitList[i][unit1.gridY].empty == false &&  this.unitList[i][unit1.gridY] != unit1 && this.unitList[i][unit1.gridY] != unit2)
                    {
                        rtnArr = new Array();
                        break;
                    }
                    else
                    {
                        rtnArr.push(cc.v2(i, unit1.gridY));
                    }
                }
            }
            else
            {
                for(i = unit1.gridX; i <= unit2.gridX; i++)
                {
                    if(this.unitList[i][unit1.gridY].empty == false &&  this.unitList[i][unit1.gridY] != unit1 && this.unitList[i][unit1.gridY] != unit2)
                    {
                        rtnArr = new Array();
                        break;
                    }
                    else
                    {
                        rtnArr.push(cc.v2(i, unit1.gridY));
                    }
                }
            }
        }
        return rtnArr;
    }

    tryDoubleLine(unit1, unit2) {
        var rtnArr = new Array();
        var tempArr = new Array();
        var unit = this.unitList[unit1.gridX][unit2.gridY];
        if(unit.empty == true)
        {
            tempArr = this.trySingleLine(unit1, unit);
            if(tempArr.length > 0)
            {
                rtnArr = tempArr;
                tempArr = this.trySingleLine(unit, unit2);
                if(tempArr.length > 0)
                {
                    tempArr.shift();
                    rtnArr = rtnArr.concat(tempArr);
                    return rtnArr;
                }
            }
        }

        unit = this.unitList[unit2.gridX][unit1.gridY];
        if(unit.empty == true)
        {
            tempArr = this.trySingleLine(unit1, unit);
            if(tempArr.length > 0)
            {
                rtnArr = tempArr;
                tempArr = this.trySingleLine(unit, unit2);
                if(tempArr.length > 0)
                {
                    tempArr.shift();
                    rtnArr = rtnArr.concat(tempArr);
                    return rtnArr;
                }
            }
        }
        rtnArr= new Array();
        return rtnArr;
    }

    tryTriggerLine(unit1, unit2) {
        var rtnArr = new Array();
        var tempArr = new Array();
        var unit
        for(var i = unit1.gridX - 1; i >= 0; i--)
        {
            unit = this.unitList[i][unit1.gridY];
            if(unit.empty == true)
            {
                tempArr = this.trySingleLine(unit1, unit);
                if(tempArr.length > 0)
                {
                    rtnArr = tempArr;
                    tempArr = this.tryDoubleLine(unit, unit2);
                    if(tempArr.length > 0)
                    {
                        tempArr.shift();
                        rtnArr = rtnArr.concat(tempArr);
                        return rtnArr;
                    }
                }
            }
        }

        for(i = unit1.gridX + 1; i < databus.gridRow; i++)
        {
            unit = this.unitList[i][unit1.gridY];
            if(unit.empty == true)
            {
                tempArr = this.trySingleLine(unit1, unit);
                if(tempArr.length > 0)
                {
                    rtnArr = tempArr;
                    tempArr = this.tryDoubleLine(unit, unit2);
                    if(tempArr.length > 0)
                    {
                        tempArr.shift();
                        rtnArr = rtnArr.concat(tempArr);
                        return rtnArr;
                    }
                }
            }
        }

        for(var j = unit1.gridY - 1; j >= 0; j--)
        {
            unit = this.unitList[unit1.gridX][j];
            if(unit.empty == true)
            {
                tempArr = this.trySingleLine(unit1, unit);
                if(tempArr.length > 0)
                {
                    rtnArr = tempArr;
                    tempArr = this.tryDoubleLine(unit, unit2);
                    if(tempArr.length > 0)
                    {
                        tempArr.shift();
                        rtnArr = rtnArr.concat(tempArr);
                        return rtnArr;
                    }
                }
            }
        }

        for(j = unit1.gridY + 1; j < databus.gridColumn; j++)
        {
            unit = this.unitList[unit1.gridX][j];
            if(unit.empty == true)
            {
                tempArr = this.trySingleLine(unit1, unit);
                if(tempArr.length > 0)
                {
                    rtnArr = tempArr;
                    tempArr = this.tryDoubleLine(unit, unit2);
                    if(tempArr.length > 0)
                    {
                        tempArr.shift();
                        rtnArr = rtnArr.concat(tempArr);
                        return rtnArr;
                    }
                }
            }
        }

        rtnArr = [];
        return rtnArr;
    }

    Reborn(){
        databus.win = null
        ModuleManager.GetInstance().HideModule("GameResultPanel")
        EventUtil.GetInstance().DispatchEvent("Reborn")
    }

    Replay(){
        for(var row = 0; row < databus.gridRow; row++)
        {
            for(var column = 0; column < databus.gridColumn; column++)
            {
                if( this.unitList[row][column] != null &&  this.unitList[row][column].node != null)
                {
                    this.unitList[row][column].node.removeFromParent()
                    this.unitList[row][column].node.destroy()
                }
            }
        }
        this.unitList = null
        databus.win = null
        EventUtil.GetInstance().DispatchEvent("GameRestart")
    }
}