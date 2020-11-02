class Comment{
  constructor(id, ideaId, comment){
    this.id = id;
    this.ideaId = ideaId;
    this.comment = comment;
    this.type = "comment";
  }
  deleteComment(id){
    localStorage.removeItem(id);
    }
  saveCommentToStorage(){
    var objectData = this;
    localStorage.setItem(this.id, JSON.stringify(objectData));
  }
}
