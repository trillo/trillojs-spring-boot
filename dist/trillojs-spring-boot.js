/*!
 * TrilloJS v1.0.0 (https://github.com/trillo/trillojs-spring-boot#readme)
 * Copyright 2016 Collager Inc.
 * Licensed under the MIT license
 */
/**
 * Application initialization.
 * For now it defines the application name space.
 */

ToDo = {};





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

ToDo.ToDoListC = Trillo.Controller.extend({
  
  initialize : function(viewSpec) {
    this._super(viewSpec);
  },
 
  handleAction: function(actionName, obj, infoItem) {
    if (actionName === "newTask") {
      // Creates new form specification as JSON.
      // Builds new view using showView method.
      // New view is shown inside 'trillo-dialog-container'
      // which is a 'div' with css-style that it will be seen
      // as a center aligned pop-up.
      this.showView({
        name: "NewTaskForm",
        impl: "Trillo.FormView",
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
