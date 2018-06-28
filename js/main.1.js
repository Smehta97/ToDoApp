var input = document.getElementById('item');
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    document.getElementById('add').click();
  }
});

document.getElementById('add').addEventListener('click', function() {
  var value = document.getElementById('item').value;
  if(value){
    var ul = document.getElementById('todo');
    var li = document.createElement('li');
    var p = document.createElement('p');
    p.innerHTML = value;
    li.appendChild(p);
    var clone = document.getElementById('btns').cloneNode(true);
    li.appendChild(clone);
    addData(value, function(db_id){
      li.setAttribute("id", db_id);
    });

    ul.appendChild(li);
    document.getElementById('item').value = '';
  }
});

function addFromDB(id, value, status){
  var ul_todo = document.getElementById('todo');
  var ul_done = document.getElementById('completed');

  var li = document.createElement('li');
  var p = document.createElement('p');
  p.innerHTML = value;
  li.appendChild(p);
  li.setAttribute('id', id);
  var clone = document.getElementById('btns').cloneNode(true);
  li.appendChild(clone);

  if(!status){
    ul_todo.appendChild(li);
  } else {
    ul_done.appendChild(li);
  }
}

function deleteNode(param, dbFlag){
  console.log("Deleting...");
  param.closest('li').remove();
  var value = param.closest('li').getAttribute('id');
  if(dbFlag){
    db.transaction(["todoitems"], "readwrite").objectStore("todoitems").delete(parseInt(value));
  }
};

function completeItem(param){
  //remove from todo list
  var clone = param.closest('li').cloneNode(true);
  //add to done list
  var ul = document.getElementById('completed');
  //add back to todo list
  var ul_todo = document.getElementById('todo');

  if(param.closest('ul').getAttribute('id') === 'todo'){
    ul.appendChild(clone);
    //update in db
    var value = param.closest('li').getAttribute('id');
    var objectStore = db.transaction(["todoitems"], "readwrite").objectStore("todoitems");
    var objectStoreStatusReq = objectStore.get(parseInt(value));
    objectStoreStatusReq.onsuccess = function(){
      var data = objectStoreStatusReq.result;
      data.completed = true;
      objectStore.put(data);
      deleteNode(param, false);
    }
  } else {
    ul_todo.appendChild(clone);
    //update in db
    var value = param.closest('li').getAttribute('id');
    var objectStore = db.transaction(["todoitems"], "readwrite").objectStore("todoitems");
    var objectStoreStatusReq = objectStore.get(parseInt(value));
    objectStoreStatusReq.onsuccess = function(){
      var data = objectStoreStatusReq.result;
      data.completed = false;
      objectStore.put(data);
      deleteNode(param, false);
    }
  }

  
  
}

function deleteAllEntries(){
  emptyDB();
  location.reload();
}
