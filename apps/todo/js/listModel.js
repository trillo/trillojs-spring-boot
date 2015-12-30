ToDo.ListModel = Trillo.Model.extend({
  initialize : function(modelSpec, view) {
    this._super(modelSpec, view);
  },
 
  loadData: function() {
    var deferred = $.Deferred();
    $.ajax({
      url: "/taskList",
      type: 'get',
      datatype : "application/json"
    }).done($.proxy(this.dataLoaded, this, deferred));
    return deferred.promise();
  },
  
  dataLoaded: function(deferred, data) {
    this.data = data;
    deferred.resolve(this);
  },
  
  newTaskAdded: function(newTask) {
    this.data.push(newTask);
    this.triggerAdded(newTask);
  }
});
