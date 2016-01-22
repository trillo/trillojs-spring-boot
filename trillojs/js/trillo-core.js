/*!
 * TrilloJS v0.5.0 (https://github.com/trillo/trillojs#readme)
 * Copyright 2016 Collager Inc.
 * Licensed under the MIT license
 */
Trillo = {

    appLocation : "",
    
    OBJ_LOCKED : 3,
    
    TrilloApp : {
    },
 
    appNamespace: null,
    
    isTouchSurface: false
};


/**
 * For application specific initialization or installing custom factories, subclass this.
 * A custom initializer itself should be installed by providing its name as "Trillo.appContext.app.appInitClass" (see main.js).
 * This or its subclass is constructed by supplying a callback function "cb". Subclass "doCallback" to delay invoking
 * the callback until all initializations are completed (such as fetching initial data from the back-end).
 */
Trillo.AppInitializer = Class.extend({
  
  WIDTH_A : 800,
  WIDTH_B: 720,
  WIDTH_C: 640,
  WIDTH_D: 480,
  WIDTH_E: 320,
  
  initialize : function() {
  },
  
  initApp: function(cb) {
    this.cb = cb;
  
    // Create singleton (including factory objects).
    this.createAlertComponent();
    this.createLogComponent();
    this.createSearchHandler();
    
    this.createBuilder();
    this.createViewManager();
    this.createChartManager();
    this.createModelFactory();
    this.createObserverFactory();
    this.createPage();
    this.createRouter();
    this.createTitleBarManager();
    this.createContextMenuManager();
   
    this.doCallback();
  },
  
  doCallback: function() {
    this.cb();
  },
  
  createAlertComponent: function() {
    if (Trillo.Alert) {
      Trillo.alert = new Trillo.Alert();
    }
  },
  
  createLogComponent: function() {
    if (Trillo.Log) {
      Trillo.log = new Trillo.Log();
    }
  },
  
  createSearchHandler: function() {
    if (Trillo.SearchHandler) {
      Trillo.searchHandler = new Trillo.SearchHandler();
    }
  },
  
  createViewManager: function() {
    if (Trillo.ViewManager) {
      Trillo.viewManager = new Trillo.ViewManager();
    }
  },
  
  createChartManager: function() {
    if (Trillo.ChartManager) {
      Trillo.chartManager = new Trillo.ChartManager();
    }
  },
  
  createBuilder: function() {
    if (Trillo.Builder) {
      Trillo.builder = new Trillo.Builder();
    }
  },
  
  createModelFactory: function() {
    if (Trillo.ModelFactory) {
      Trillo.modelFactory = new Trillo.ModelFactory();
    }
  },
  
  createObserverFactory: function() {
    if (Trillo.ObserverFactory) {
      Trillo.observerFactory = new Trillo.ObserverFactory();
    }
  },
  
  createPage: function() {
    if (Trillo.Page) {
      Trillo.page = new Trillo.Page();
    }
  },
  
  createRouter: function() {
    if (Trillo.Router) {
      Trillo.router = new Trillo.Router();
    }
  },
  
  createTitleBarManager: function() {
    if (Trillo.TitleBarManager) {
      Trillo.titleBarManager = new Trillo.TitleBarManager();
    }
  },
  
  createContextMenuManager: function() {
    if (Trillo.ContextMenuManager) {
      Trillo.contextMenuManager = new Trillo.ContextMenuManager();
    }
  }
 
});

Trillo.Options = {
  V_MARGIN_TOP_ROW : 10,
  V_MARGIN : 20,
  H_MARGIN : 20,
  BOTTOM_SPACE_FOR_INF_SCROLL : 60,
  
  // options for a tree view
  OPEN_ALL : "openAll",
  CLOSE_ALL : "closeAll",
  SCROLL_ON_HOVER : "scrollOnHover",
  AUTO_SCROLL : "autoScroll",
  SMOOTH_SCROLL : "smoothScroll",
  NO_SCROLL : "noScroll"
};

Trillo.Config = {
  /** The extension (,htm or .html or any other) of view templates for non-Trillo server.
   * Trillo Server uses .htm extension by default. If it does not find a template with the
   * ".htm" extension, it looks for a template that matches the given name without extension.
   */
  viewFileExtension : "",  
  
  /** The path of the view template file. For a non-Trillo server the default is /view. 
   * Trillo Server uses /{app name}/view. It allows Trillo server to serve 
   * multiple applications (tenants).
   */
  viewPath : null,
  
  /** The base path that is used as prefix in router. 
   * Trillo Server uses the application name as the base path.
   */
  basePath : null
};

Trillo.HtmlTemplates = {
    /**
     * Template used for rendering title-bar title prefix. (TODO document what title prefix means).
     */
    titleBarTitlePrefix : '<li nm="{{viewName}}-title-prefix">{{titlePrefix}}</li>',
    
    /**
     * Template used for rendering title-bar title (TODO document what title means).
     */
    titleBarTitle : '<li nm="{{viewName}}-title">{{title}}</li>',
    
    /**
     * Template used for rendering dropdown list item
     */
    dropdownListItem : '<li><a class="js-list-item" nm="{{uid}}" href="#">{{name}}</a></li>'
};

// File css.js
// CSS classes used in JS to affect style of an element.
// They are defined in the css file as well (in some cases bootstrap). When
// alternate name is used then the value should be changed here to match the new name.
Trillo.CSS = {
    alertDanger: "alert-danger",  // failure alert
    alertSuccess : "alert-success", // success alert
    pointed: "trillo-pointed", // content view pointer corresponding to selected Toc
    hasErrorCss : "trillo-has-error", // input field with error
    hasMessageCss : "trillo-has-message", // input field with message (non-error)
    positionOutside : "trillo-position-outside", // position an element out of view (but not hidden "display:none")
    selected : "trillo-selected", // selected element css
    
    appRready: "trillo-app-ready", // class added to body once the application is ready
    tabActive: "active", // class added to active tab
    treeItemTn : "trillo-tree-item-tn", // added class to thumb-nail image of a tree node 
    tnLabel : "trillo-tn-label", // thumb-nail label
    treeNode: "tree-node", // class applied to all tree node 
    treeNodeLevelPrefix: "lvl", // root node is level 0, its children are 1 and so on. A class lvl0 is added to the root node etc.
    treeItem: "trillo-tree-item", // class applied to all tree node text (content)
    itemClose : "trillo-item-close", // class applied to closed tree node item
    itemOpen : "trillo-item-open", // class applied to closed tree node item
    containerPreviewMode : "trillo-container-preview-mode", // added to a container in preview mode
    containerMark : "trillo-container-mark", // marking shown on container in preview mode (such as dashed border)
    buttonGroup : "btn-group", // button group (bootstrap)
    dropdown : "dropdown", // drop-down (bootstrap)
    buttonGroupOpen : "open", // button group open (bootstrap)
    dropdownOpen : "open", // drop down open (bootstrap)
    fieldMsg : "trillo-field-msg" // form field informational or error message
};

/* globals moment, escape, unescape */
/**
 * Returns all classes associated with the element of a given jQuery object. 
 * If a skip class is specified, it is removed from the class names.
 */
Trillo.getAllClasses = function($e, skipClass) {
  var className = $e.attr("class");
  if (!className) {
    className = "";
  } else {
    if (skipClass) {
      className = className.replace(skipClass, "");
    }
  }
  return className;
};

/**
 * Given name separated by dot (fully qualified name), it return the reference to the object.
 */
Trillo.getRefByQualifiedName = function(name) {
  var sl = name.split(".");
  var n = sl.length, idx = 0;
  var res = window;
  
  while (res && idx < n) {
    res = res[sl[idx++]];
  }
  
  return res;
};

/**
 * A class for creating key-value pairs list.
 */
Trillo.KeyValue = Class.extend({
  initialize: function() {
    this.l = [];
  },
  add: function(k, v) {
    this.l.push({k : k, v : v});
  },
  getValue: function(k) {
   var l = this.l;
   for (var i=0; i<l.length; i++) {
     if (l[i].k === k) {
       return l[i].v;
     }
   } 
   return null;
  }
});

Trillo.uidToClass = function(uid) {
  var cls = null;
  var idx;
  if (uid) {
    idx = uid.indexOf(".");
    if (idx > 0) {
      cls = uid.substring(0, idx);
    }
  }
  return cls;
};

Trillo.uidToId = function(uid) {
  var id = null;
  var idx;
  if (uid) {
    idx = uid.indexOf(".");
    if (idx > 0) {
      id = uid.substring(idx+1);
    }
  }
  return id;
};

Trillo.isUid = function(uid) {
  if (uid) {
    var idx = uid.indexOf(".");
    return idx > 0;
  }
  return false;
};

// this method is used to position content area after tool/title bar etc.
// content area is positioned relative. Bars have fixed position.
Trillo.offsetByFixedAbsolute = function($e) {
  var h = 0;
  var pos;
  $e.prevAll().each(function() {
    pos = $(this).css("position");
    if (pos === "fixed" || pos === "absolute") {
      h += $(this).outerHeight();
    }
  });
  $e.css("margin-top", h);
};

Trillo.showBusy = function() {
  $('.js-busy-indicator').show().css("visibility", "visible");
};

Trillo.hideBusy = function() {
  $('.js-busy-indicator').css("visibility", "hidden");
};

Trillo.elemId = 0;

Trillo.getUniqueElemId = function() {
  this.elemId++;
  return "_trillo_e_" + this.elemId;
};

//'name' may be a qualified name separated by "."
Trillo.getObjectValue = function(obj, name) {
  if (name && name.length !== 0) {
    var sl = name.split(".");
    for (var i=0; i<sl.length; i++) {
      obj = obj[sl[i]];
      if (!obj) {
        break;
      }
    }
  }
  return obj === undefined || obj === null ? null : obj;
};

// 'name' may be a qualified name separated by "."
Trillo.setObjectValue = function(obj, name, value) {
  var sl = name.split(".");
  var obj2 = obj;
  for (var i=0; i<sl.length-1; i++) {
    obj2 = obj[sl[i]];
    if (!obj2) {
      obj2 = {};
      obj[sl[i]] = obj2;
    }
    obj = obj2;
  }
  name = sl[sl.length-1];
  /*
   * TODO-REVIEW The following code is useful for multi-valued field.
  if (obj[name] !== undefined) {
    if (!obj[name].push) {
      obj[name] = [ obj[name] ];
    }
    obj[name].push(value);
  } else {
    obj[name] = value;
  }
  */
  obj[name] = value;
};

