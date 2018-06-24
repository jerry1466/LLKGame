export default class CD {
  constructor(duration, entercd){
    this.duration = duration
    this.entercd = entercd
    this.startTime = 0
  }

  Tick(){
    var now = Date.now()
    if(this.entercd == true)
    {
      if(now - this.startTime > this.duration)
      {
        this.startTime = now
        return true
      }
    }
    else
    {
      if (this.startTime == 0)
      {
        this.startTime = now
        return true
      }
      else if (now - this.startTime > this.duration)
      {
        this.startTime = now
        return true
      }
    }
    return false
  }
}