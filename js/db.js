//prefixes for indexeddb
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || 
window.msIndexedDB;
 
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || 
window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || 
window.webkitIDBKeyRange || window.msIDBKeyRange
 
if (!window.indexedDB) {
   window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

//open (create) db
var open = window.indexedDB.open("todolist", 14);

//create schema
open.onupgradeneeded = function(event){
    var db = open.result;
    console.log("upgradeneeded called");
    db.onerror = function(event){
        console.log("db error");
    }
    var objectStore = db.createObjectStore("todoitems", {keyPath: "id", autoIncrement: true});
    //indexes
    objectStore.createIndex("data", "data", {unique:false});
    objectStore.createIndex("completed", "completed", {unique:false});
};

open.onsuccess = function(event){
    db = open.result;
    loadDB();
    console.log("success" + db);
};

open.onerror = function(event){
    console.log("error: ");
};

function addData(input_data, callback){
    var transaction = db.transaction(["todoitems"], "readwrite");
    var objectStore = transaction.objectStore("todoitems");
    var newItem = [{
        data: input_data, completed: false
    }];
    var objectStoreReq = objectStore.add(newItem[0]);
    objectStoreReq.onsuccess = function(event){
        console.log(input_data + " has been added to db.");
        callback(objectStoreReq.result);
    }
    
}

function readData(){
    var objectStore = db.transaction("todoitems").objectStore("todoitems");
    objectStore.openCursor().onsuccess = function(event){
        var cursor = event.target.result;
        if(cursor){
            console.log("id: "+cursor.key + " item "+cursor.value.data + " completed?: " + cursor.value.completed);
            cursor.continue();
        } else {
            console.log("No more entries");
        }
    };
}

function loadDB(){
    var objectStore = db.transaction("todoitems").objectStore("todoitems");
    objectStore.openCursor().onsuccess = function(event){
        var cursor = event.target.result;
        if(cursor){
            addFromDB(cursor.key, cursor.value.data, cursor.value.completed);
            //console.log("id: "+cursor.key + " item "+cursor.value.data + " completed?: " + cursor.value.completed);
            cursor.continue();
        } else {
            console.log("No more entries");
        }
    };
}

function emptyDB(){
    var objectStoreClr = db.transaction(["todoitems"], "readwrite").objectStore("todoitems").clear();
    objectStoreClr.onsuccess = function(event){
        console.log("clearing db");
        readData();
    }
    var del = window.indexedDB.deleteDatabase("todolist");
    del.onsuccess = function(event){
        console.log("db deleted");
    }
}