//'name' may be a qualified name separated by "."
Trillo.mergeObject = function(obj, name, sourceObj) {
  var sl = name.split(".");
  var obj2 = obj;
  for (var i=0; i<sl.length - 1; i++) {
    if (sl[i] === "") {
      continue;
    }
    obj2 = obj[sl[i]];
    if (!obj2) {
      obj2 = {};
      obj[sl[i]] = obj2;
    }
    obj = obj2;
  }
  name = sl[sl.length-1];
  if (name === "") {
    $.extend(obj, sourceObj);
  } else {
    obj[name] = sourceObj;
  }
};

Trillo.formatValue = function($e, value, isField) {
  if (!value || value === "") {
    return isField ? "" : "&nbsp;";
  }
  var dt = $e.attr("display-type");
  if (dt) {
    if (dt === "date") {
      return this.formatDate($e, value);
    } else if (dt === "enum" || dt === "css-class") {
      return this.getEnumName($e, value);
    }
  }
  return value;
};

Trillo.formatDate = function($e, value) {
  var format = $e.attr("format") || "M/D/YY hh:mm:ss A";
  return moment(value).format(format);
};

Trillo.getEnumName = function($e, value) {
  var enumName = $e.attr("enum-name");
  return Trillo.enumCatalog.getName(enumName, value);
};

Trillo.setCookieValue = function(key, value, days) {
  //deleteCookie(key);
  //alert(document.cookie);
  var d = new Date();   
  d.setDate(d.getDate() + days);
  var s = escape(value) + ";expires=" + d.toGMTString();
  var dm = this.getCookieDomain();
  if (dm) {
    s += ";domain=" + dm;
  }
  document.cookie = key + "=" + s;
};

Trillo.getCookieValue = function(key) {
  key = key + "=";
  var i = document.cookie.indexOf(key);
  if (i >= 0) {
     var s = document.cookie.substring(i +  key.length);
     i = s.indexOf(";");
     if (i < 0) {
      i = s.length;
     }
     s = s.substring(0, i);
     return unescape(s);
  }
  return "";
};

Trillo.deleteCookie = function( key) {
  if ( Trillo.getCookieValue(key) !== "" ) document.cookie = key + "=" +
  ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
};

Trillo.getCookieDomain = function(){
    var s = document.domain;
  if (!s || s === "") {
    return null;
  }
  var res = null;
  var n = s.lastIndexOf(".");
  if (n > 0) {
    var s1 = s.substring(0,n);
    var s2 = s.substring(n);
    n = s1.lastIndexOf(".");
    if (n >= 0) {
      s1 = s1.substring(n);
      res = s1 + s2;
    } else {
      res = "." + s1 + s2;
    }
  }
  return res;
};

Trillo.matches = function(obj1, obj2, deep) {
  var p;
  for (p in obj1) {
    if (typeof (obj2[p]) === 'undefined') {
      return false;
    }
  }

  for (p in obj1) {
    if (obj1[p]) {
      switch (typeof (obj1[p])) {
        case 'object':
          if (deep) {
            if (!Trillo.matches(obj1[p], obj2[p])) {
              return false;
            }
          } else {
            if (obj1[p] !== obj2[p]) {
              return false;
            }
          }
          break;
        case 'function':
          break;
        default:
          if (obj1[p] !== obj2[p]) {
            return false;
          }
      }
    } else {
      if (obj2[p])
        return false;
    }
  }

  for (p in obj2) {
    if (typeof (obj1[p]) === 'undefined') {
      return false;
    }
  }

  return true;
};

Trillo.isNumeric = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

Trillo.replacer = function(key,value)
{
  if (key.indexOf("_trillo_") === 0) return undefined;
  else return value;
};

Trillo.stringify = function(data) {
  return JSON.stringify(data, Trillo.replacer);
};

Trillo.getSpecObject = function($e, selector) {
  var $se = $e.find(selector);
  if ($se.length === 0) {
    return null;
  }
  var specs = {};
  $se.each(function() {
    var $specE = $(this);
    var jsonText = $specE.html();
    if (jsonText && jsonText.length) {
      try {
         $.extend(specs, $.parseJSON(jsonText));
      } catch(exc) {
        Trillo.log.error("Failed to parse view spec JSON: " + exc.message + "<br/>" + jsonText);
      }
    }
  });
  $se.remove();
  return specs;
};

Trillo.getNearestInDOMTree = function($e, selector) {
  var $temp = $e.find(selector);
  while ($temp.length === 0 && $e.length && ($e.prop("nodeName") || "").toLowerCase() !== "html") {
    $e = $e.parent();
    $temp = $e.find(selector);
  }
  return $temp;
};



Trillo.EnumCatalog = Class.extend({
  initialize : function() {
    this.table = {};
  },
  register: function(enumName, anEnum) {
    this.table[enumName] = anEnum;
  },
  getEnum: function(enumName) {
    return this.table[enumName];
  },
  getName: function(enumName, v) {
    if (!enumName) {
      return v;
    }
    var anEnum = this.table[enumName];
    if (!anEnum) return v;
    for (var i=0; i<anEnum.length; i++) {
      if (anEnum[i].v === v) {
        return anEnum[i].n;
      }
    }
    return v;
  },
  getValue: function(enumName, name) {
    var anEnum = this.table[enumName];
    if (!anEnum) return null;
    for (var i=0; i<anEnum.length; i++) {
      if (anEnum[i].n === name) {
        return anEnum[i].v;
      }
    }
    return null;
  },
  registerAll: function(enums) {
    var self = this;
    $.each(enums, function(name, anEnum) {
      self.register(name, anEnum);
    });
  }
});

Trillo.enumCatalog = new Trillo.EnumCatalog();
/**** */
$(function() {
  $.ajaxSetup({ cache: false });
    
    // Ajax events fire in following order
    $(document).ajaxStart(function () {
      Trillo.alert.clear();
      // display busy indicator
      Trillo.showBusy();
    }).ajaxSend(function (e, xhr, opts) {
      /* if (opts.url.indexOf("/view") !== 0) {
        opts.url = Trillo.appLocation + opts.url;
      } */
    }).ajaxError(function (e, xhr, opts) {
      
       // display error message
      try {
        var data = $.parseJSON(xhr.responseText);
        if (data.redirectUrl) {
          if (data.redirectUrl === "/login") {
            window.location.reload(true);
          } else {
            window.location.href = data.redirectUrl;
          }
          return;
        }
        if (opts.error) {
          return;
        }
        var msg = data.message || data.detail;
        if (msg) {
          Trillo.log.error(msg);
        }
      } catch (exc) {
        if (opts.error) {
          return;
        }
        // log exception message
        Trillo.log.error(exc.message);
        // refresh page ...
        //window.location.reload(true);
      }
    }).ajaxSuccess(function (e, xhr, opts) {
      
    }).ajaxComplete(function (e, xhr, opts) {
    }).ajaxStop(function () {
      // hide busy indicator
      Trillo.hideBusy();
    });
});
Trillo.Log = Class.extend({
  initialize : function() {
    
  },
  
  error: function(msg) {
    Trillo.alert.showError("Error", msg);
  },
 
  warning: function(msg) {
    Trillo.alert.showError("Warning", msg);
  },
  
  info: function(msg) {
    Trillo.alert.show("Info", msg);
  }
});


/* globals Trillo */
Trillo.Alert = Class.extend({
  initialize : function() {
    this.$e = $('.js-alert');
    this.$t = this.$e.find('.js-title');
    this.$m = this.$e.find('.js-message');
    this.fo = $.proxy(this.fadeOut, this);
    this.$e.find('[nm="close"]').on("click", $.proxy(this.doAction, this));
  },
  
  show: function(title, msg, auto, $pe) {
    this.$e.removeClass(Trillo.CSS.alertDanger).addClass(Trillo.CSS.alertSuccess);
    this._show(title, msg, auto, $pe);
  },
 
  showError: function(title, msg, auto, $pe) {
    this.$e.removeClass(Trillo.CSS.alertSuccess).addClass(Trillo.CSS.alertDanger);
    this._show(title, msg, auto, $pe);
  },
  _show: function(title, msg, auto, $pe) {
    this.$e.finish();
    if ($pe) {
      this.$e.css("left", $pe.offset().left + Math.floor($pe.width() / 2));
    } else {
      this.$e.css("left", 0);
    }
    this.$t.html(title);
    msg = msg.replace(/(?:\r\n|\r|\n)/g, '<br />');
    this.$m.html(msg);
    this.$e.hide();
    this.$e.fadeIn(1000, auto ? this.fo : null);
  },
  
  fadeOut: function(ev) {
    this.$e.fadeOut(8000);
  },
  
  doAction: function(ev) {
    if (ev) {
      ev.stopPropagation();
      var action = $(ev.target).attr("nm");
      if (action === "close") {
        this.clear();
      }
    }
  },
 
  clear: function(ev) {
    this.$e.finish();
    this.$e.hide();
  },
  
  notYetImplemented: function(actionName) {
    this.showError("Not Implemented", "Action '"+ actionName + "' is not yet implemented", true);
  }

});


Trillo.Modal = Class.extend({
  initialize : function(options) {
    var $e = this.$e = $(".js-modal");
    
    this.$t = $e.find('[nm="modalTitle"]');
    this.$m = $e.find('[nm="modalMessage"]');
    this.$close = $e.find('[nm="modalClose"]');
    this.$ok = $e.find('[nm="modalOK"]');
    this.$no = $e.find('[nm="modalNo"]');
    this.$yes = $e.find('[nm="modalYes"]');
  
    $e.find("button").on("click", $.proxy(this.doAction, this));
  },
  doAction: function(ev) {
    var $e = $(ev.target);
    var name = $e.attr("nm");
    var options = this.options;
    switch(name) {
    case 'modalOK' : 
      this.hide();
      if (options.ok) {
        options.ok(options);
      }
      break;
    }
  },
  show: function(header, message, options) {
    options = options || {};
    this.options = options;
    this.$t.html(header);
    this.$m.html(message);
    if (options.ok) {
      this.$ok.show();
    } else {
      this.$ok.hide();
    }
    if (options.yes) {
      this.$yes.show();
    } else {
      this.$yes.hide();
    }
    if (options.no) {
      this.$no.show();
    } else {
      this.$no.hide();
    }
    this.$e.modal('show');
  },
  hide: function() {
    this.$e.modal('hide');
  }
});

