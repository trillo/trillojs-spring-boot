/*!
 * TrilloJS v0.5.0 (https://github.com/trillo/trillojs#readme)
 * Copyright 2016 Collager Inc.
 * Licensed under the MIT license
 */
Trillo.EntityModel = Trillo.Model.extend({
  initialize : function(modelSpec, view) {
    this._super(modelSpec, view);
    this.table = {};
  },
  
  getObserverOptions: function() {
    if (this.data && this.data.uid) {
      return {cls: Trillo.uidToClass(this.data.uid)};
    }
      return null;
  },
  
  loadData: function() {
    var deferred = $.Deferred();
    var d1;
    if (this.data) {
      /// data already available; may happen if a model is created from the data from the other model.
      deferred.resolve(this);
      return deferred.promise();
    }
    var uid = this.modelSpec.params.uid;
    
    if (!uid) {
      Trillo.log.warning("Entity model does not specify object uid which is required to retrieve uid, returning empty data");
      this.data = {};
      deferred.resolve(this);
      return deferred.promise();
    }
  
    if (this.modelSpec.detailClass) {
      d1 = $.Deferred();
      $.ajax({
        url: "/service/entity?uid=" + uid,
        type: 'get'
      }).done(function(data) {
        d1.resolve(data);
      });
      var d2 = $.Deferred();
      $.ajax({
        url: "/service/entityDetail?uid=" + this.modelSpec.detailClass + "." + Trillo.uidToId(uid),
        type: 'get'
      }).done(function(data2) {
        d2.resolve(data2);
      });
      $.when(
        d1.promise(), d2.promise()
      ).done($.proxy(this.dataLoaded, this, deferred));
    } else {
      d1 = $.Deferred();
      $.ajax({
        url: "/service/entity?uid=" + uid,
        type: 'get'
      }).done(function(data) {
        d1.resolve(data);
      });
      d1.promise().done($.proxy(this.dataLoaded, this, deferred));
    }
    
    return deferred.promise();
  },
  dataLoaded: function(deferred, data, data2) {
    
    this.createObserver();
    
    this.table[data.uid] = data;
    
    this.data = $.extend(data, data2);
    
    this.controller().modelLoaded(this);
    deferred.resolve(this);
  }
});

Trillo.CollectionModel = Trillo.Model.extend({
  initialize : function(modelSpec, view) {
    this._super(modelSpec, view);
    this.setPageRquest(modelSpec);
  },
  setPageRquest: function(modelSpec) {
    this.table = {};
    var req = {};
    req.cls = this.modelSpec.cls;
    req.filter = modelSpec.filter || "";
    req.searchFilter = modelSpec.searchFilter; // null is OK
    req.searchPhrase = modelSpec.searchPhrase  || ""; 
    req.orderBy = modelSpec.orderBy || "";
    req.pageSize = modelSpec.pageSize || 32;
    req.assocName = modelSpec.assocName;
   
    this.pageRequest = req;
  },
  
  getObserverOptions: function() {
    return {cls: this.pageRequest.cls};
  },
  
  loadData: function(pageNumber) {
    var deferred = $.Deferred();
    if (this.data && typeof pageNumber === "undefined") {
      // data already available; may happen if a model is created from the data from the other model.
      deferred.resolve(this);
      return deferred.promise();
    }
    pageNumber = typeof pageNumber === "undefined" ? 1 : pageNumber;
    this.pageRequest.pageNumber = pageNumber;
    this.pageRequest.assocUid = this.modelSpec.params.assocUid;
   
    $.ajax({
      url: "/service/page",
      type: 'post',
      data: Trillo.stringify(this.pageRequest),
      contentType : "application/json",
      datatype : "application/json"
    }).
    done($.proxy(this.dataLoaded, this, deferred)).
    fail(function() {
      deferred.reject({
        errorMsg: "Failed to load model"
      });
    });
    
    return deferred.promise();
  },
  dataLoaded: function(deferred, data) {
    this.createObserver();
    if (!data.items) {
      // not paginated data
      this.data = data;
      this.updateTable(data);
      this.controller().modelLoaded(this);
      deferred.resolve(this);
      return;
    } else {
      // data is paginated
      this.paginatedDataLoaded(deferred, data);
    }
  },
  
  paginatedDataLoaded: function(deferred, data) {
    
    this.updateTable(data.items);
    
    if (!this.data) {
      this.data = data;
    } else {
      // assumes that the old data is paginated and incoming "data" represents a new page.
      var oldData = this.data;
      oldData.items = oldData.items.concat(data.items);
      oldData.pageSize = data.pageSize;
      oldData.numberOfPages = data.numberOfPages;
      oldData.totalNumberOfItems = data.totalNumberOfItems;
      oldData.pageNumber = data.pageNumber;
    }
    this.controller().modelLoaded(this);
    deferred.resolve(this);
  },
  
  updateTable: function(items) {
    if (items && typeof items.length !== "undefined") {
      var l = items, n = l.length;
      var table = this.table;
      var item;
      for (var i=0; i<n; i++) {
        item = l[i];
        table[item.uid] = item;
      }
    }
  },
  
  processObjAdded: function(newObj) {
    this.table[newObj.uid] = newObj;
    var data = this.data;
    var items = data.items || data;
    if (items) {
      if (this.newItemsAtEnd) {
        items.push(newObj);
      } else {
        items.unshift(newObj);
      }
      
      if (data.items && typeof data.totalNumberOfItems !== "undefined") {
        // original data is paginated.
        data.totalNumberOfItems += 1;
        data.numberOfPages = Math.ceil(data.totalNumberOfItems / data.pageSize);
      }
    }
  },
  
  getObj: function(uid) {
    return this.table[uid];
  },
  setOrderBy: function(orderBy) {
    this.pageRequest.orderBy = orderBy;
  }

});

