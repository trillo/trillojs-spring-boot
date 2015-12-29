ToDo.ToDoListC = Trillo.Controller.extend({
  
  initialize : function(viewSpec) {
    this._super(viewSpec);
  },
 
  handleAction: function(actionName, obj, infoItem) {
    if (actionName === "newTask") {
      this.showView({
        name: "NewTaskForm",
        postUrl: "/newTask",
        type: Trillo.ViewType.Form,
        container: 'trillo-dialog-container',
        modelSpec : {
          data : {
            priority : "P1"
          }
        }
      });
      return true;
    }
    
    return this._super(actionName, obj, infoItem);
  }

});