Trillo.showModal = function(header, message, options) {
  if (!Trillo._modal) {
    Trillo._modal = new Trillo.Modal();
  }
  Trillo._modal.show(header, message, options);
};

Trillo.hideModal = function(header, message, options) {
  if (Trillo._modal) {
    Trillo._modal.hide();
  }
};





Trillo.Router = Class.extend({
  initialize : function() {
    this.handler = $.proxy(this.historyChanged, this);
    this.busyProcessing = false;
    this.viewsMarkedForClearing = [];
    this.isHistoryOn = false;
    this.initialRoute = null; // route with which the page is launched
    this.defaultRoute = null; // the route to which the UI navigates due to initialRoute (kind of default route).
  },
  
  start: function() {
    var path = (location.pathname || "") + (location.search || "");
   
    this.initialRoute = path;
    this.routeTo(path);
  },
  
  setHistoryOn: function() {
    $.history.on('load change', this.handler).listen();
  },
  
  historyChanged: function(event, route, type) {
    if (!route || this.busyProcessing) {
      return;
    }
    if (route === this.initialRoute) {
      route = this.defaultRoute;
    }
    this.routeTo(route);
  },
  
  routeTo : function(route, pushRequired) {
    if (this.busyProcessing) {
      return;
    }
    this.busyProcessing = true;
    var self = this;
    route = this.normalizeRoute(route); // removes app name and leading "/"
    var promise = Trillo.page.show(route);
    promise.done(function(listOfViews) {
      if (listOfViews && listOfViews.length > 0) {
        var newRoute = listOfViews[listOfViews.length-1].controller().getRouteUpTo();
        if (self.isHistoryOn) {
          if (pushRequired) {
            $.history.push(newRoute);
          }
        } else {
          if (self.defaultRoute != newRoute) {
            self.defaultRoute = newRoute; 
            window.history.replaceState({}, null, newRoute); // we use replaceState to update address bar but not make new entry
          }
        }
      }
      self.clearMarkedForClearing();
      if (!self.isHistoryOn) {
        self.isHistoryOn = true; 
        self.setHistoryOn();
      }
      self.busyProcessing = false;
    });
    promise.fail(function(result) {
      self.clearMarkedForClearing();
      self.busyProcessing = false;
    });
  },
  
  markForClearing: function(view) {
    this.viewsMarkedForClearing.push(view);
  },
  
  clearMarkedForClearing: function(view) {
    var l = this.viewsMarkedForClearing;
    if (l.length > 0) {
      for (var i=l.length-1; i >= 0; i--) {
        l[i].clear();
      }
      l.length = 0;
      Trillo.page.windowResized();
    }
  },
  
  showingView: function(view) {
    var l = this.viewsMarkedForClearing;
    for (var i=0; i < l.length; i++) {
      // if there is view marked for clearing which has the same container as the view to shown,
      // then clear it so its container can be used.
      // Clearing container immediately before its reuse avoids page flicker.
      if (view.viewSpec.container && l[i].viewSpec.container === view.viewSpec.container) {
        l[i].clear();
        l.splice(i, 1);
        return;
      }
    }
  },
  
  normalizeRoute: function(route) {
    if (!route) {
      return route;
    }
    var prefix = Trillo.Config.basePath;
    if (route.indexOf(prefix) === 0) {
      route = route.substring(prefix.length); 
    }
    if (route.indexOf("/") === 0) {
      route = route.substring(1); 
    }
    return route;
  }

});

/**
 * @file modelFactory.js
 */

/**
 * @class Creates model using modelSpec.
 * modelSpec may have data property set by the invoker.
 * It is singleton at present. Still we use class
 * so in future, it can be instantiated multiple times if required.
 */
Trillo.ModelFactory = Class.extend({
  
  initialize : function(options) {
    
  }, 
  
  createModel: function(modelSpec, view) {
    // make a copy of the given modelSpec so we can avoid inconsistency if
    // passed modelSpec is changed by invoker
    modelSpec = $.extend({}, modelSpec);
    var model;
    model = this.createModelForName(modelSpec, view);
    if (!model) {
      var appNamespace = Trillo.appNamespace;
      model = this.createModelForNS(appNamespace, modelSpec, view);
      if (!model) {
        // try common
        model = this.createModelForNS(window.Shared, modelSpec, view);
      }
      if (!model) {
        if (modelSpec.impl) {
          Trillo.log.warning("Model class '" + modelSpec.impl + "' not found, using default Model.");
        }
        model = new Trillo.Model(modelSpec, view);
      }
    }
    return model;
  },
  
  createModelForName: function(modelSpec, view) {
    var clsName = modelSpec.impl;
    if (clsName) {
      var clsRef = Trillo.getRefByQualifiedName(clsName);
      if (clsRef) {
        return new clsRef(modelSpec, view);
      }
    }
    return null;
  },

  createModelForNS: function(ns, modelSpec, view) {
    var clsName = modelSpec.impl;
    if (clsName) {
      if (ns && ns[clsName]) {
        return new ns[clsName](modelSpec, view);
      } else {
        var clsRef = Trillo.getRefByQualifiedName(clsName);
        if (clsRef) {
          return new clsRef(modelSpec, view);
        }
      }
    }
    return null;
  }
  
});

Trillo.Model = Class.extend({
  
  initialize : function(modelSpec, view) {
    this.modelSpec = modelSpec;
    this._view = view;
    this._controller = view.controller();
    this.observer = null;
    this.table = {};
    this.data = modelSpec._newData || modelSpec.data;
    this.newItemsAtEnd = modelSpec.newItemsAtEnd;
    this.parentData = modelSpec.parentData;
    this.dataPath = modelSpec.dataPath || "";
    this.listners = [];
    if (modelSpec.observeChanges) {
      this.addListener(view); // view is primary listener
    }
  },
  
  view: function() {
    return this._view;
  },
  
  controller: function() {
    return this._controller;
  },
  
  clear: function() {
    this.clearObserver();
    this.table = {};
  },
  
  isModelChanged: function(modelSpec) {
    return !Trillo.matches(modelSpec, this.modelSpec) ||
    (modelSpec.data && modelSpec.data !== this.data) || (modelSpec._newData);
  },

  setValue: function(name, value) {
    Trillo.setObjectValue(this.data, name, value);
    this.triggerChanged(this.data);
  },
  
  getValue: function(name) {
    return Trillo.getObjectValue(this.data, name);
  },
  
  getObj: function(uid) {
    if (this.data) {
      if (this.data instanceof Array) {
        var l = this.data;
        for (var i=0; i<l.lenngth; i++) {
          if (l[i].uid === uid) {
            return l[i];
          }
        }
      } else if (this.data.uid === uid) {
        return this.data;
      }
    }
    return null;
  },
  
  loadData: function() {
    var deferred = $.Deferred();
    if (this.data) {
      /// data already available; may happen if a model is created from the data from the other model.
      deferred.resolve(this);
      return deferred.promise();
    }
    if (this.parentData) {
      this.data = Trillo.getObjectValue(this.parentData, this.dataPath);
    } else if (!this.data) {
      this.data = {};
    }
    deferred.resolve(this);
    return deferred.promise();
  },

  loadTestData: function(viewName) {
    var deferred = $.Deferred();
    var self = this;
    if (!viewName) {
      this.data = {}; // use empty object as test data
      deferred.resolve(self);
    } else {
      $.ajax({
        url: "/model/loadTestData?viewName=" + viewName + "&appName=" + Trillo.appName,
        type: 'get'
      }).done($.proxy(this.dataLoaded, this, deferred));
    }
    return deferred.promise();
  },
  
  loadChartTestData: function(chartName) {
    var deferred = $.Deferred();
    var self = this;
    if (!chartName) {
      this.data = {}; // use empty object as test data
      deferred.resolve(self);
    } else {
      $.ajax({
        url: "/model/loadChartTestData?chartName=" + chartName + "&appName=" + Trillo.appName,
        type: 'get'
      }).done($.proxy(this.dataLoaded, this, deferred));
    }
    return deferred.promise();
  },
  
  dataLoaded: function(deferred, data) {
    this.data = data;
    this.controller().modelLoaded(this);
    deferred.resolve(this);
  },

  addListener: function(listner) {
    if (!this.hasListener(listner)) {
      this.listners.push(listner);
    }
  },
  
  removeListener: function(listner) {
    var l = this.listners, n = l.length;
    for (var i=0; i<n; i++) {
      if (l[i] === listner) {
        this.listners.splice(i, 1);
        return true;
      }
    }
    return false;
  },
  
  hasListener: function(listner) {
    var l = this.listners, n = l.length;
    for (var i=0; i<n; i++) {
      if (l[i] === listner) {
        return true;
      }
    }
    return false;
  },
  
  triggerAdded: function(newObj) {
    var l = this.listners, n = l.length;
    for (var i=0; i<n; i++) {
      if (l[i].objAdded) {
        l[i].objAdded(newObj, this.newItemsAtEnd);
      }
    }
  },
  
  triggerChanged: function(modifiedItem) {
    var l = this.listners, n = l.length;
    for (var i=0; i<n; i++) {
      if (l[i].objChanged) {
        l[i].objChanged(modifiedItem);
      }
    }
  },
  
  triggerDeleted: function(deletedItem) {
    var l = this.listners, n = l.length;
    for (var i=0; i<n; i++) {
      if (l[i].objDeleted) {
        l[i].objDeleted(deletedItem);
      }
    }
  },
  
  processObjAdded: function(newObj) {
  },
  
  processObjDeleted: function(deletedItem) {
  },
 
  createObserver: function() {
    if (this.listners.length > 0 && !this.observer) {
      var opt = this.getObserverOptions();
      if (opt !== null) {
        opt.cb = $.proxy(this.receivedNotifications, this);
        this.observer = Trillo.observerFactory.createObserver(opt);
      }
    }
  },
  
  getObserverOptions: function() {
    return null;
  },
  
  clearObserver: function() {
    if (this.observer) {
      this.observer.clear();
      this.observer = null;
    }
    this.table = {};
  },
  
  receivedNotifications : function(item) {   
    //debug.debug(Trillo.stringify(item));
    var itemOld, table = this.table;
    itemOld = table[item.uid];
    if (item._deleted_) {
      if (itemOld) {
        this.processObjDeleted(itemOld);
        this.triggerDeleted(itemOld);
      }
    } else if (itemOld) {
      $.extend(itemOld, item);
      this.triggerChanged(itemOld);
    } else {
      this.processObjAdded(item);
      this.triggerAdded(item);
    }
  },

  doSort: function(attrName, currentSort) {
    debug.debug("Sort by: " + attrName);
    function doCompare(a, b) {
      if (a[attrName] < b[attrName])  {
        return -1;
      } else if (a[attrName] > b[attrName])  {
        return 1;
      } else {
        return 0;
      }
    }
    if (this.data instanceof Array) {
     
      if (currentSort === "asc") {
        this.data.sort(function(a, b) {
          return doCompare(a, b);
        });
      } else {
        this.data.reverse(function(a, b) {
          return doCompare(a, b);
        });
      }
    }
  }
});