Trillo.TreeModel = Trillo.Model.extend({
  initialize : function(modelSpec, view) {
    this._super(modelSpec, view);
  },
  loadData: function() {
    var deferred = $.Deferred();
    if (this.data) {
      /// data already available; may happen if a model is created from the data from the other model.
      deferred.resolve(this);
      return deferred.promise();
    }
    var uid = this.modelSpec.params.uid;
    var assocUid = this.modelSpec.params.assocUid;
    $.ajax({
      url: "/service/tree?" + (uid ? ("uid=" + uid) : 
        ("name=" + this.modelSpec.viewName) + (assocUid ? ("&assocUid=" + assocUid) : "")),
      type: 'get'
    }).done($.proxy(this.dataLoaded, this, deferred));
    return deferred.promise();
  },
  
  getObserverOptions: function() {
    if (this.data && this.data.uid) {
      return {uid: this.data.uid};
    } else {
      return {cls: "Tree"};
    }
  },
  
  dataLoaded: function(deferred, data) {
    this._treeLoaded(data);
    deferred.resolve(this);
  },
  
  treeLoaded2: function(data) {
    this._treeLoaded(data);
    this.view().objChanged(data);
  },
  
  _treeLoaded: function(data) {
    this.data = data;
    this.controller().modelLoaded(this);
    this.createObserver();
  },
  
  // in order to handle empty tree case, we need to do special processing.
  // In case of an empty tree, the observer is registered with cls="Tree".
  // When we receive the event, we check if the name of the tree matches with the
  // "name' passed in the option. If it does then, we reinitialize the model.
  receivedNotifications : function(obj) {
    if (this.data.uid === obj.uid) {
      // the exact tree we are observing changed.
      // in case of tree we replace the old object with new (to complex to merge)
      this.data = obj;
      this.view().objChanged(obj);
    } else if (this.data.name === obj.name) {
      // probably the tree we are interested is available.
      // Try to fetch it again.
      this.clearObserver(); // clear observer so we can recreate them with uid after data is loaded.
      var assocUid = this.modelSpec.params.assocUid;
      $.ajax({
        url: "/service/tree?" + ("name=" + this.modelSpec.viewName) + 
             (assocUid ? ("&assocUid=" + assocUid) : ""),
        type: 'get'
      }).done($.proxy(this.treeLoaded2, this));
      
    }
  }

});

Trillo.ServiceModel = Trillo.Model.extend({
  initialize : function(modelSpec, view) {
    this._super(modelSpec, view);
    this.serviceUrl = modelSpec.serviceUrl;
    if (modelSpec.paramNames) {
      var l = modelSpec.paramNames.split(",");
      for (var i=0; i < l.length; i++) {
        l[i] = $.trim(l[i]);
      }
      this.paramNames = l;
    } else {
      this.paramNames = [];
    }
    this.params = modelSpec.params;
  },
  
  isModelChanged: function(modelSpec) {
    return (this.getFullUrl(this.params) !== this.getFullUrl(modelSpec.params)) ||
           (modelSpec.data && modelSpec.data !== this.data) || (modelSpec._newData);
  },
  
  loadData: function() {
    var deferred = $.Deferred();
    if (this.data) {
      /// data already available; may happen if a model is created from the data from the other model.
      deferred.resolve(this);
      return deferred.promise();
    }
    $.ajax({
      url: this.getFullUrl(this.params),
      type: 'get'
    }).done($.proxy(this.dataLoaded, this, deferred));
    return deferred.promise();
  },
  
  dataLoaded: function(deferred, data) {
    this.data = data;
    this.createObserver(); // TODO define getObserverOptions() for the serviceModel
    this.controller().modelLoaded(this);
    deferred.resolve(this);
  },
  
  getFullUrl: function(selected) {
    var url = this.serviceUrl;
    if (this.paramNames.length && selected) {
      var query = "";
      for (var i=0; i<this.paramNames.length; i++) {
        var p = this.paramNames[i];
        if (typeof selected[p] !== "undefined") {
          query = (query.length > 0 ? "&" : "?") + p + "=" + selected[p];
        }
      }
      url = url + query;
    }
    return url;
  }
});
