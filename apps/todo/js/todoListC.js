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
  },
  
  afterPost: function(result, view) {
    this.showResult(result);
    if (view.name === "NewTaskForm" && result.status === "success") {
      var newTask = result.props.task;
      this.model().newTaskAdded(newTask);
    }
  },

  fieldChanged: function(name, value, valid, view, obj) {
    var self = this;
    if (name === "completed") {
      $.ajax({
        url: "/updateCompleted?uid=" + obj.uid + "&completed=" + value,
        type: 'get',
        datatype : "application/json"
      }).done(function(result) {
        self.showResult(result);
      });
    }
  }
});