/* globals SockJS, Stomp */
/**
 * Custom observer (to connect to a non-TrilloApp server) can be installed in the factory by setting
 * "observerClass". This can be done in the "app initializer".
 */

Trillo.ObserverFactory = Class.extend({
  
  initialize : function(options) {
    this.observerClass = Trillo.Observer;
  },
  
  createObserver: function(options) {
    return new this.observerClass(options);
  }
  
});

Trillo.BaseObserver = Class.extend({
  /**
   * options should supply "cb", a callback function.
   */
  initialize : function(options) {
    this.options = options;
  },
  
  clear: function() {
    
  },
  receivedNotifications: function(data) {
    this.options.cb(data);
  }
});

Trillo.Observer = Trillo.BaseObserver.extend({
  initialize : function(options) {
    this._super(options);
    this.start();
  },
  start: function() {
    if (!Trillo.appContext.webSocketEndPoint || !Trillo.appContext.webSocketDestination) {
      // WebSocket configuration is not provided by the server.
      return;
    }
    var self = this;
    if (!self.subscribed) {
      var options = this.options;
      $.ajax({
        url: "/subscribe?" + (options.uid ? ("uid=" + options.uid) : ("cls=" + options.cls)),
        type: 'get'
      }).done(function() {
        self.subscribed = true;
        if (!Trillo.webSocket && Trillo.WebSocket && (Trillo.appContext.loggedIn)) {
          Trillo.webSocket = new Trillo.WebSocket();
        }
        Trillo.webSocket.addObserver(self);
      });
    }
  },
  clear: function() {
    var self = this;
    if (Trillo.webSocket) {
      Trillo.webSocket.removeObserver(self);
    }
    if (self.subscribed) {
      self.subscribed = false;
      var options = this.options;
      $.ajax({
        url: "/unsubscribe?" + (options.uid ? ("uid=" + options.uid) : ("cls=" + options.cls)),
        type: 'get'
      }).done(function() {
      });
    }
  }
});

Trillo.WebSocket = Class.extend({
  initialize : function(options) {
    this.observers = [];
    if (typeof SockJS == "undefined" || typeof Stomp == "undefined" || 
        !Trillo.appContext.webSocketEndPoint || !Trillo.appContext.webSocketDestination) {
      // WebSocket support is not enabled.
      // WebSocket configuration is not provided by the server.
      return;
    }
    try {
      var socket = new SockJS(Trillo.appContext.webSocketEndPoint);
      this.stompClient = Stomp.over(socket);
      this.stompClient.debug = null;
      this.connect();
    } catch (exc) {
      
    }
  },
  connect: function() {
    if (!this.stompClient) {
      return;
    }
    var self = this;
    this.stompClient.connect({}, function(frame) {
      self.stompClient.subscribe(Trillo.appContext.webSocketDestination, $.proxy(self.received, self));
    });
  },
  disconnect: function() {
    if (!this.stompClient) {
      return;
    }
    this.stompClient.disconnect();
  },
  received: function(content) {
    var data = JSON.parse(content.body);
    var l = this.observers, n = l.length;
    var uid = data.uid;
    
    if (!uid) {
      return;
    }
    var idx = uid.indexOf("\.");
    var cls = "";
    if (idx > 0) {
      cls = uid.substring(0, idx);
    }
    
    for (var i=0; i<n; i++) {
      if (l[i].options.cls === cls || l[i].options.uid === uid) {
        l[i].receivedNotifications(data);
      }
    }
  },
  ping: function() {
    if (this.stompClient) {
      var request = {};
      request.className = "test";
      this.stompClient.send("/app/pingWS", {}, Trillo.stringify(request));
    }
  },
  addObserver: function(ob) {
    if (!this.hasObserver(ob)) {
      this.observers.push(ob);
    }
  },
  removeObserver: function(ob) {
    var l = this.observers, n = l.length;
    for (var i=0; i<n; i++) {
      if (l[i] === ob) {
        this.observers.splice(i, 1);
        return true;
      }
    }
    return false;
  },
  hasObserver: function(ob) {
    var l = this.observers, n = l.length;
    for (var i=0; i<n; i++) {
      if (l[i] === ob) {
        return true;
      }
    }
    return false;
  }
});

/* globals autosize, moment */
Trillo.ViewType = {
  Tree: "tree",
  Collection: "collection",
  Table: "table",
  Grid: "grid",
  EditableTable: "editableTable",
  Selector: "selector",
  Form: "form",
  Detail: "detail",
  Chart: "chart",
  Custom: "custom",
  Content: "content",
  Tab: "tab",
  Dropdown: "dropdown",
  Nav: "nav",
  Default: "default",
  Toc: "toc"
};

Trillo.ImplClassByViewType = {
  "default" : "Trillo.View",
  "tree": "Trillo.TreeView",
  "nav": "Trillo.NavView",
  "collection": "Trillo.CollectionView",
  "table": "Trillo.CollectionView",
  "grid": "Trillo.CollectionView",
  "selector" : "Trillo.SelectorView",
  "form": "Trillo.FormView",
  "detail": "Trillo.DetailView",
  "chart": "Trillo.ChartView",
  "tab": "Trillo.TabView",
  "dropdown": "Trillo.DropdownView",
  "editableTable": "Trillo.EditableTableView",
  "toc": "Trillo.TocView",
  "content": "Trillo.ContentView"
};


Trillo.isValidViewType = function(type) {
  for (var t in Trillo.ViewType) {
    if (type === Trillo.ViewType[t]) {
      return true;
    }
  }
  return false;
};

Trillo.isCollectionView = function(type) {
  return (type === Trillo.ViewType.Collection || type === Trillo.ViewType.Table || type === Trillo.ViewType.Grid);
};

Trillo.isTreeView = function(type) {
  return (type === Trillo.ViewType.Tree);
};

Trillo.isDetailView = function(type) {
  return (type === Trillo.ViewType.Detail);
};

Trillo.isFormView = function(type) {
  return (type === Trillo.ViewType.Form);
};

Trillo.findAndSelf = function($e, cssSelector) {
  var f = $e.is(cssSelector);
  if (f) {
    return $e;
  }
  return $e.find(cssSelector);
};

// converts given data to page (if not already page)
Trillo.convertToPage = function(data) {
  data = data || [];
  if (data.items  && typeof data.items.length !== "undefined") {
    return data;
  }
  if (typeof data.length === "undefined") {
    data = [data];
  }
  
  var page = {};
  page.items = data;
  page.pageSize = data.length;
  page.numberOfPages = 1;
  page.totalNumberOfItems = page.pageSize;
  page.pageNumber = 1;
  return page;
};

// return list of objects from page (if it is a page)
Trillo.listFromPage = function(data) {
  data = data || [];
  if (data.items  && typeof data.items.length !== "undefined") {
    return data.items;
  }
  if (typeof data.length === "undefined") {
    data = [data];
  }
  
  return data;
};

Trillo.setFieldsValue = function($e, obj) {
  $e.find(".js-field-value").each(function(idx) {
    var name, $t, v;
    $t = $(this);
    name = $t.attr("nm");
    if (name) {
      v = Trillo.getObjectValue(obj, name);
      Trillo.setFieldValue($t, v, false);
    }
  });
};

Trillo.setFieldValue = function($e, value, readonly) {
  var name, type, dt, tagName;
  tagName = $e.prop("tagName").toLowerCase();
  name = $e.attr("nm");
  type = $e.attr("type");
  
  if (type === "radio" || type === "checkbox") {
    $e.prop('checked', value);
    if (readonly) {
      $e.attr("disabled", "true");
    }
  } else if (tagName === "input" || tagName === "textarea" || tagName === "select") {
    $e.val(value);
    $e.parent().find(".js-readonly-value").remove();
    if (!readonly) {
      $e.show();
      /*
      if (tagName === "textarea") {
        $e.height("auto");
        setTimeout(function() {
          $e.height($e[0].scrollHeight);
        }, 0);
      }
      */
    } else {
      $e.hide();
      if (tagName === "select") {
        value = $e.find("option:selected").text(); // will get display value
      }
      $e.after('<span class="js-readonly-value">' + value + '</span>');
    }
  } else if (tagName === 'img') {
    $e.attr("src", value);
  } else {
    value = Trillo.formatValue($e, value); // will get display value
    dt = $e.attr("display-type");
    if (dt === "css-class") {
      $e.addClass(value);
    } else {
      $e.html(typeof value === "undefined" ? "" : "" + value);
    }
  }
};

Trillo.resizeAllTextArea = function($e) {
  /*
  var $tl = $e.find("textarea");
  if ($tl.length) {
    $tl.height("auto");
    setTimeout(function() {
      $tl.each(function(idx) {
          $(this).height(this.scrollHeight);
      });
    }, 0);
  }
  */
  var $tal = $e.find('textarea');
  if ($tal.length) {
    autosize.update($tal);
  }
};

Trillo.timeTickFormat = {
  format: function (value) { return moment(value).format("M/D H:m"); },
  fit: true,
  culling: {
    max: 2
  }
};


Trillo.setSelectOptions = function($e, items, labelAttr, valueAttr, val) {
  var html = "";
  var l, v, n=0;
  if (!valueAttr) {
    $.each(items, function() {
      l = !labelAttr ? this.toString() : this[labelAttr];
      if (val === null) {
        val = n;
      }
      html += '<option value="' + n + '">' + l + '</option>';
      n++;
    });
  } else {
    $.each(items, function() {
      v = this[valueAttr];
      l = !labelAttr ? this.toString() : this[labelAttr];
      if (val === null) {
        val = v;
      }
      html += '<option value="' + v + '">' + l + '</option>';
    });
  }
  $e.html(html);
  $e.val(val);
};


