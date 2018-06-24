export default class PrefabUtil{
    static GetPrefabInstance(prefabUrl, callback){
        cc.loader.loadRes(prefabUrl, function(errMsg, loadRes){
            if(errMsg) {
                cc.log('载入预制资源' + prefabUrl + '失败，原因是' + errMsg);
                if(callback){
                    callback(false, null)
                }
            }

            if(!(loadRes instanceof cc.Prefab)){
                cc.log('载入的' + prefabUrl + '不是预制资源');
                if(callback){
                    callback(false, null)
                }
            }

            var instance = cc.instantiate(loadRes)
            if(callback){
                callback(true, instance)
            }
        })
    }
}