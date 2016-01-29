ToDo.ToDoListC = Trillo.Controller.extend({
  
  initialize : function(viewSpec) {
    this._super(viewSpec);
  },
 
  handleAction: function(actionName, selectedObj) {
    if (actionName === "newTask") {
      // Creates new form specification as JSON.
      // Builds new view using showView method.
      // New view is shown inside 'trillo-dialog-container'
      // which is a 'div' with css-style that it will be seen
      // as a center aligned pop-up.
      this.showView({
        name: "NewTaskForm",
        impl: "Trillo.FormView",
        postUrl: "newTask",
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
    
    return this._super(actionName, selectedObj);
  },
  
  afterPost: function(result, view) {
    this.showResult(result);
    if (view.name === "NewTaskForm" && result.status === "success") {
      var newTask = result.props.task;
      this.model().newTaskAdded(newTask);
    }
  },

  fieldChanged: function(name, value, valid, view, selectedObj) {
    var self = this;
    if (name === "completed") {
      $.ajax({
        url: "updateCompleted?uid=" + selectedObj.uid + "&completed=" + value,
        type: 'get',
        datatype : "application/json"
      }).done(function(result) {
        self.showResult(result);
      });
    }
  }
});