Trillo.isCheckxoxOrRadio = function($e) {
  return $e.is(":checkbox") || $e.is(":radio");
};

Trillo.isButton = function($e) {
  return $e.is(":button") || $e.is(":reset") || $e.is(":reset");
};

Trillo.getInputs = function($e) {
  return $e.find('input, textarea, select')
  .not(':input[type=button], :input[type=submit], :input[type=reset]');
};

Trillo.getFieldValue = function($e) {
  switch ($e.attr("type")) {
    case "radio":
    case "checkbox":
      return $e.prop('checked') ? true : false;
    default:
      return $e.val();
  }
};



/**
 * @file viewManager
 */

/**
 * @class Creates view and maintain a cache of views. It is singleton at present. Still we use class
 * so in future, it can be instantiated multiple times if required.
 */
Trillo.ViewManager = Class.extend({
  
  viewTable : {},
  
  initialize : function(options) {
    
  }, 
  
  /**
   * @method loads give view.
   * 
   * @param {String} viewName -  the name of the view
   * @return {Promise} returns jQuery Promise. Once the view is retrieved, "promise" is resolved with view element.
   */
  loadView : function(viewName) {
    var deferred = $.Deferred();
    var entry = this.viewTable[viewName];
    if (entry) {
      this.processView(deferred, entry.html, entry.hasTemplateTag);
    } else {
      $.ajax({
        url: Trillo.Config.viewPath + viewName + Trillo.Config.viewFileExtension,
        type: 'get',
        datatype : Trillo.appContext.isTrilloServer ? "application/json" : "text/plain"
      }).done($.proxy(this.viewLoaded, this, deferred, viewName));
    }
   
    return deferred.promise();
  }, 
  
  viewLoaded: function(deferred, viewName, result) {
    var html, hasTemplateTag, entry;
    if (Trillo.appContext.isTrilloServer) {
      if (result.status === "failed") {
        Trillo.log.error(result.message || result.status);
        deferred.reject({
          errorMsg : result.message || result.status,
          viewName: viewName
        });
        return;
      } 
      html = result.message || "";
    } else {
      html = result;
    }
    hasTemplateTag = html.indexOf("{{") >= 0;
    entry = this.viewTable[viewName] = {html: html, hasTemplateTag : hasTemplateTag};
    this.processView(deferred, entry.html, entry.hasTemplateTag);
  },
  
  processView: function(deferred, viewHtml, hasTemplateTag) {
    var $c = $("<div></div>");
    $c.html(viewHtml);
    var viewSpecs = Trillo.getSpecObject($c, "script[spec='view']"); // also removes matching elements.
    var $e = $($c.children()[0]);
    $e.detach();
    deferred.resolve({$e : $e, viewSpecs: viewSpecs, hasTemplateTag: hasTemplateTag});
  }
  
});

Trillo.ChartManager = Class.extend({
  
  chartTable : {},
  
  initialize : function(options) {
    
  }, 
  
  
  getChartList : function(chartNames) {
    var deferred = $.Deferred();
    var chartsToRetrieve = "";
    var charts = [];
    var ch, chName;
    for (var i=0; i<chartNames.length; i++) {
      chName = chartNames[i];
      ch = this.chartTable[chName];
      if (ch) {
        charts.push(ch);
      } else {
        chartsToRetrieve += (chartsToRetrieve === "" ? "" : "," ) + chName;
      }
    }
    if (charts.length === chartNames.length) {
      deferred.resolve(charts);
    } else {
      $.ajax({
        url: "/model/chartList/?chartNames=" + chartsToRetrieve + "&appName=" + Trillo.appName,
        type: 'get',
        datatype : "application/json"
      }).done($.proxy(this.chartsLoaded, this, deferred, chartNames));
    }
   
    return deferred.promise();
  }, 
  
  chartsLoaded: function(deferred, chartNames, data) {
    var i;
    for (i=0; i<data.length; i++) {
      this.chartTable[data[i].name] = $.parseJSON(data[i].content);
    }
    var charts = [];
    var ch, chName;
    for (i=0; i<chartNames.length; i++) {
      chName = chartNames[i];
      ch = this.chartTable[chName];
      if (ch) {
        charts.push(ch);
      }
    }
    deferred.resolve(charts);
  }
  
});

