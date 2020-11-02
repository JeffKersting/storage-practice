var savedObjects = [];


var createClass = document.querySelector(".create-class");
var showFave = document.querySelector(".show-favorite");
var searchIdeas = document.querySelector(".search");

var className = document.querySelector(".class-name");
var classIdea = document.querySelector(".class-body");
var local = document.querySelector(".display-local");
var savedArray = document.querySelector(".display-saved");
var stringed = document.querySelector(".display-stringed");
var unstringed = document.querySelector(".display-unstringed");
var grid = document.querySelector(".grid");


createClass.addEventListener("click", instantiateClass);
showFave.addEventListener("click", showFavorited);
grid.addEventListener("click", gridEvent);
grid.addEventListener("keyup", showCommentInput);
searchIdeas.addEventListener("keyup", showSearch);


document.onload = onLoad();

function instantiateClass(){
  var object = new Practice(Date.now(), className.value, classIdea.value);
  object.saveToStorage();
  populateSaved(savedObjects.sort(compareId));//sorting by the lowest
}
function instantiateComment(target){
  var object = new Comment(Date.now(), target.parentNode.id, target.value);
  object.saveCommentToStorage();
  populateSaved(savedObjects.sort(compareId));
}

function populateSaved(arr){
  grid.innerHTML = "";
  for(var i = 0; i < arr.length; i++){
    if(arr[i].liked){
        var color = "liked";
    } else {
        var color = "not-liked";
    }
    grid.innerHTML += `
      <div class="grid-item ${color}" id=${arr[i].id}>
        <p class="title">${arr[i].name}</p>
        <p class="body">${arr[i].idea}</p>
        <button class="delete-button">Delete</button>
        <button class="like-idea">Like</button>
        <button class="comment">Comment</button>
        <input class="comment-field hidden" placeholder="Comment"></input>
        <button class="submit-comment hidden">Add comment</button>
        <p class="comment-display">${arr[i].comments}</p>
      </div>
    `
  }
}


function compareId(a,b){//this checks each object ID returns lowest
  aId = parseInt(a.id);
  bId = parseInt(b.id);
  if(aId > bId) return 1;
  if(aId < bId) return -1;
  return 0;
}


function showSearch(){
  if(searchIdeas.value.length > 0){
    var searchedObjects = savedObjects.filter((object) =>
    object.name.includes(searchIdeas.value) || object.idea.includes(searchIdeas.value));
    populateSaved(searchedObjects);
  }  else {
    populateSaved(savedObjects);
  }
}

function gridEvent(event){
  event.preventDefault();
  target = event.target;
  if (target.classList.contains("comment")){
    target.nextElementSibling.classList.remove("hidden");
    return;
  } else if(target.classList.contains("comment-field")){
    return;
  } else if(target.classList.contains("submit-comment")){
    comment = target.previousElementSibling.value;
    instantiateComment(target);

  } else {
    grid.innerHTML = "";
    if(target.classList.contains("delete-button")){
      deleteClick(target)
    } else if (target.classList.contains("like-idea")){
      likeClick(target)
    }
    populateSaved(savedObjects.sort(compareId));
  }
}

function showCommentInput(event){
  target = event.target;
  if(target.value.length > 0){
    target.nextElementSibling.classList.remove("hidden");
  } else {
    target.nextElementSibling.classList.add("hidden");
  }
}

function deleteClick(target){
  targetObjectId = parseInt(target.parentNode.id);
  for(var i = 0; i < savedObjects.length; i++){
    if(savedObjects.length === 1){//splice will not work on last element
      localStorage.clear();
      savedObjects.pop();
    } else if(savedObjects[i].id === targetObjectId){
      savedObjects[i].deleteObject(targetObjectId);//LOCAL STORAGE ONLY
      savedObjects.splice(i,1);//TEMPORARY STORAGE
    }
  }
}

function likeClick(target){
  targetObjectId = parseInt(target.parentNode.id);
  for(var i = 0; i < savedObjects.length; i++){
    if(savedObjects[i].id === targetObjectId){
      if(savedObjects[i].liked === false){
        savedObjects[i].liked = true;
        var obj = JSON.parse(localStorage.getItem(targetObjectId));
        obj.liked = true;
        localStorage.setItem(targetObjectId, JSON.stringify(obj));
      } else {
        savedObjects[i].liked = false;
        var obj = JSON.parse(localStorage.getItem(targetObjectId));
        obj.liked = false;
        localStorage.setItem(targetObjectId, JSON.stringify(obj));
      }
    }
  }
}

function addComment(target){
  targetObjectId = parseInt(target.parentNode.id);
  for(var i = 0; i < savedObjects.length; i++){
    if(savedObjects[i].id === targetObjectId){
      var obj = JSON.parse(localStorage.getItem(targetObjectId));
      obj.liked = true;
      localStorage.setItem(targetObjectId, JSON.stringify(obj));
    }
  }
}

function showFavorited(){
  if(showFave.classList.contains("show-all")){
    populateSaved(savedObjects.sort(compareId));
    showFave.innerText = "Show Favorite";
    showFave.classList.remove("show-all");
  } else {
    var favoriteObjects = savedObjects.filter(x => x.liked);
    populateSaved(favoriteObjects.sort(compareId));
    showFave.innerText = "Show All";
    showFave.classList.add("show-all");
  }
}


function onLoad(){
  for(var i = 0; i < localStorage.length; i++){
    object = localStorage.key(i);//this will grab the key value of the index
    saved = JSON.parse(localStorage.getItem(object));
    var id = saved.id;
    var name = saved.name;
    var idea = saved.idea;
    var liked = saved.liked;
    savedObjects.push(new Practice(id, name, idea, liked));
    populateSaved(savedObjects.sort(compareId));
  }
};
