let instance

export default class EventUtil {
    constructor() {
        this.eventMap = {}
    }

    static GetInstance(){
        if(instance == null)
        {
            instance = new EventUtil()
        }
        return instance
    }

    AddEventListener(eventName, handler){
        if(this.eventMap[eventName] == null)
        {
            this.eventMap[eventName] = []
        }
        this.eventMap[eventName].push(handler)
    }

    RemoveEventListener(eventName, handler){
        if(this.eventMap[eventName] != null)
        {
            for(var index in this.eventMap[eventName]){
                if(this.eventMap[eventName][index] == handler){
                    this.eventMap[eventName].splice(index, 1)
                }
            }
        }
    }

    RemoveEventKey(eventName){
        if(this.eventMap[eventName] != null)
        {
            this.eventMap[eventName] = null
        }
    }

    DispatchEvent(eventName, eventParam){
        if(this.eventMap[eventName] != null){
            for(var index in this.eventMap[eventName]){
                this.eventMap[eventName][index](eventParam)
            }
        }
    }
}