Trillo.Builder = Class.extend({
  
  initialize : function(options) {
    this.options = options;
    this.navHistory = {};
    this.paramsHistory = {};
  }, 
  
  buildAppView: function() {
    var $body = $("body");
    var $e = $(".js-application");
    if ($e.length === 0) {
      $e = $body;
    }
   
    var viewSpec = this.udpdateViewSpecs($body, Trillo.appName, null, $body.html().indexOf("{{") > 0);
   
    if (!viewSpec) {
      viewSpec = {};
    } else {
      if (!Trillo.appName || Trillo.appName === "") {
        // use the application name
        Trillo.appName = viewSpec.name; 
        // the app space name is recommended to be the same as appName
        if (!Trillo.appNamespace) {
          Trillo.appNamespace =  window[Trillo.appName];
        }
      }
    }
    
    viewSpec = $.extend({}, viewSpec);
    // mark this view-spec to indicate that it represents application
    viewSpec.isAppView = true;
    
    
    if (!viewSpec.modelSpec) {
      viewSpec.modelSpec = {
      };
    }
    
    viewSpec.modelSpec.data = Trillo.appContext;
    
    var resDeferred = $.Deferred();
    var view = null;
    var self = this;
    if (viewSpec) {
      var promise = this.initMvc($e, viewSpec);
      promise.done(function(view) {
        self.processEmbeddedViews([view], resDeferred);
        //resDeferred.resolve(view);
      });
      promise.fail(function(result) {
        resDeferred.reject(result);
      });
    } else {
      resDeferred.reject();
    }
    return resDeferred.promise();
  },
  
  /**
   * Recursively constructs MVC for each subroute of the given route and returns
   * the promise which is resolved when everything is completed.
   * 
   * A route is specification of views, input parameters. A route consists of a multiple subroutes,
   * each subroute is separated by a forward slash ("/"). A subroute can have a parameter-list followed by "?", 
   * it is similar to the syntax of a URL query parameter. An example of the  route is as follows:
   * Compute?uid=VCenter.1/VCenterViews/VMList?filter="name like Eng*" 
   * The above route means - display a view called Compute. Its parameter is "uid=VCenter.1" (intepreted as selected 
   * item if the view is tree/ list). Following it, create a VCenterViews (which is tabs of various views 
   * for an object of type VCenter). Then create VList view which is probably a view for collection of 
   * items filtered by name.
   * 
   * 
   * MVC construction itself is asynchronous due to loadings of view and model
   * from the server. It waits for the completion of one subroute before going 
   * to the next.
   * 
   * Multiple independent can be specifies in the URL hash separated by /_/ ('_' considered as
   * route separator of two routes).
   * 
   * This method also takes a previous view which is a top level view that corresponds to the page.
   *  
   * @param {string} route - The route with multiple subroute, each correspond to hierarchy of MVC.
   * @param {View} view - top level view (corresponds to the page)
   * @returns - promise resolved by passing the list of views.
   */
  build: function(route, prevView) {
    
    var routeSpecArr = this.getRouteSpecsFromRoute(route);
    
    var resDeferred = $.Deferred();
   
    this._build(0, routeSpecArr, prevView, resDeferred, [], "");
    
    return resDeferred.promise();
  },
  
  _build: function(idx, routeSpecArr, prevView, resDeferred, listOfViews, parentPath) {
    if (idx >= routeSpecArr.length) {
      resDeferred.resolve(listOfViews);
      return;
    }
    var currentView = prevView ? prevView.nextView() : null;
    var subrouteSpec = routeSpecArr[idx];
    
    if (currentView && currentView.name !== subrouteSpec.name) { 
      // new mvc context, discard old one
      currentView.markForClearing(); // will release the resources
      currentView = null; // new will be created below
    }
    
    // call "init" to initialize currentView and receive promise. 
    // The promise will be "done" when the view and model are loaded, 
    // and Controller, View, Model are constructed.
    var viewSpec;
    if (currentView) {
      currentView.internalRoute = ""; // clear internal routes
      viewSpec = currentView.viewSpec;
    } else {
      // get next view spec defined from previous view.
      // If available it overrides properties of ViewSpec in the HTML file.
      viewSpec = prevView.getNextViewSpec(subrouteSpec.name);
     
      if (!viewSpec) {
        // create a view-spec with name
        // it will force load of view and look for view-spec within it.
        viewSpec = {name : subrouteSpec.name};
      }
    }
    if ($.isEmptyObject(subrouteSpec.params)) {
      // get last selected params from the history if available
      var p = this.paramsHistory[parentPath + "/" + subrouteSpec.name];
      if (p) {
        subrouteSpec.params = p;
      }
    }
    this.navHistory[parentPath] = subrouteSpec;
    this.paramsHistory[parentPath + "/" + subrouteSpec.name] = subrouteSpec.params;
    viewSpec.params = subrouteSpec.params;
    var promise = this.init(viewSpec, currentView, prevView); 
    var self = this;
    promise.done(function(view) {
      currentView = view;
      var subroute;
      var i;
      listOfViews.push(view);
      // The following paths or a part of it may lead to the internal route within view and thus consumed by it.
      // It will return number of paths consumed and based on that we will move the index forward and also
      // update "parentPath" accordingly.
      var forward = view.doInternalRouting(routeSpecArr, idx+1);
      if (forward > 0) {
        var idx2 = idx + 1 + forward;
        if (idx2 > routeSpecArr.length) {
          idx2 = routeSpecArr.length;
        }
        // idx2 may have been changed above, check again if it is greater than idx + 1
        if (idx2 > idx + 1) {
          for (i=idx+1; i <idx2; i++) {
            parentPath = parentPath + "/" + routeSpecArr[i].name;
          }
          idx = idx2 - 1;
        }
      }
      
      if (idx + 1 < routeSpecArr.length && (view.viewSpec.type === Trillo.ViewType.Tree
          /* || view.viewSpec.type === Trillo.ViewType.List */)) {
        // check if the given route can be followed. In case of a Tree or List type view (which represent heterogeneous collections) 
        // the selected object specified in the URL may have been deleted and as a result the current selection may 
        // have stripped off the route.
        subroute = view.getNextViewName();
        if (subroute) {
          subroute = subroute.split("/")[0];
          if (routeSpecArr[idx+1].name !== subroute) {
            routeSpecArr.length = idx + 1;
          }
        }
      }
      if (idx + 1 === routeSpecArr.length && !Trillo.isPreview) {
        var historySpec = self.navHistory[parentPath + "/" + subrouteSpec.name];
        //if (spec) {
          //routeSpecArr.push(spec);
        //} else {
          // last view is created.
          // check if the view supports default next route.
          subroute = view.getNextViewName(historySpec);
          if (subroute) {
            var sl = subroute.split("/");
            for (i=0; i<sl.length; i++) {
              routeSpecArr.push({
                name: sl[i],
                params: {}
              });
            }
          }
        //}
      }
      if ((idx + 1) < routeSpecArr.length) {
        view.routingToNextView(routeSpecArr, idx+1);
        self._build(idx+1, routeSpecArr, currentView, resDeferred, listOfViews, parentPath + "/" + subrouteSpec.name);
      } else {
        if (currentView.nextView()) {
          currentView.nextView().markForClearing();
        }
        self.processEmbeddedViews(listOfViews, resDeferred);
      }
    });
    promise.fail(function(result) {
      resDeferred.reject(result);
    });
   
  },
  
  processEmbeddedViews: function(listOfViews, resDeferred) {
    var l = listOfViews;
    var view, embeddedSpecs;
    var extendedEmbeddedSpecs = [];
    for (var i=0, n = l.length; i< n; i++) {
      view = l[i];
      embeddedSpecs = view.viewSpec.embeddedSpecs;
      if (embeddedSpecs && embeddedSpecs.length) {
        for (var j=0; j<embeddedSpecs.length; j++) {
          extendedEmbeddedSpecs.push({parentView: view, viewSpec: embeddedSpecs[j]});
        }
      }
    }
    
    this.buildEmbeddedViews(extendedEmbeddedSpecs, 0, listOfViews, resDeferred).done(function(){
      resDeferred.resolve(listOfViews);
    });
  },
  
  buildEmbeddedViews: function(extendedEmbeddedSpecs, idx, listOfViews, resDeferred) {
    var deferred = $.Deferred();
    if (idx >= extendedEmbeddedSpecs.length) {
      deferred.resolve();
      return deferred.promise();
    }
    var extEmbeddedSpec = extendedEmbeddedSpecs[idx];
    var viewSpec = extEmbeddedSpec.viewSpec;
    viewSpec.prevView = extEmbeddedSpec.parentView;
    var promise = this.init(viewSpec, viewSpec.view, extEmbeddedSpec.parentView); 
    var self = this;
    promise.done(function(view) {
      // an embedded view may have other embedded views, queue them up
      var embeddedSpecs = view.viewSpec.embeddedSpecs;
      if (embeddedSpecs && embeddedSpecs.length) {
        for (var j=0; j<embeddedSpecs.length; j++) {
          extendedEmbeddedSpecs.push({parentView: view, viewSpec: embeddedSpecs[j]});
        }
      }
      promise = self.buildEmbeddedViews(extendedEmbeddedSpecs, idx+1, listOfViews, resDeferred);
      promise.done(function() {
        deferred.resolve();
      });
    });
    promise.fail(function(result) {
      resDeferred.reject(result);
    });
    return deferred.promise();
  },
  
  init: function(viewSpec, currentView, prevView) {
    var $e, $c;
    if (!currentView) {
      if (viewSpec.viewHtml) {
        $c = $("<div></div>");
        $c.html(viewSpec.viewHtml);
        $e = $($c.children()[0]);
        $e.detach();
        currentView = this.createView($e, viewSpec, prevView);
      } else if (viewSpec.elementSelector) {
        $e = $(viewSpec.elementSelector);
        currentView = this.createView($e, viewSpec, prevView);
      } else {
        // template is loaded asynchronously therefore we return with a promise here.
        return this.loadTemplateThenInit(viewSpec, prevView);
      }
    }
    return this.initM(currentView);
  },
  
  loadTemplateThenInit: function(viewSpec, prevView) {
    var resDeferred = $.Deferred();
    var self = this;
    var promise = Trillo.viewManager.loadView(viewSpec.viewFileName || viewSpec.name); // load view using view-manager
    
    promise.done(function(viewDetail) {
      var $e = viewDetail.$e;
      // before we process this view, look for its spec defined in the file and also
      // add any embedded specs to its spec
      var viewSpec2 = self._udpdateViewSpecs(viewDetail.viewSpecs, viewSpec.name, viewSpec, viewDetail.hasTemplateTag);
      if (viewSpec2) {
        // super impose inline on the top of viewSpec2
        viewSpec = $.extend({}, viewSpec2, viewSpec);
      }
      var promise2 = self.initMvc($e, viewSpec, prevView);
      promise2.done(function(view) {
        resDeferred.resolve(view);
      });
      promise2.fail(function(result) {
        resDeferred.reject(result);
      });
    });
    
    promise.fail(function(result) {
      resDeferred.reject(result);
    });

    return resDeferred.promise();
  },
  
  
  initMvc: function($e, viewSpec, prevView) {
    var view = this.createView($e, viewSpec, prevView);
    return this.initM(view);
  },
  
  createView: function($e, viewSpec, prevView) {
    var controller = this.createController(viewSpec);
    
    controller.updateViewSpec(viewSpec); // give controller a chance to override viewSpec.
   
    // get impl
    var impl = viewSpec.impl || Trillo.ImplClassByViewType[viewSpec.type];
    
    if (!impl) {
      impl = "Trillo.View";
    }
    
    console.debug("Creating view: " + viewSpec.name + ", " + impl);
    
    var clsRef = Trillo.getRefByQualifiedName(impl);
    if (!clsRef) {
      Trillo.log.error("Could not find impl class = " + impl + ", type = " + viewSpec.type + ", defaulting to Trillo.View class");
      clsRef = Trillo.View;
    }
    viewSpec.prevView = prevView;
    var view = new clsRef($e, controller, viewSpec);
    viewSpec.view = view;
    controller.setView(view);
    // init2() does any other initialization needed post construction, 
    // mainly building list of nodes requiring Mustache processing.
    view.init2(); 
    return view;
  },
  
  /*
   * This is called to refresh models and views hierarchy starting with this view.
   * view - top view of the view hierarchy to be refreshed
   * modelLoadReqired - this applies only to the passed view. If the the view is refreshed as a result
   * by event from the server or form submission, this view may already have the latest data so there is
   * no need to load it. The subsequent will have to be reloaded since the context (as defined by parent model has changed).
   */ 
  refresh: function(view, modelLoadRequired) {
    var self = this;
    var resDeferred = $.Deferred();
    var promise;
    if (modelLoadRequired) {
      promise = this.initM(view, true);
    } else {
      promise = view.modelChanged();
    }
    promise.done(function() {
      if (view.nextView()) {
        self.refresh(view.nextView(), modelLoadRequired).done(function() {
          self.refreshEmbeddedViews(view, resDeferred, 0, modelLoadRequired);
        });
       } else {
         self.refreshEmbeddedViews(view, resDeferred, 0, modelLoadRequired);
       }
    });
    return resDeferred.promise();
  },
  
  refreshEmbeddedViews: function(view, resDeferred, idx, modelLoadRequired) {
    var embeddedViews = view.embeddedViews();
    var self = this;
    if (idx < embeddedViews.length) {
      this.refresh(embeddedViews[idx], true).done(function() {
        self.refreshEmbeddedViews(view, resDeferred, idx+1, modelLoadRequired);
      });
    } else {
      resDeferred.resolve(view);
    }
  },
  
  initM: function(view, forceModelRefresh) {
    var viewSpec = view.viewSpec;
    var modelSpec = viewSpec.modelSpec;
    modelSpec = $.extend({type: "local"}, modelSpec);
    viewSpec.modelSpec = modelSpec;
    view.controller().updatModelWithParms(modelSpec, viewSpec.params);
    return view.show(modelSpec, forceModelRefresh);
  },
  
  createController: function(viewSpec) {
    var ctrl = this.createControllerForName(viewSpec);
    var appNamespace = Trillo.appNamespace;
    if (!ctrl) {
      ctrl = this.createControllerForNS(appNamespace, viewSpec);
      if (!ctrl) {
        // try common
        ctrl = this.createControllerForNS(window.Shared, viewSpec);
      }
      if (!ctrl) {
        if (viewSpec.controller) {
          Trillo.log.warning("Controller class '" + viewSpec.controller + "' not found, using default controller.");
        }
        ctrl = new Trillo.Controller(viewSpec);
      }
    }
    if (viewSpec.actionH) {
      if (!this.setActionHandlerForNS(appNamespace, viewSpec, ctrl)) {
        this.setActionHandlerForNS(window.Shared, viewSpec, ctrl);
      }
    }
    
    return ctrl;
  },
 
  createControllerForName: function(viewSpec) {
    var clsName = viewSpec.controller;
    if (clsName) {
      var clsRef = Trillo.getRefByQualifiedName(clsName);
      if (clsRef) {
        return new clsRef(viewSpec);
      }
    }
    return null;
  },

  createControllerForNS: function(ns, viewSpec) {
    var clsName = viewSpec.controller || (viewSpec.name + "C");
    if (ns && ns[clsName]) {
      return new ns[clsName](viewSpec);
    } else {
      var clsRef = Trillo.getRefByQualifiedName(clsName);
      if (clsRef) {
        return new clsRef(viewSpec);
      }
      return null;
    }
  },
  
  setActionHandlerForNS: function(ns, viewSpec, ctrl) {
    if (ns && ns[viewSpec.actionH]) {
      ctrl.setActionHandler(new ns[viewSpec.actionH]({controller: ctrl}));
      return true;
    }
    return false;
  },
  
  udpdateViewSpecs: function($e, name, parentViewSpec, hasTemplateTag) {
    var viewSpecs = Trillo.getSpecObject($e, "script[spec='view']");
    return this._udpdateViewSpecs(viewSpecs, name, parentViewSpec, hasTemplateTag);
  },
  
  _udpdateViewSpecs: function(viewSpecs, name, parentViewSpec, hasTemplateTag) {
    if (!viewSpecs) {
      return null;
    }
    // self spec is a view-spec with the same name as the view file itself.
    var selfSpec = null; 
    var self = this;
    var specName;
    var embeddedSpecs = [];
    if (!name) {
      name = "";
    }
    $.each( viewSpecs, function( key, spec ) {
      specName = key;
      spec.name = specName;
      spec.hasTemplateTag = hasTemplateTag;
      if (specName === name || name === "") { // if the name is "" then the first viewSpec is considered my spec
        // my spec
        name = specName; // in case it was space
        selfSpec = spec;
      } else {
        // embedded spec
        spec.embedded = true;
        embeddedSpecs.push(spec);
      }
    });
    if (selfSpec && embeddedSpecs.length) {
      selfSpec.embeddedSpecs = embeddedSpecs;
    }
    return selfSpec;
  },
  
  getRouteSpecsFromRoute: function(route) {
    var routeSpecArr = [];
    
    if (!route || route.length === 0) {
      return routeSpecArr;
    }
    var sl = route.split("/");
    var subroute;
    for (var i=0; i<sl.length; i++) {
      subroute = sl[i];
      routeSpecArr.push({
        name: this.getName(subroute),
        params: this.getParams(subroute)
      });
    }
    return routeSpecArr;
  },
  
  getName: function(subroute) {
    var idx = subroute.indexOf("?");
    if (idx >= 0) {
      return $.trim(subroute.substring(0,idx));
    }
    return subroute;
  },
  
  getParams: function(subroute) {
    return $.url(subroute).param();
  },
 
  getSubrouteAsStr: function(spec) {
    var str = spec.name;
    if (str.length === 0) return "";
    var query = "";
    $.each(spec.params, function(key, value) {
      query = (query.length ? "&" : "") + (key + "=" + value);
    });
    str += (query.length ? "?"  + query : "");
    return str;
  }
});

