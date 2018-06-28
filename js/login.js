function updateUser(){
    var uid = localStorage.getItem("uid");
    console.log("updating user " + uid);
    var area = document.getElementById('headtitle');
    console.log(area);
    area.innerHTML = "ORGANIZE YOURSELF " + uid.toUpperCase();
};

var input = document.getElementById('passwd');
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    document.getElementById('loginPressed').click();
  }
});

function login(){
    var password = "openup"
    var input = document.getElementById('passwd').value;
    if(password === input){
        console.log("correct password!");
        var uid = document.getElementById("userid").value;
        localStorage.setItem("uid", uid);
        window.location = "main.html";
    } else {
        alert("wrong password");
    }
}

function logout(){
    window.location.href = "index.html";
}