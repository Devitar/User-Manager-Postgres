function editView(id){
    window.location.href = '/users/editView?usrid='+id;
};

function deleteView(id){
    window.location.href = '/users/deleteView?usrid='+id;
};

function sortName(by){
    window.location.href = `/users/sort${by}`;
};

function searchName(){
    let name = document.getElementById('Name').value;
    window.location.href = `/users/?Name=${name}`;
};

function newUser(){
    window.location.href = `/`;
}

function goToUsers(){
    window.location.href = `/users/`;
}