Trillo.Controller = Class.extend({
  
  initialize: function(viewSpec) {
    this.viewSpec = viewSpec;
    this.name = viewSpec.name;
    this._view = null;
  },
  
  setView: function(view) {
    this._view = view;
  },
  
  view: function() {
    return this._view;
  },
  
  setActionHandler: function(actionH) {
    this.actionH = actionH;
  },
  
  $elem: function() {
    return this._view.$elem();
  },
  
  $container: function() {
    return this._view.$container();
  },
  
  modelLoaded: function(model) {
  },
  
  model: function() {
    return this._view.model();
  },
  
  modelData: function() {
    return this._view.modelData();
  },
  
  parentController: function() {
    var p = this._view.parentView();
    return p ? p.controller() : null;
  },
  
  updateViewSpec: function(viewSpec) {
    
  },
  
  clear: function() {
    debug.debug("Controller.clear() : " + this.name);
  },
  
  actionPerformed: function(actionName, $e, obj, infoItem) {
    if ($e) {
      var actionFunc = $e.attr("action-func");
      if (actionFunc && this[actionFunc]) {
        this[actionFunc](obj, infoItem);
        return true;
      }
    }
    if (this._actionPerformed(actionName, obj || this.getSelectedObj(), infoItem || this._view.selectedInfoItem, this._view)) {
      return true;
    }
    Trillo.alert.notYetImplemented(actionName);
    return false;
  },
  
  _actionPerformed: function(actionName, obj, infoItem, view) {
    var f = false;
    if (this.handleAction(actionName, obj, infoItem, view)) {
      f = true;
    } else if (this.delegateActionToParent(actionName, obj, infoItem, view)) {
      f = true;
    }
    return f;
  },
  
  /** Requires this._super call */
  handleAction: function(actionName, obj, infoItem, view) {
    if (this.actionH) {
      if (this.actionH.handleAction(actionName, obj, infoItem, view)) {
        return true;
      }
    }
    if (actionName === "close") {
      this.close();
      return true;
    } else if (actionName === "ok") {
      this.ok();
      return true;
    } else if (actionName === "detail") {
      return this.defaultDetail(obj, infoItem);
    } else if (actionName === 'upload') {
      this.doUpload();
      return true;
    }
    return false;
  },
  
  delegateActionToParent: function(actionName, obj, infoItem, view) {
    if (this.parentController()) {
      return this.parentController()._actionPerformed(actionName, obj, infoItem, view);
    } 
    return false;
  },
  
  defaultDetail: function(obj, infoItem) {
    var p = this.parentController();
    if (p && Trillo.isCollectionView(this.viewSpec.type) && 
        p.viewSpec.type === Trillo.ViewType.Tree ) {
      var item = p.view().tree.getItemByUid(obj.uid);
      if (item) {
        return p.selectAndRoute(obj.uid);
      }
    }
    return false;
  },
  
  dblClicked: function($e, obj, infoItem) {
    this.actionPerformed('detail', $e, obj, infoItem, this._view);
  },
  
  /** Requires this._super call */
  actionDone: function(options) {
    if (this.viewSpec.postRenderer) {
      this.viewSpec.postRenderer(options.obj._trillo_infoBlock);
    }
    if (this.getSelectedObj() === options.obj) {
      this._view.setTbState();
    }
  },
  
  selectedObjChanged: function(selectedObj) {
    // this can be overridden by custom controllers
  },
  
  getSelectedObj: function() {
    return this._view ? this._view.selectedObj: null;
  },
  
  getClosestSelectedObj: function() {
    var res = this._view ? this._view.selectedObj: null;
    if (!res) {
      var p = this.parentController();
      res = p ? p.getClosestSelectedObj() : null;
    }
    return res;
  },
  
  setToolVisible: function(name, visible) {
    this._view.toolsMgr.setToolVisible(name, visible);
  },
  
  setToolVisibleBySelector: function(selector, visible) {
    this._view.toolsMgr.setToolVisibleBySelector(selector, visible);
  },
  
  postToolsActivate: function() {
    // this can be overridden by custom controllers to do any custom logic related to tools.
  },
  
  /** Requires this._super call */
  updateTbState: function(selectedObj) {
    // this can be overridden by custom controllers to update tools state.
    if (this.actionH && this.actionH.updateTbState) {
      this.actionH.updateTbState(selectedObj);
    }
  },

  viewSelected: function(viewName) {
    this.updateRoute(viewName);
  },
  
  setParam: function(name, value) {
    this.viewSpec.params[name] = value;
    this.updateRoute();
  },
  
  getParam: function(name) {
    return this.viewSpec.params[name];
  },
  
  getRouteUpTo: function() {
    if (!this.viewSpec.isAppView) {
      var pc = this.parentController();
      var route = pc ? pc.getRouteUpTo() : "";
      var str = this.getMySubrouteAsStr();
      route = route + (str.length > 0 && route.length > 1 ? "/" : "") + str;
      return route;
    }
    return Trillo.Config.basePath;
  },
  
  getMySubrouteAsStr: function() {
    var viewSpec = this.viewSpec;
    if (!viewSpec) return "";
    var str = viewSpec.name + (this._view.internalRoute.length ? "/" + this._view.internalRoute : "");
    if (str.length === 0) return "";
    var query = "";
    $.each(viewSpec.params, function(key, value) {
      query += (query.length ? "&" : "") + (key + "=" + value);
    });
    str += (query.length ? "?"  + query : "");
    return str;
  },
  
  setRoute: function(route) {
    Trillo.router.routeTo(route, true);
  },
  
  selectAndRoute: function(uid) {
    return this._view.selectAndRoute(uid);
  },

  updateRoute: function(lastSegement) {
    var route = this.getRouteUpTo();
    if (lastSegement) {
      route += (route.length ? "/" : "") + lastSegement;
    }
    Trillo.router.routeTo(route, true);
  },
  
  getMySelection: function() {
    return this.getParam("sel");
  },
  
  getSelectionUidOrContextUid: function() {
    var uid = this.getParam("sel");
    if (!uid || !Trillo.isUid(uid)) {
      uid = this.getParam("ctx");
    }
    if (!uid) {
      var p = this.parentController();
      uid = p ? p.getSelectionUidOrContextUid() : null;
    }
    return uid;
  },
  
  getContextUid: function() {
    var uid = this.getParam("ctx");
    if (!uid) {
      var p = this.parentController();
      uid = p ? p.getSelectionUidOrContextUid() : null;
    }
    return uid;
  },
  
  updatModelWithParms: function(modelSpec, params) {
    modelSpec._newData = null; // reset _newData
    modelSpec.parentData = null;
    modelSpec.params = {};
    modelSpec.viewName = this.name;
    var p = this.parentController();
    var pview = p ? p.view() : null;
    if (pview && pview.selectedObj && Trillo.uidToId(pview.selectedObj.uid) === "-1") {
      var parentViewType = pview.viewSpec.type;
      if (parentViewType === Trillo.ViewType.Tree || Trillo.isCollectionView(parentViewType)) {
        // an object with -1 id is selected in the tree or collection view. Use it as as the data for this model
        modelSpec._newData = pview.selectedObj;
        return;
      }
    }
    modelSpec.parentData = pview ? (pview.selectedObj ? pview.selectedObj : pview.data) : null;
    if (modelSpec.impl === "Trillo.ServiceModel") {
      p = this.parentController();
      var obj = p ? p.getClosestSelectedObj() : null;
      modelSpec.params = $.extend({}, obj, this.viewSpec.params);
    } else {
      var contextUid = this.getContextUid();
      if (modelSpec.impl === "Trillo.CollectionModel") {
        if (!modelSpec.filter) {
          modelSpec.params.assocUid= contextUid;
        }
      } else {
        if (this.viewSpec.type !== Trillo.ViewType.Tree) {
          modelSpec.params.uid = contextUid;
        } else {
          modelSpec.params.assocUid = contextUid;
        }
      }
    }
  },

  /*
   * By default it lets the view compute its own title.
   * Custom controller can override this and set own title by calling
   * this._view.setTitle(title, titlePrefix);
   */
  updateTitle: function() {
    this._view.updateTitle();
  },
  
  showView: function(viewSpec) {
    viewSpec.params = viewSpec.params || {};
    viewSpec.embedded = true;
    Trillo.builder.init(viewSpec, null, this._view).done(function(view) {
      view.postSetup();
    });
  },
  
  showViewByName: function(name, obj) {
    var viewSpec = {name: name};
    if (obj) {
      viewSpec.modelSpec = {
          data: obj
      };
    }
    this.showView(viewSpec);
  },
  
  /** Requires this._super call */
  postViewShown: function(view) {
    var p = this.parentController();
    if (p) {
      p.postViewShown(view);
    }
  },
  
  postSetup: function() {
   
  },
  
  viewByName: function(viewName) {
    if (this._view) {
      return this._view.viewByName(viewName);
    }
    return null;
  },
  
  controllerByName: function(viewName) {
    var view = this.viewByName(viewName);
    return view ? view.controller() : null;
  },
  
  objChanged: function(obj) {
    // override in subclass for any custom processing
  },
  
  objAdded: function(newObj, atEnd) {
    // override in subclass for any custom processing
  },
  
  objDeleted: function(obj) {
    // override in subclass for any custom processing
  },
  
  /** Requires this._super call */
  fieldChanged: function(name, value, valid, view, obj) {
    var p = this.parentController();
    if (p) {
      p.fieldChanged(name, value, valid, view, obj);
    }
  },
  
  refreshView: function(modelLoadRequired) {
    return Trillo.builder.refresh(this._view, modelLoadRequired);
  },
  
  close: function() {
    this._view.clear();
  },
  
  ok: function() {
    if (this.viewSpec.type === Trillo.ViewType.Form) {
      this.submitForm();
    }
  },
  
  doUpload: function() {
    this.showView(this.getFileUploadSpec());
  },
  
  getFileUploadSpec: function() {
    return {
      name: "FileUpload",
      type: Trillo.ViewType.Default,
      isDialog: true,
      container: "trillo-dialog-container",
      controller: "Trillo.FileUploadC",
      modelSpec : {
        data: {
          fileName: "a"
        }
      },
      params : {
        targetViewName: this.viewSpec.name,
        folder: "",
        uploadUrl: "/fileUpload"
      }
    };
  },
  
  fileUploadSuccessful: function(option) {
    if (this.viewSpec.isDialog) {
      this.close();
    }
  },
  
  fileUploadFailed: function(option) {
    this.$elem().find(".js-upload-alert").html(option.error).show();
  },
  
  
  submitForm: function() {
    if (this._view.canSubmit()) {
      var data = this.modelData();
      if (!this.beforePost(data, this._view)) {
        return;
      }
      var cb = $.proxy(this.submitFormCompleted, this);
      var postData;
      var url;
      var viewSpec = this.viewSpec;
      postData = data;
      url = viewSpec.postUrl;   
      $.ajax({
        url: url,
        type: 'post',
        data: Trillo.stringify(postData),
        contentType : "application/json"
      }).done(cb);
    }
  },
  
  getFormSubmitUrl: function() {
    return "/submitForm";
  },
  
  submitFormCompleted: function(result) {
    if (result.status === "failed") {
      this.showNamedMessagesAsError(result.namedMessages);
    } else {
      this.clear();
      if (this.viewSpec.isDialog) {
        this.close();
      }
    }
    this.afterPost(result, this.view());
  },
  
  beforePost: function(data, view) {
    var p = this.parentController();
    if (p) {
      return p.beforePost(data, view);
    }
    return true;
  },
 
  afterPost: function(result, view) {
    var p = this.parentController();
    if (p) {
      p.afterPost(result, view);
    } else {
      this.showResult(result);
    }
  },
  
  /** Requires this._super call */
  showResult: function(result) {
    if (result.status === "failed") {
      Trillo.alert.showError("Error", result.message || result.status);
    } else {
      Trillo.alert.show("Success", result.message || result.status);
    }
  },
  
  /** Requires this._super call */
  showNamedMessagesAsError: function(messages) {
    this._view.showNamedMessagesAsError(messages);
  }
});
Trillo.Page = Class.extend({
  
  initialize : function(options) {
    this.options = options;
    this._view = null;
    this.resizeTimer = null;
    window.onresize = function() {};
    $(window).resize($.proxy(this.windowResized, this));
    try {
      $(window).bind('orientationchange', $.proxy(this.windowResized, this));
    } catch (exc) {
    }
    this._view = null;
  }, 
  
  show: function(route) {
    var resDeferred = $.Deferred();
    if (!this._view) {
      var self = this;
      var promise = Trillo.builder.buildAppView();
      if (!promise) {
        // app _view can not be built
        resDeferred.promise();
        return resDeferred.promise();
      }
      promise.done(function(listOfViews) {
        $("body").addClass(Trillo.CSS.appRready);
        self._view = listOfViews[0];
        self.showViewsForRoute(route, resDeferred);
      });
      promise.fail(function(result) {
        resDeferred.reject(result);
      });
    } else {
      this.showViewsForRoute(route, resDeferred);
    }
    return resDeferred.promise();
  },
  
  showViewsForRoute: function(route, resDeferred) {
    if (!route || route.length === 0) {
      if (Trillo.isPreview) {
        resDeferred.resolve();
        this._view.addContainerMarks();
        return;
      }
      route = this.getNextViewName();
      if (!route || route.length === 0) {
        resDeferred.resolve();
        return;
      }
    }
    
    var self = this;
    var promise = Trillo.builder.build(route, this._view);
    promise.done(function(listOfViews) {
      if (listOfViews.length > 0) {
        listOfViews[0].postSetup();
        resDeferred.resolve(listOfViews);
      }
    });
    promise.fail(function(result) {
      resDeferred.reject(result);
    });
  },
 
  getNextViewName: function() {
    var view = this._view;
    if (view) {
      if (view.viewSpec.nextView) {
        return view.viewSpec.nextView;
      } else {
        return view.getNextViewName();
      }
    }
    return null;
  },
 
  windowResized : function() {
    this.clearResizeTimer();
    if (this._view) {
      this.resizeTimer = setTimeout($.proxy(this._windowResized, this), 100);
    }
  },
  
  _windowResized : function() {
    this.clearResizeTimer();
    if (this._view) {
      this._view.windowResized();
    }
  },
  
  clearResizeTimer: function() {
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = null;
    }
  },
  
  // The following methods are invoked by an external object which is not aware of current view hierarchy.
  // Since the page is in the global name space, the external object uses page to delegate the call to the
  // right view.Rather than using event, we define interfaces since there are not too many cases and it keeps the
  // interface very obvious.
  
  fileUploadSuccessful: function(option) {
    // one of the property of option is targetViewName. Look up target view and inform it.
    var target = this._view.viewByName(option.targetViewName);
    if (target) {
      target.controller().fileUploadSuccessful(option);
    }
  },
  
  fileUploadFailed: function(option) {
    // one of the property of option is targetViewName. Look up target view and inform it.
    var target = this._view.viewByName(option.targetViewName);
    if (target) {
      target.controller().fileUploadFailed(option);
    }
  }
 
});

