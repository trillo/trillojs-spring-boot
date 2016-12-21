ToDo.ListModel = Trillo.Model.extend({
  initialize : function(modelSpec, view) {
    this._super(modelSpec, view);
  },
 
  newTaskAdded: function(newTask) {
    this.data.push(newTask);
    this.triggerAdded(newTask);
  }
});
