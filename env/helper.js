'user strict';
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);


  function initializeDB() {
    if(!db.getState().info){
         db.defaults({ info: [], counter: 0 })
        .write();
    }
  }

function getUserInfo(data){
    let info={};
    info.ip = data.ip.ip === '::1' ? 'localhost' : data.ip.ip;
    info.browser = data.headers.browser;
    info.browser_version = data.headers.version;
    info.platform = data.headers.platform;
    info.os = data.headers.os;
    info.isBot = data.headers.isBot;
    info.all_info = data.headers;
    info.ua = data.headers.source;
    return info;
}

 function saveToDb(data) {
    let result = db.get('info')
    .push(data)
    .write();
    return result ? true : false;

}

/*
if onlyVale === true
then it will return count value
*/
function visitCounterHandler(onlyValue=false) {
    let count = db.getState().counter;
    if(onlyValue){
        return count;
    }
    db.set('counter', ++count)
    .write();
}

module.exports={
    getUserInfo,
    saveToDb,
    initializeDB,
    visitCounterHandler,
    saveToDb
};