Trillo.ContextMenuManager = Class.extend({
  initialize : function(options) {
    this.options = options;
    this.$currentContextMenu = null;
    this.hideM = $.proxy(this.hideCurrentContextMenu, this);
  },
  showContextMenu: function($cm, x, y) {
    if ($cm !== this.$currentContextMenu && this.$currentContextMenu) {
      this.hideCurrentContextMenu();
    }
    this.$currentContextMenu = $cm;
    $("body").append($cm);
    $cm.show();
    var pos = this.getPosition($cm, x, y);
    $cm.css({
      left: pos.x,
      top: pos.y
    });
    $(document).on("click", this.hideM);
  },
  hideCurrentContextMenu: function() {
    if (this.$currentContextMenu) {
      this.$currentContextMenu.hide();
      this.$currentContextMenu = null;
      $(document).off("click", this.hideM);
    }
  },
  getPosition: function($cm, x, y) {
    var w = $cm.width();
    var h = $cm.height();
    var $w = $(window);
    var ww = $w.width();
    var wh = $w.height();
    if (y + h - $w.scrollTop() > wh) { 
      y -= h; 
    }
    var r = x + w - $w.scrollLeft();
    if (r > ww) { x -= (r - ww); }
    return {'x':x,'y':y};
  }
});



/*
 * Loads enums and strings
 */
Trillo.CatalogsLoader = Class.extend({
 
  loadCatalogs : function() {
    var deferred = $.Deferred();
    
    if (Trillo.appContext.isTrilloServer) {
      $.ajax({
        url: "/model/loadCatalogs?appName=" + Trillo.appName,
        type: 'get',
        datatype : "application/json"
      }).done($.proxy(this.catalogsLoaded, this, deferred));
    } else {
      deferred.resolve();
    }
 
    return deferred.promise();
  }, 
  
  catalogsLoaded: function(deferred, result) {
    var enums = result.enums;
    if (enums) {
      $.each(enums, function(idx, item) {
        Trillo.enumCatalog.registerAll(item);
      });
    }
    Trillo.appStrs = result.strings;
    deferred.resolve();
  }
  
});

Trillo.Main = Class.extend({
  initialize : function() {
    
    Trillo.hideBusy();
    
    this.setupContextAndConfig();
    
    var initClassName = Trillo.appContext.app.appInitClass || "Trillo.AppInitializer";
    
    var clsRef = Trillo.getRefByQualifiedName(initClassName);
    
    var initializer = clsRef ? new clsRef() : new Trillo.AppInitializer();
   
    var continueAfterInit = function() {
      (new Trillo.CatalogsLoader()).loadCatalogs().done(function() {
        Trillo.router.start();
      });
    };
    
    initializer.initApp(continueAfterInit);
  },
  
  setupContextAndConfig: function() {
    if (!Trillo.appContext) {
      Trillo.appContext = {
          user : {},
          loggedIn: false
      };
    }
    
    if (!Trillo.appContext.app) {
      Trillo.appContext.app = {
        name : "",
        appInitClass: "Trillo.AppInitializer"
      };
    }
    
    Trillo.appName = Trillo.appContext.app.name;
    Trillo.appNamespace = window[Trillo.appName];
    Trillo.isPreview = !!$.url(location.href).param("preview");
    
    if (!(Trillo.Config.basePath)) {
      Trillo.Config.basePath = Trillo.appContext.basePath ? ("/" + Trillo.appContext.basePath) : "/";
    }
    
    if (!(Trillo.Config.viewPath)) {
      Trillo.Config.viewPath = Trillo.appContext.isTrilloServer ? ("/view/" + Trillo.appName + "/") : 
        (Trillo.Config.basePath === "/" ? "/view/" : Trillo.Config.basePath + "/view/");
    }
    
    if (!Trillo.appContext.isTrilloServer && 
        (!(Trillo.Config.viewFileExtension) || Trillo.Config.viewFileExtension === "")) {
      Trillo.Config.viewFileExtension = ".html";
    }
  }

});


Trillo.startApp = function() {
  new Trillo.Main();
};

$(document).ready(function() {
  Trillo.startApp();
});
