class Practice{
  constructor(id, name, idea, liked, comments){
    this.id = id;
    this.name = name;
    this.idea = idea;
    this.liked = liked || false;
    this.comments = comments || "";
  }

  deleteObject(id){
    localStorage.removeItem(id);
    if(localStorage.length === 1){
      localStorage.clear();
    }
  }
  saveToStorage(){
  var objectData = this;
  savedObjects.push(objectData);
  localStorage.setItem(this.id, JSON.stringify(objectData));
  }

}
