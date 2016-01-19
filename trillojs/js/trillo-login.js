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

