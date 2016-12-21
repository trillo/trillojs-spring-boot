/*!
 * TrilloJS v0.5.0 (https://github.com/trillo/trillojs#readme)
 * Copyright 2016 Collager Inc.
 * Licensed under the MIT license
 */
jQuery.fn.extend({
  dataOrAttr: function (key) {
    return this.data(key) || this.attr(key);
  }
});
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
    this.createModelFactory();
    this.createApiAdapterFactory();
    this.createObserverFactory();
    this.createPage();
    this.createRouter();
    this.createTitleBarManager();
    this.createContextMenuManager();
    this.createPopoverMananger();
    this.createMultiViewDelegator();
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
  
  createApiAdapterFactory: function() {
    if (Trillo.ApiAdapterFactory) {
      Trillo.apiAdapterFactory = new Trillo.ApiAdapterFactory();
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
  },
  
  createPopoverMananger: function() {
    if (Trillo.PopoverManager) {
      Trillo.popoverManager = new Trillo.PopoverManager();
    }
  },
  
  createMultiViewDelegator: function() {
    if (Trillo.MultiViewDelegator) {
      Trillo.multiViewDelegator = new Trillo.MultiViewDelegator();
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
  NO_SCROLL : "noScroll",
  NON_NATIVE_SCROLLBAR : "nonNativeScrollBar",
  DIALOG_MAX_WIDTH: "400px"
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
  basePath : null,
  
  pagePath: null
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
     * Template used for rendering title-bar title prefix. (TODO document what title prefix means).
     */
    titleBarTitlePrefix2 : '<span nm="{{viewName}}-title-prefix">{{titlePrefix}}</span>',
    
    /**
     * Template used for rendering title-bar title (TODO document what title means).
     */
    titleBarTitle2 : '<span nm="{{viewName}}-title">{{title}}</span>',
    
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
    pointed: "trillo-pointed fa fa-hand-o-right", // content view pointer corresponding to selected Toc
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
  var dt = $e.dataOrAttr("display-type");
  var enumName = $e.dataOrAttr("enum-name");
  if (dt) {
    if (dt === "date" || dt === "time" || dt === "datetime") {
      return this.formatDate($e, value);
    } else if (enumName) {
      return this.getEnumName($e, value);
    }
  }
  return value;
};

Trillo.formatDate = function($e, value) {
  var format = $e.dataOrAttr("format") || "M/D/YY hh:mm:ss A";
  return moment(value).format(format);
};

Trillo.getEnumName = function($e, value) {
  var enumName = $e.dataOrAttr("enum-name");
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
    if (typeof (obj2[p]) === 'undefined' && typeof (obj1[p]) !== 'undefined') {
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
  function makeSpec($script) {
    var jsonText = $script.html();
    var temp = null;
    if (jsonText && jsonText.length) {
      try {
         temp = $.parseJSON(jsonText);
      } catch(exc) {
        Trillo.log.error("Failed to parse view spec JSON: " + exc.message + "<br/>" + jsonText);
      }
    }
    return temp;
  }
  
  function getSpecByName(list, name) {
    for (var j=0; j<list.length; j++) {
      if (list[j].name === name) {
        return list[j];
      }
    }
    return null;
  }
  
  var $main = $se.length > 0 ? $($se[0]) : $se; // in case there are more than one viewSpec in a file
  var spec = makeSpec($main);
  if (spec && $se.length > 1) {
    for (var i=1; i<$se.length; i++) {
      var spec2 = makeSpec($($se[i]));
      if (spec2 !== null) {
        spec2.embedded = true;
        if (!spec.nextViewSpecs) {
          spec.nextViewSpecs = [];
        }
        var vs = getSpecByName(spec.nextViewSpecs, spec2.name);
        if (!vs) {
          spec.nextViewSpecs .push(spec2);
        } else {
          $.extend(vs, spec2);
        }
      }
    }
  }
  $se.remove();
  return spec;
};

Trillo.getNearestInDOMTree = function($e, selector) {
  var $temp = $e.find(selector);
  while ($temp.length === 0 && $e.length && ($e.prop("nodeName") || "").toLowerCase() !== "html") {
    $e = $e.parent();
    $temp = $e.find(selector);
  }
  return $temp;
};

Trillo.getTriggerFromPath = function(path) {
  var idx = path.indexOf(":");
  if (idx >= 0) {
    return path.substring(0, idx);
  }
  return path;
};

Trillo.getViewNameFromPath = function(path) {
  var idx = path.indexOf(":");
  if (idx >= 0) {
    return path.substring(idx+1);
  }
  return path;
};

Trillo.clearObj = function(obj) {
  var prop;
  for (prop in obj) {
    delete obj[prop];
  }
};

Trillo.endsWith = function(str, subStr) {
  if (str.length < subStr.length) return false;
  return str.lastIndexOf(subStr) === str.length - subStr.length;
};


Trillo.deleteFromArray = function(l, item) {
  var idx = l.indexOf(item);
  if (idx >= 0) {
    l.splice(idx, 1);
  }
};


Trillo.findByProp = function(l, prop, value) {
  if (l) {
    for (var i=0; i<l.length; i++) {
      if (l[i][prop] === value) {
        return l[i];
      }
    }
  }
  return null;
};

Trillo.endsWith = function(str, suffix) {
  if (!str || !suffix) return false;
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

Trillo.endsWithIgnoreCase = function(str, suffix) {
  if (!str || !suffix) return false;
  str = str.toLowerCase();
  suffix = suffix.toLowerCase();
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
};


Trillo.Storage = Class.extend({
  initialize : function(storage) {
    this.storage = storage;
  },
  setItem: function(key, item) {
    item = typeof item === "string" ? item : JSON.stringify(item);
    this.storage.setItem(key, item);
  },
  getItem: function(key) {
    return this.storage.getItem(key);
  },
  getItemAsObj: function(key) {
    var s =this.storage.getItem(key);
    return s ? JSON.parse(s) : s;
  },
  removeItem: function(key) {
    this.storage.removeItem(key);
  },
  clear: function() {
    var keys = [], i;
    for (i = 0; i < this.storage.length; i++) {
      keys.push(this.storage.key(i));
    }
    for (i = 0; i < keys.length; i++) {
      this.removeItem(keys[i]);
    }
  },
  removeAllStartingWith: function(prefix) {
    var keys = [], i;
    for (i = 0; i < this.storage.length; i++) {
      if (this.storage.key(i).indexOf(prefix) === 0) {
        keys.push(this.storage.key(i));
      }
    }
    for (i = 0; i < keys.length; i++) {
      this.removeItem(keys[i]);
    }
  }
});


Trillo.sessionStorage = new Trillo.Storage(sessionStorage);

Trillo.localStorage = new Trillo.Storage(localStorage);
Trillo.NavHistory = Class.extend({
  initialize : function() {
    
  },
  
  add: function(parentPath, nextPath, nextPathParams) {
    console.log("NavHistory.add(): " + parentPath + " -> " + nextPath);
    Trillo.localStorage.setItem(parentPath, nextPath);
    if (nextPathParams) {
      Trillo.localStorage.setItem("params://" + Trillo.getFullPath(parentPath, nextPath), nextPathParams);
    } else {
      Trillo.localStorage.removeItem("params://" + Trillo.getFullPath(parentPath, nextPath));
    }
  },
  
  get: function(parentPath) {
    if (this.isDisabled()) {
      return null;
    }
    var nextPath = Trillo.localStorage.getItem(parentPath);
    console.log("NavHistory.get(): " + parentPath + " -> " + nextPath);
    return nextPath;
  },
  
  remove: function(path) {
    if (this.isDisabled()) {
      return null;
    }
    console.log("NavHistory.remove(): " + path);
    Trillo.localStorage.removeItem(path);
  },
  
  getParams: function(parentPath, nextPath, nextPathParams) {
    if (this.isDisabled()) {
      return null;
    }
    var params = Trillo.localStorage.getItem("params://" + Trillo.getFullPath(parentPath, nextPath));
    console.log("NavHistory.getParams(): " + parentPath + "/" + nextPath + "?" + params);
    return params;
  },
  
  setDisabled: function(value) {
    // history disabled flag is set in the sessionStorage to be non-persistent
    Trillo.sessionStorage.setItem("_nav_history_disabled", "" + value);
  },
  
  isDisabled: function() {
    return Trillo.sessionStorage.getItem("_nav_history_disabled") === "true";
  }
  
});


Trillo.navHistory = new Trillo.NavHistory();

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
  $.ajaxSetup(
      { cache: false,
        beforeSend: function(xhr) {
          if (Trillo.orgName) {
            xhr.setRequestHeader('x-org-name', Trillo.orgName);
          }
          if (Trillo.appName) {
            xhr.setRequestHeader('x-app-name', Trillo.appName);
          }
        }
      }
  
  );
    
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
        if (msg == "_REPO_NOT_AUTORIZED") {
          msg = "You are viewing the application in demo mode.<br/>" +
                "All update operations are disabled in this mode.";
          Trillo.showModal("Demo Mode", msg);
        } else if (msg == "_NOT_AUTORIZED") {
          msg = "Access is not allowed. <br/>Either your session has expired <br/>or you are accessing a page not available using current login info.";
          Trillo.log.error(msg);
        } else {
          Trillo.log.error(msg);
        }
        
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
    this.actionM = $.proxy(this.doAction, this);
    this.initActionHandler();
  },
  
  initActionHandler: function() {
    this.$e.find('[nm="close"]').off("click", this.actionM).on("click", this.actionM);
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
      var action = $(ev.target).dataOrAttr("nm");
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
    var name = $e.dataOrAttr("nm");
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
    Trillo.navHistory.setDisabled(true);
    var path = (location.pathname || "") + (location.search || "");
   
    this.initialRoute = path;
    this.routeTo(path);
  },
  
  setHistoryOn: function() {
    $.history.on('load change', this.handler).listen();
  },
  
  historyChanged: function(event, route, type) {
    if (event.type === "load") {
      Trillo.navHistory.setDisabled(true);
    }
    if (!route || this.busyProcessing) {
      return;
    }
    if (route === this.initialRoute) {
      route = this.defaultRoute;
    }
    
    this.routeTo(route, false, true);
  },
  
  routeTo : function(route, pushRequired, fromHistoryChange) {
    if (this.busyProcessing) {
      return;
    }
    this.busyProcessing = true;
    var self = this;
    route = this.normalizeRoute(route); // removes app name and leading "/"
    if (fromHistoryChange) {
      var routeSpecArr = Trillo.getRouteSpecsFromRoute(route);
      var routePath = Trillo.getRouteUptoIndex(routeSpecArr, routeSpecArr.length-1, false);
      if (routePath) {
        Trillo.navHistory.remove(routePath);
      }
      
    }
    var promise = Trillo.page.show(route);
    promise.done(function(listOfViews) {
      if (listOfViews && listOfViews.length > 0) {
        var newRoute = listOfViews[listOfViews.length-1].controller().getRouteUpTo(true, true);
        if (Trillo.appContext.autoLogin === "true") {
          newRoute += "?autoLogin=true";
        }
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
      
      // hide tools trigger which have no target or target has no children.
      var $temp1, $temp2, temp;
      $(".js-navbar-toggle", this.$e).each(function () {
        $temp1 = $(this);
        $temp2 = $($temp1.data("target"));
        if ($temp2.length === 0) {
          temp = $temp1.data("container-target");
          if (temp) {
            $temp2 = $('[nm="' + temp + '"]');
          }
        }
        if ($temp2.length === 0 || $temp2.children().length === 0) {
          $temp1.addClass("hide");
        } else {
          $temp1.removeClass("hide");
        }
      });
      
      // after one cycle of routing enable history
      Trillo.navHistory.setDisabled(false);
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
    var idx;
    if (!route) {
      return route;
    }
    route = decodeURIComponent(route);
    var prefix = Trillo.Config.pagePath;
    if (route.indexOf(prefix) === 0) {
      route = route.substring(prefix.length); 
      if (route.indexOf(";") === 0) {
        // should not happen
        idx = route.indexOf("/");
        if (idx > 0) {
          route = route.substring(0, idx);
        }
      }
    }
    if (route.indexOf("/") === 0) {
      route = route.substring(1); 
    }
    idx = route.indexOf("?");
    if (idx > -1) {
      route = route.substring(0, idx);
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
  
  createModel: function(modelSpec, controller) {
    // make a copy of the given modelSpec so we can avoid inconsistency if
    // passed modelSpec is changed by invoker
    modelSpec = $.extend({}, modelSpec);
    var model;
    model = this.createModelForName(modelSpec, controller);
    if (!model) {
      var appNamespace = Trillo.appNamespace;
      model = this.createModelForNS(appNamespace, modelSpec, controller);
      if (!model) {
        // try common
        model = this.createModelForNS(window.Shared, modelSpec, controller);
      }
      if (!model) {
        if (modelSpec.impl) {
          debug.warn("Model class '" + modelSpec.impl + "' not found, using default Model.");
        }
        model = new Trillo.Model(modelSpec, controller);
      }
    }
    return model;
  },
  
  createModelForName: function(modelSpec, controller) {
    var clsName = modelSpec.impl;
    if (clsName) {
      var clsRef = Trillo.getRefByQualifiedName(clsName);
      if (clsRef) {
        return new clsRef(modelSpec, controller);
      }
    }
    return null;
  },

  createModelForNS: function(ns, modelSpec, controller) {
    var clsName = modelSpec.impl;
    if (clsName) {
      if (ns && ns[clsName]) {
        return new ns[clsName](modelSpec, controller);
      } else {
        var clsRef = Trillo.getRefByQualifiedName(clsName);
        if (clsRef) {
          return new clsRef(modelSpec, controller);
        }
      }
    }
    return null;
  }
  
});

Trillo.Model = Class.extend({
  
  initialize : function(modelSpec, controller) {
    this.modelSpec = modelSpec;
    this._controller = controller;
    this.observer = null;
    this.table = {};
    this.newItemsAtEnd = modelSpec.newItemsAtEnd;
    this.dataPath = modelSpec.dataPath || "";
    this.trackedData = modelSpec.trackedData;
    this.listners = [];
    this.addListener(controller); // controller is primary listener
    this.saveChanges = [];
    this.revertedChanges = [];
    this.managingChange = false;
    this.txOn = false;
    this.txId = -1;
    this.txIdCounter = 0;
    
    // context is saved with undo/ redo change definition, its controller/ view can set it to 
    // any arbitrary value which will be available during undo/ redo
    this.context = null;
    
    // an object to hold custom states, used and updated by application 
    // code. This is useful for storing intermediate state of application.
    // It is not sent to the server as model data. But it can be used to script url 
    // parameters or post body (used as parameters).
    this.state = {};
    
    /* paginationInfo stores info required for pagination.
      
      paginationInfo.pageSize = <number of items per page>;
      paginationInfo.numberOfPages = <total number of pages>;
      paginationInfo.totalNumberOfItems = <total number of items>;
      paginationInfo.pageNumber = <page number of last page retrieved>;
    */
    this.paginationInfo = null;
  },
  
  view: function() {
    return this._controller.view();
  },
  
  controller: function() {
    return this._controller;
  },
  
  parentModelData: function() {
    /* Model can be parent of other models via controllers. */
    var pc = this._controller.parentController();
    return pc ? pc.modelData() : null;
  },
  
  getSelectedObj: function() {
    return this._controller.getSelectedObj();
  },
  
  getParentSelectedObj: function() {
    var pc = this._controller.parentController();
    return pc ? pc.getSelectedObj() : null;
  },
  
  getClosestSelectedObj: function() {
    return this._controller.getClosestSelectedObj();
  },
  
  getState: function() {
    return this.state;
  },
  
  getContextUid: function() {
    return this._controller.getContextUid();
  },
  
  updateData: function(data) {
    if (data) {
      this.data = data;
      this.setupModel(); // initializes framework specific attributes and a lookup table (this.table).
    }
  },
  
  setData: function(data) {
    if (data === this.data) {
      return;
    }
    if (!data) {
      data = {}; // use empty data
    }
    this.data = data;
    this.setupModel();
    this.triggerModelDataChanged();
    if (this.managingChange) {
      this.saveChanges = [];
      this.revertedChanges = [];
      this.controller().changeManagerUpdated(this.saveChanges.length, this.revertedChanges.length);
    }
  },
  
  clear: function() {
    this.clearObserver();
    this.table = {};
  },
  
  cloneData: function() {
    var dt = this.data;
    if (dt instanceof Array) {
      var newData = [];
      $.each(dt, function(idx, obj) {
        newData.push($.extend({}, obj));
      });
      return newData;
    } else {
      return $.extend({}, dt);
    }
  },
  
  getData: function() {
    return this.data;
  },

  setValue: function(name, value) {
    var f = null;
    var oldValue = this.getValue(name);
    var changeMgr = this.getChangeManager();
    if (changeMgr) {
      f = changeMgr.beginTx();
      this.saveChange({changeType: "objectAttrChanged", obj: this.data, name: name, value: value, oldValue: oldValue, 
        affected : this.getAffectedData(this.data)});
    }
    Trillo.setObjectValue(this.data, name, value);
    this._controller.attrChanged(this.data, name, value, oldValue, this);
    this.triggerChanged(this.data);
    if (f) {
      f();
    }
  },
  
  // updates value quietly (this is used for updating attributes which are missing but should have been present by default)
  setValueQuiet: function(name, value) {
    Trillo.setObjectValue(this.data, name, value);
  },
  
  setValueNoRecording: function(name, value) {
    var oldValue = this.getValue(name);
    Trillo.setObjectValue(this.data, name, value);
    this._controller.attrChanged(this.data, name, value, oldValue, this);
    this.triggerChanged(this.data);
  },
  
  getValue: function(name) {
    return Trillo.getObjectValue(this.data, name);
  },
  
  setObjAttrByUid: function(uid, name, value) {
    var obj = this.getObj(uid);
    if (obj) {
      this.setObjAttr(obj, name, value);
    }
  },
  
  setObjAttr: function(obj, name, value) {
    var f = null;
    if (obj) {
      var changeMgr = this.getChangeManager();
      var oldValue = Trillo.getObjectValue(obj, name);
      if (changeMgr) {
        f = changeMgr.beginTx();
        this.saveChange({changeType: "objectAttrChanged", obj: obj, name: name, value: value, oldValue: oldValue,
          affected : this.getAffectedData(this.data)});
      }
      Trillo.setObjectValue(obj, name, value);
      this._controller.attrChanged(obj, name, value, oldValue, this);
      this.triggerChanged(obj);
    }
    if (f) {
      f();
    }
  },
  
  setObjAttrByUidQuiet: function(uid, name, value) {
    var obj = this.getObj(uid);
    if (obj) {
      this.setObjAttrQuiet(obj, name, value);
    }
  },
  
  setObjAttrQuiet: function(obj, name, value) {
    if (obj) {
      Trillo.setObjectValue(obj, name, value);
    }
  },
  
  setObjAttrByUidNoRecording: function(uid, name, value) {
    var obj = this.getObj(uid);
    if (obj) {
      this.setObjAttrNoRecording(obj, name, value);
    }
  },
  
  setObjAttrNoRecording: function(obj, name, value) {
    if (obj) {
      var oldValue = Trillo.getObjectValue(obj, name);
      Trillo.setObjectValue(obj, name, value);
      this._controller.attrChanged(obj, name, value, oldValue, this);
      this.triggerChanged(obj);
    }
  },
  
  getObjAttrByUid: function(uid, name) {
    var obj = this.getObj(uid);
    if (obj) {
      return Trillo.getObjectValue(obj, name);
    }
    return null;
  },
  
  getObj: function(uid) {
    if (this.table[uid]) {
      return this.table[uid];
    }
    if (this.data) {
      if (this.data instanceof Array) {
        var l = this.data;
        for (var i=0; i<l.length; i++) {
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
  
  _setObjAttr: function(obj, name, value) {
    Trillo.setObjectValue(obj, name, value);
    this.triggerChanged(obj);
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
  
  triggerChanged: function(obj) {
    var l = this.listners, n = l.length;
    for (var i=0; i<n; i++) {
      if (l[i].objChanged) {
        l[i].objChanged(obj);
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
  
  triggerModelDataChanged: function() {
    var l = this.listners, n = l.length;
    for (var i=0; i<n; i++) {
      if (l[i].modelDataChanged) {
        l[i].modelDataChanged(this);
      }
    }
  },
  
  addObj: function(newObj) {
    this.table[newObj.uid] = newObj;
    var data = this.data;
    if (data && typeof data.length !== "undefined") {
      if (this.newItemsAtEnd) {
        data.push(newObj);
      } else {
        data.unshift(newObj);
      }
      var pi = this.paginationInfo;
      if (pi) {
        pi.totalNumberOfItems += 1;
        pi.numberOfPages = Math.ceil(pi.totalNumberOfItems / pi.pageSize);
      }
    }
    this.triggerAdded(newObj);
    return newObj;
  },
  
  changeObj: function(item) {
    var itemOld, table = this.table;
    itemOld = table[item.uid];
    if (itemOld) {
      if (itemOld !== item) {
        $.extend(itemOld, item);
      }
      this.triggerChanged(itemOld);
    }
    return itemOld;
  },
  
  deleteObj: function(item) {
    var itemOld, table = this.table;
    itemOld = table[item.uid];
    if (itemOld) {
      table[item.uid] = null;
      var data = this.data;
      if (data && typeof data.length !== "undefined") {
        Trillo.deleteFromArray(data, item);
        var pi = this.paginationInfo;
        if (pi) {
          pi.totalNumberOfItems -= 1;
          pi.numberOfPages = Math.ceil(pi.totalNumberOfItems / pi.pageSize);
        }
      }
      this.triggerDeleted(itemOld);
    }
    return itemOld;
  },
  
  addTreeNodeObj: function(newObj, parent) {
    if (!parent.children) {
      parent.children = [];
    }
    parent.children.push(newObj);
    this.setupTreeData();
    this.addObj(newObj);
  },
  
  deleteTreeNodeObj: function(obj) {
    var p = obj.parent;
    if (p && p.children) {
      Trillo.deleteFromArray(p.children, obj);
    }
    this.setupTreeData();
    this.deleteObj(obj);
  },
 
  createObserver: function() {
    if (this.modelSpec.observeChanges && !this.observer && this.listners.length > 0 ) {
      var opt = this.getObserverOptions();
      if (opt !== null) {
        opt.cb = $.proxy(this.receivedNotifications, this);
        this.observer = Trillo.observerFactory.createObserver(opt);
      }
    }
  },
  
  getObserverOptions: function() {
    var apiAd = this._controller.apiAdapter();
    return apiAd ? apiAd.getObserverOptions(this.data) : null;
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
      this.deleteObj(item);
    } else if (itemOld) {
      this.changeObj(item);
    } else {
      this.addObj(item);
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
    var dt = this.data.items || this.data;
    if (dt instanceof Array) {
     
      if (currentSort === "asc") {
        dt.sort(function(a, b) {
          return doCompare(a, b);
        });
      } else {
        dt.reverse(function(a, b) {
          return doCompare(a, b);
        });
      }
    }
  },
  
  /*
   * Returns the model which is acting as a change manager.
   */
  getChangeManager: function() {
    if (this.managingChange) {
      return this;
    }
    var pc = this._controller.parentController();
    if (pc) {
      return pc.model().getChangeManager();
    }
    return null;
  },
  
  saveModelData: function(oldData, params) {
    var changeMgr = this.getChangeManager();
    if (changeMgr) {
      var f = changeMgr.beginTx();
      changeMgr._saveChange({changeType: "modelData", oldData: oldData, newData: this.cloneData(), data: this.data, params: params,
        affected : this.getAffectedData(this.data)}, this);
      f();
    }
  },
  
  saveChange: function(change) {
    var changeMgr = this.getChangeManager();
    if (changeMgr) {
      var f = changeMgr.beginTx();
      changeMgr._saveChange(change, this);
      f();
    }
  },
  
  _saveChange: function(change, sourceModel) {
    this.revertedChanges = [];
    this.saveChanges.push({change: change, sourceModel: sourceModel, __txId: this.txId, context: sourceModel.context});
    this.controller().changeManagerUpdated(this.saveChanges.length, this.revertedChanges.length);
  },
  
  undo: function() {
    if (this.saveChanges.length) {
      var idx = this.saveChanges.length - 1;
      var currentTxId = this.saveChanges[idx].__txId;
      var firstInTx = true;
      while (idx >= 0 && this.saveChanges[idx].__txId === currentTxId) {
        var changeDef = this.saveChanges.pop();
        this.controller().undoing(changeDef.change, firstInTx, changeDef.context);
        changeDef.sourceModel.undoChange(changeDef.change);
        this.revertedChanges.push(changeDef);
        this.controller().undone(changeDef.change, firstInTx, changeDef.context);
        idx--;
        firstInTx = false;
      }
      this.controller().changeManagerUpdated(this.saveChanges.length, this.revertedChanges.length);
      this.controller().undoCompleted();
    }
  },
  
  redo: function() {
    if (this.revertedChanges.length) {
      var idx = this.revertedChanges.length - 1;
      var currentTxId = this.revertedChanges[idx].__txId;
      var firstInTx = true;
      while (idx >= 0 && this.revertedChanges[idx].__txId === currentTxId) {
        var changeDef = this.revertedChanges.pop();
        this.controller().redoing(changeDef.change, firstInTx,changeDef.context);
        changeDef.sourceModel.redoChange(changeDef.change);
        this.saveChanges.push(changeDef);
        this.controller().redone(changeDef.change, firstInTx, changeDef.context);
        idx--;
        firstInTx = false;
      }
      this.controller().changeManagerUpdated(this.saveChanges.length, this.revertedChanges.length);
      this.controller().redoCompleted();
    }
  },
  
  undoChange: function(change) {
    var changeType = change.changeType;
    if (changeType === "objectAttrChanged") {
      //if (this.data !== change.obj) this.data = change.obj;
      this._setObjAttr(change.obj, change.name, change.oldValue);
    } else if (changeType === "modelData") {
      if (this.data === change.data) {
        this._copyData(change.oldData);
      }
    }
  },
  
  redoChange: function(change) {
    var changeType = change.changeType;
    if (changeType === "objectAttrChanged") {
      //if (this.data !== change.obj) this.data = change.obj;
      this._setObjAttr(change.obj, change.name, change.value);
    } else if (changeType === "modelData") {
      if (this.data === change.data) {
        this._copyData(change.newData);
      }
    }
  },
  
  beginTx: function() {
    if (this.txOn) {
      return function() {};
    }
    this.txIdCounter += 1;
    this.txId = this.txIdCounter;
    this.txOn = true;
    this.controller().txStarted();
    var self = this;
    return function() {
      self.controller().txEnding();
      setTimeout(function() {
        self.txId = -1;
        self.txOn = false;
        self.controller().txEnded();
      }, 0);
    };
  },
  
  isSaveNeeded: function() {
    return this.saveChanges.length > 0;
  },
  
  _copyData: function(sourceData) {
    var targetData = this.data;
    if (targetData instanceof Array) {
      var dl = targetData.slice();
      var d;
      targetData.length = 0;
      var i;
      for (i=0; i<sourceData.length; i++) {
        if (dl.length > i) {
          d = dl[i];
          Trillo.clearObj(d);
        } else {
          d = {};
        }
        targetData.push($.extend(dl.length > i ? dl[i] : {}, sourceData[i]));
      }
    } else {
      Trillo.clearObj(targetData);
      $.extend(targetData, sourceData);
    }
    this.triggerModelDataChanged();
  },
  
  getAffectedData: function(source) {
    var affected = [];
    
    for (var i=0; i<arguments.length; i++) {
      affected.push(arguments[i]);
    }
    
    if (this.trackedData) {
      affected.push(this.trackedData);
    }
    
    return affected;
  },
  
  isAffected: function(dt) {
    var l = this.saveChanges, n = l.length, i, j, affected, st;
    for (i=0; i<n; i++) {
      st = l[i].change;
      affected = st.affected;
      if (affected) {
        for (j=0; j<affected.length; j++) {
          if (affected[j] == dt) {
            return true;
          }
        }
      }
    }
    return false;
  },
  
  setContext: function(context) {
    this.context = context;
  },
  
  setTrackedData: function(trackedData) {
    this.trackedData = trackedData;
  },
  
  getContext: function() {
    return this.context;
  },
  
  setupModel: function() {
    var data = this.data;
    if (!data) {
      return;
    }
    this.table = {};
    if (Trillo.isTreeView(this._controller.viewSpec.type)) {
      this.setupTreeData();
    } else if (typeof data.length !== "undefined") {
      this.updateTable(data);
    } else if (data.uid) {
      this.table[data.uid] = data;
    }
    this.createObserver();
  },
  
  updateTable: function(dt) {
    var table = this.table;
    var n = dt.length;
    var item;
    for (var i=0; i<n; i++) {
      item = dt[i];
      if (item.uid) {
        table[item.uid] = item;
      }
    }
  },
  
  setupTreeData: function() {
    var data = this.data;
    if (data && data.children) {
      this._setupTreeData(data.children, 0, null);
    }
    // the following flag is used to indicate to framework that this model's 
    // data has tree specific attributes initialized.
    this.__treeSetup = true; 
  },
  
  _setupTreeData: function(l, lvl, parent) {
    var arr = [];
    this.__setupTreeData(l, lvl, parent, arr);
    var prev = arr.length ? arr[0] : null;
    for (var i=1; i<arr.length; i++) {
      prev._next = arr[i];
      arr[i]._prev = prev;
      prev = arr[i];
    }
  },
  
  __setupTreeData: function(l, lvl, parent, arr) {
    var n = l.length, item;
    for (var i = 0; i < n; i++) {
      item = l[i];
      if (typeof item.uid === "undefined") {
        item.uid = item.name;
      }
      arr.push(item);
      this.table[item.uid] = item;
      item._lvl = lvl;
      item.parent = parent;
      if (item.children) {
        this.__setupTreeData(item.children, lvl + 1, item, arr);
      }
    }
  },
  
  getScriptContext: function() {
    // this is the context used in scripting apiAdapter parameters.
    // Examples:
    // {{data.attrName}} - for model data
    // {{selectedObj.attrName}}  - for model selected obj
    // {{parentData.attrName}} - for parent data
    // {{parentSelectedObj.attrName}} - for parent selected obj
    // {{closestSelectedObj.attrName}} - for closest selection in the hierarchy
    // {{state.attrName}} - for any custom state updated by application code
    
    var ctx = {state: this.state};
    var temp = this.data;
    if (temp) {
      ctx.data = temp;
    }
    temp = this.getSelectedObj();
    if (temp) {
      ctx.selectedObj = temp;
    }
    temp = this.parentModelData();
    if (temp) {
      ctx.parentData = temp;
    }
    temp = this.getParentSelectedObj();
    if (temp) {
      ctx.parentSelectedObj = temp;
    }
    temp = this.getClosestSelectedObj();
    if (temp) {
      ctx.closestSelectedObj = temp;
    }
    temp = this.getContextUid();
    if (temp) {
      ctx.contextUid = temp;
    }
    temp = this._controller.getParams();
    if (temp) {
      ctx.params = temp;
    }
    return ctx;
  },
  
  getPaginationInfo: function() {
    return this.paginationInfo;
  },
  
  setPaginationInfo: function(pi) {
    this.paginationInfo = pi;
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

/**
 * @file apiAdapterFactory.js
 */

Trillo.ApiAdapterFactory = Class.extend({
  
  initialize : function(options) {
    
  }, 
  
  createApiAdapter: function(apiSpec, controller) {
    // make a copy of the given apiSpec so we can avoid inconsistency if
    // passed apiSpec is changed by invoker
    apiSpec = $.extend({}, apiSpec);
    var apiAdapter;
    apiAdapter = this.createApiAdapterForName(apiSpec, controller);
    if (!apiAdapter) {
      var appNamespace = Trillo.appNamespace;
      apiAdapter = this.createApiAdapterForNS(appNamespace, apiSpec, controller);
      if (!apiAdapter) {
        // try common
        apiAdapter = this.createApiAdapterForNS(window.Shared, apiSpec, controller);
      }
    }
    return apiAdapter;
  },
  
  createApiAdapterForName: function(apiSpec, controller) {
    var clsName = apiSpec.impl;
    if (clsName) {
      var clsRef = Trillo.getRefByQualifiedName(clsName);
      if (clsRef) {
        return new clsRef(apiSpec, controller);
      }
    }
    return null;
  },

  createApiAdapterForNS: function(ns, apiSpec, controller) {
    var clsName = apiSpec.impl;
    if (clsName) {
      if (ns && ns[clsName]) {
        return new ns[clsName](apiSpec, controller);
      } else {
        var clsRef = Trillo.getRefByQualifiedName(clsName);
        if (clsRef) {
          return new clsRef(apiSpec, controller);
        }
      }
    }
    return null;
  }
  
});

Trillo.ApiAdapter = Class.extend({
  
  initialize : function(apiSpec, controller) {
    this.apiSpec = apiSpec;
    this._controller = controller;
  },
  
  controller: function() {
    return this._controller;
  },
  
  model: function() {
    return this._controller ? this._controller.model() : null;
  },
  
  isApiSpecChanged: function(apiSpec) {
    return false;
  },
  
  loadData: function(params) {
    var deferred = $.Deferred();
    this.dataLoaded(deferred, null);
    return deferred.promise();
  },
  
  dataLoaded: function(deferred, data) {
    this.assignUid(data);
    this._controller.model().updateData(data);
    deferred.resolve(this);
  },
  
  /* API adapter can provide options to be used for the registration of WEB Socket messages. */
  getObserverOptions: function() {
    return null;
  },
  
  /* uid of object graph can be initialized in subclasses. */
  assignUid: function(data) {
  }
});

/* globals Mustache */
Trillo.RestAdapter = Trillo.ApiAdapter.extend({
  initialize : function(apiSpec, controller) {
    this._super(apiSpec, controller);
    this.serviceUrl = apiSpec.serviceUrl;
    this.lastParams = null;
  },
  
  isApiSpecChanged: function(apiSpec) {
    return (this.lastUrl !== this.getFullUrl(this.lastParams));
  },
  
  loadData: function(params) {
    var deferred = $.Deferred();
    var url = this.getFullUrl(params);
    this.lastParams = params;
    this.lastUrl = url;
    $.ajax({
      url: url,
      type: 'get'
    }).done($.proxy(this.dataLoaded, this, deferred)).
    fail(function() {
      deferred.reject({
        errorMsg: "Failed to load model"
      });
    });
    return deferred.promise();
  },
 
  getFullUrl: function(params) {
    var ctx = this.model().getScriptContext();
    if (params) {
      ctx.params = $.extend({}, ctx.params, params);
    }
    var url = this.serviceUrl;
    if (url && url.indexOf("{{") >= 0) {
      url = Mustache.render(url, ctx);
    }
    if (this.apiSpec.query) {
      var query = Mustache.render(this.apiSpec.query, ctx);
      url = url + (url.indexOf("?") >= 0 ? "&" : "?") + query;
    }
    
    return url;
  }
});

Trillo.TestDataAdapter = Trillo.ApiAdapter.extend({
  initialize : function(apiSpec, controller) {
    this._super(apiSpec, controller);
  },
  
  loadData: function() {
    return this.loadTestData();
  },
 
  loadTestData: function() {
    var deferred = $.Deferred();
    if (this.data) {
      /// data already available; may happen if a model is created from the data from the other model.
      deferred.resolve(this);
      return deferred.promise();
    }
    var self = this;
   
    $.ajax({
      url: "/loadTestData?viewName=" + this.controller().view().name + "&appName=" + Trillo.appName,
      type: 'get'
    }).done($.proxy(this.dataLoaded, this, deferred)).
    fail(function() {
      deferred.reject({
        errorMsg: "Failed to load test data"
      });
    });
    
    return deferred.promise();
  },
  
  loadAllChartsTestData: function() {
    var deferred = $.Deferred();
    if (this.data) {
      /// data already available; may happen if a model is created from the data from the other model.
      deferred.resolve(this);
      return deferred.promise();
    }
    var self = this;
    
    $.ajax({
      url: "/loadAllChartsTestData?viewName=" + this.controller().view().name + "&appName=" + Trillo.appName,
      type: 'get'
    }).done($.proxy(this.dataLoaded, this, deferred)).
    fail(function() {
      deferred.reject({
        errorMsg: "Failed to load chart test data"
      });
    });
    
    return deferred.promise();
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
  Toc: "toc",
  NavTree: "navTree",
  Menu: "menu",
  FlexGrid: "flexGrid",
  Dashboard: "dashboard"
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
  "content": "Trillo.ContentView",
  "navTree": "Trillo.NavTreeView"
};

Trillo.SupportsTestDataByViewType = {
  "tree": "Trillo.TreeView",
  "collection": "Trillo.CollectionView",
  "table": "Trillo.CollectionView",
  "grid": "Trillo.CollectionView",
  "form": "Trillo.FormView",
  "detail": "Trillo.DetailView",
  "chart": "Trillo.ChartView",
  "editableTable": "Trillo.EditableTableView"
  // not supported
  // actionTool
  // container
  // content
  // dashboard
  // flexCell    
  // flexCol
  // flexRow
  // dropdown
  // menu
  // nav
  // navTree
  // page
  // selector
  // tab
  // toc
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

Trillo.isSelectionView = function(type) {
  return (type === Trillo.ViewType.Tab || type === Trillo.ViewType.Nav ||
      type === Trillo.ViewType.Selector || type === Trillo.ViewType.Menu);
};

Trillo.getViewTypeByImplClass = function(impl) {
  var type = null;
  $.each(Trillo.ImplClassByViewType, function(key, value) {
    if (value == impl) {
      type = key;
      return false;
    }
  });
  return type;
};

Trillo.supportsTestData = function(type) {
  return Trillo.SupportsTestDataByViewType[type];
};

Trillo.findAndSelf = function($e, cssSelector) {
  var f = $e.is(cssSelector);
  if (f) {
    return $e;
  }
  return $e.find(cssSelector);
};

// converts given data to page (if not already page)
Trillo.makePaginationInfo = function(data) {
  data = data || [];
  
  if (typeof data.length === "undefined") {
    data = [data];
  }
  
  var pi = {};
  pi.pageSize = data.length;
  pi.numberOfPages = 1;
  pi.totalNumberOfItems = pi.pageSize;
  pi.pageNumber = 1;
  return pi;
};

Trillo.convertToArray = function(data) {
  data = data || [];
  if (typeof data.length !== "undefined") {
    return data;
  }
  return [data];
};


Trillo.chartDataFromModelData = function(chartName, data) {
  if (!data) {
    return [];
  }
  if (typeof data.length !== "undefined") {
    return data;
  }
  var dt = data[chartName];
  if (dt) {
    if (typeof dt.length !== "undefined") {
      return dt;
    }
  }
  return [];
};

Trillo.setFieldValue = function($e, value, readonly) {
  var name, type, dt, tagName;
  tagName = $e.prop("tagName").toLowerCase();
  name = $e.dataOrAttr("nm");
  type = $e.attr("type");
  
  if (type === "radio" || type === "checkbox") {
    $e.prop('checked', value);
    if (readonly) {
      $e.attr("disabled", "true");
    }
  } else if (tagName === "input" || tagName === "textarea" || tagName === "select") {
    if (tagName === "select") {
      Trillo.setSelectOptionsFromEnum($e, value);
    }
    $e.val(value);
    $e.parent().find(".js-temp-elem-for-readonly").remove();
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
      $e.after('<span class="js-temp-elem-for-readonly">' + value + '</span>');
    }
  } else if (tagName === 'img') {
    $e.attr("src", value);
  } else {
    value = Trillo.formatValue($e, value); // will get display value
    dt = $e.dataOrAttr("display-type");
    if (dt === "css-class") {
      if (value) {
        $e.addClass(value);
        $e.attr("_value_as_css_class_", value);
      } else {
        var temp = $e.attr("_value_as_css_class_");
        if (temp) {
          $e.removeClass(value);
          $e.removeAttr("_value_as_css_class_");
        }
      }
    } else {
      $e.html(typeof value === "undefined" ? "" : ("" + value));
    }
  }
};

Trillo.setReadonlyFieldValue = function($e, value, readonly) {
  var tagName = $e.prop("tagName").toLowerCase();
  if (tagName === 'img') {
    $e.attr("src", value);
  } else {
    value = Trillo.formatValue($e, value); // will get display value
    $e.html(typeof value === "undefined" ? "" : ("" + value));
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
  format: function (value) { 
    return moment(value).format("M/D H:m"); 
  },
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

Trillo.setSelectOptionsFromEnum = function($e, val) {
  var enumName = $e.dataOrAttr("enum-name");
  if (enumName) {
    var enums = Trillo.enumCatalog.getEnum(enumName);
    if (enums) {
      Trillo.setSelectOptions($e, enums, 'n', 'v', val);
    }
  }
};


Trillo.isCheckxoxOrRadio = function($e) {
  return $e.is(":checkbox") || $e.is(":radio");
};

Trillo.isActionElement = function($e) {
  return $e.dataOrAttr("nm") && ($e.is(":button") || $e.is(":reset") || $e.is(":reset") || $e.is("a") || $e.hasClass("js-tool"));
};

Trillo.getInputs = function($e) {
  return $e.find('input, textarea, select')
  .not(':input[type=button], :input[type=submit], :input[type=reset]');
};

Trillo.getReadonlyFields = function($e) {
  return $e.find('.js-readonly-content', 'img[nm]');
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

Trillo.getClosestNamedElem = function($e) {
  while ($e && ($e.prop("nodeName") || "").toLowerCase() !== "html") {
    if ($e.attr("nm")) return $e;
    $e = $e.parent();
  }
  return null;
};

/* Label elements have for attribute. */
Trillo.getClosestLabelElem = function($e) {
  while ($e && ($e.prop("nodeName") || "").toLowerCase() !== "html") {
    if ($e.attr("for")) return $e;
    $e = $e.parent();
  }
  return null;
};

Trillo.setDisabled = function(el, f) {
  $.each(el, function() {
    if (f) {
      $(this).attr("disabled", true);
    } else {
      $(this).removeAttr("disabled");
    }
  });
};

Trillo.getActualTarget = function(ev) {
  var $e = $(ev.target);
  var tag = $e.prop("tagName").toLowerCase();
  if (!$e.hasClass("js-tool") && tag !== "a" && tag !== "button") {
    var $e2 = $e.find("button");
    if ($e2.length === 0) {
      $e2 = $e.find("a");
    }
    if ($e2.length === 0) {
      $e2 = $e.parent();
      tag = $e2.prop("tagName").toLowerCase();
      if (tag !== "a" && tag !== "button") {
        return null;
      }
    }
    $e = $e2;
  }
  return $e;
};

Trillo.belongsToView = function($te, viewName) {
  // an element, that has "for-view" attribute, is matched with the view name.
  // if it does not have "for-view" attr or the value of attr is same as the view name then
  // the element belongs to this view.
  if ($te.length === 0) {
    return false;
  }
  var temp = $te.dataOrAttr("for-view");
  return !temp || temp === viewName;
};


Trillo.hideCurrentOverlays = function(hideCtxMenu, hidePopup) {
  if (hideCtxMenu) {
    Trillo.contextMenuManager.hideCurrentContextMenu();
  }
  if (hidePopup) {
    Trillo.popoverManager.hideCurrentPopup();
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
      this.processView(deferred, entry.html);
    } else {
      $.ajax({
        url: Trillo.Config.viewPath + viewName + Trillo.Config.viewFileExtension,
        type: 'get',
        datatype : Trillo.appContext.isTrilloServer ? "application/json" : "text/plain"
      }).done($.proxy(this.viewLoaded, this, deferred, viewName)).
      fail(function() {
        deferred.reject({
          errorMsg: "Failed to load view file"
        });
      });
    }
   
    return deferred.promise();
  }, 
  
  viewLoaded: function(deferred, viewName, result) {
    var html, entry;
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
    entry = this.viewTable[viewName] = {html: html};
    this.processView(deferred, entry.html);
  },
  
  processView: function(deferred, viewHtml) {
    var $c = $("<div></div>");
    $c.html(viewHtml);
    var viewSpec = Trillo.getSpecObject($c, "script[spec='view']"); // also removes matching elements.
    var chartSpecs = Trillo.getSpecObject($c, "script[spec='chart']"); // also removes matching elements.
    if (chartSpecs) {
      if (!(chartSpecs instanceof Array)) {
        chartSpecs = [chartSpecs];
      }
      viewSpec.chartSpecs = chartSpecs;
    }
    
    var $e = $($c.children()[0]);
    $e.detach();
    deferred.resolve({$e : $e, viewSpec: viewSpec});
  }
  
});

Trillo.Builder = Class.extend({
  
  initialize : function(options) {
    this.options = options;
  }, 
  
  _getApp$Elem: function(routeSpecArr) {
    /* Returns application top level element.
     * 1. It is given by ".js-application" class.
     * 2. Or it is "body" element if not "js-application" is present.
     * 3. In case route is given and the there is an element with the attribute,
     *    app-container-for="routeSpecArr[0].name", then it is used at the default application 
     *    element. This allows another application container for special views.
     */
     var defaultAppE = $(".js-application");
     if (routeSpecArr && routeSpecArr.length > 0) {
       var alternateE = $("[app-container-for='" + routeSpecArr[0].name + "']");
       if (alternateE.length === 0) {
         alternateE = $("[data-app-container-for='" + routeSpecArr[0].name + "']");
       }
       if (alternateE.length > 0) {
         alternateE.removeClass("hide");
         defaultAppE.addClass("hide");
         return alternateE;
       }
     }
     
     // alternate element processing did not yield the app level element.
     if (defaultAppE.length > 0) {
       return defaultAppE;
     }
     
     // finally return body
     return $("body");
  },
  
  buildAppView: function(route) {
    var $body = $("body");
    var $e = this._getApp$Elem(Trillo.getRouteSpecsFromRoute(route));
   
    var viewSpec = this.udpdateViewSpecs($body, null, $body.html().indexOf("{{") > 0);
   
    if (!viewSpec) {
      viewSpec = {};
    } else {
      if (!Trillo.appName || Trillo.appName === "") {
        // TODO - following two conditions will never occur, review these
        // use the viewspec name as the application name
        Trillo.appName = viewSpec.name; 
        // the app space name is recommended to be the same as appName
        if (!Trillo.appNamespace) {
          Trillo.appNamespace =  window[Trillo.appName];
        }
      }
      if (!Trillo.pageName || Trillo.pageName === "") {
        this.pageName = this.appName;
      }
    }
    
    viewSpec = $.extend({}, viewSpec);
    // mark this view-spec to indicate that it represents application
    viewSpec.isAppView = true;
    
    // get params from route (URL) and merge with viewSpec.params
    var params = Trillo.getAppParams(route);
    viewSpec.params = $.extend(viewSpec.params, params);
    
    
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
        if (view.postSetup) {
          view.postSetup(view);
        }
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
    
    var routeSpecArr = Trillo.getRouteSpecsFromRoute(route);
    
    var resDeferred = $.Deferred();
    prevView.routingToNextView(routeSpecArr, 0);
    this._build(0, routeSpecArr, prevView, resDeferred, [], "");
    
    return resDeferred.promise();
  },
  
  _build: function(idx, routeSpecArr, prevView, resDeferred, listOfViews) {
    if (idx >= routeSpecArr.length) {
      resDeferred.resolve(listOfViews);
      return;
    }
    var currentView = prevView ? prevView.nextView() : null;
    var subrouteSpec = routeSpecArr[idx];
    
    if (currentView && currentView.name !== Trillo.getViewNameFromPath(subrouteSpec.name)) { 
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
      viewSpec = prevView.viewSpec.getNextViewSpecByPath(subrouteSpec.name);
     
      if (!viewSpec) {
        // create a view-spec with name
        // it will force load of view and look for view-spec within it.
        viewSpec = $.extend({}, Trillo.ViewSpecFuncs);
        viewSpec.initFromPath(subrouteSpec.name);
      }
    }
    viewSpec.params = subrouteSpec.params;
    var promise = this.init(viewSpec, currentView, prevView); 
    var self = this;
    promise.done(function(view) {
      currentView = view;
      var subroute;
      var i;
      var parentPath = Trillo.getRouteUptoIndex(routeSpecArr, idx-1, false);
      var myPath = Trillo.getSubrouteAsStr(routeSpecArr[idx], false);
      var myQuery = Trillo.getQueryStr(routeSpecArr[idx]);
      var paramStr, nextPath;
      
      Trillo.navHistory.add(parentPath, myPath, myQuery);
      listOfViews.push(view);
      if (view.postSetup) {
        view.postSetup(view);
      }
      // The following paths or a part of it may lead to the internal route within view and thus consumed by it.
      // It will return number of paths consumed and based on that we will move the index forward.
      var forward = view.doInternalRouting(routeSpecArr, idx+1);
      if (forward > 0) {
        var idx2 = idx + forward;
        if (idx2 > routeSpecArr.length) {
          idx = routeSpecArr.length;
        } else {
          idx = idx2; 
          // update paths to match the movement of idx
          myPath = routeSpecArr[idx].name;
          parentPath = routeSpecArr[idx-1].name;
        }
      }
      
      if (idx + 1 < routeSpecArr.length && (view.viewSpec.type === Trillo.ViewType.Tree
          /* || view.viewSpec.type === Trillo.ViewType.List */)) {
        // check if the given route can be followed. In case of a Tree or List type view (which represent heterogeneous collections) 
        // the selected object specified in the URL may have been deleted and as a result the current selection may 
        // have to be stripped off the route.
        subroute = view.getNextViewName();
        if (subroute) {
          if (routeSpecArr[idx+1].name !== subroute) {
            routeSpecArr.length = idx + 1;
          }
        }
      }
      if (idx + 1 === routeSpecArr.length && !Trillo.isPreview) {
        //if (spec) {
          //routeSpecArr.push(spec);
        //} else {
          // last view is created.
          // check if the view supports default next route.
          subroute = view.getNextViewName(Trillo.getFullPath(parentPath, myPath));
          if (subroute) {
            routeSpecArr.push({
              name: subroute,
              params: {}
            });
          }
        //}
      }
      if ((idx + 1) < routeSpecArr.length) {
        if ($.isEmptyObject(routeSpecArr[idx+ 1].params)) {
          nextPath = Trillo.getSubrouteAsStr(routeSpecArr[idx+ 1], false);
          paramStr =  Trillo.navHistory.getParams(Trillo.getFullPath(parentPath, myPath), nextPath);
          if (paramStr) {
            routeSpecArr[idx+1].params = Trillo.queryStrToParams(subroute + "?" + paramStr);
          }
        }
        view.routingToNextView(routeSpecArr, idx+1);
        self._build(idx+1, routeSpecArr, currentView, resDeferred, listOfViews);
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
      if (view.postSetup) {
        view.postSetup(view);
      }
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
    if (!viewSpec.getMyPath) {
      $.extend(viewSpec, Trillo.ViewSpecFuncs);
    }
    var $e, $c;
    if (!currentView) {
      if (viewSpec.viewHtml) {
        $c = $("<div></div>");
        $c.html(viewSpec.viewHtml);
        $e = $($c.children()[0]);
        $e.detach();
        currentView = this.createView($e, viewSpec, prevView);
      } else if (viewSpec.elementSelector) {
        $e = prevView ? $(viewSpec.elementSelector, prevView.$elem()) : $(viewSpec.elementSelector);
        currentView = this.createView($e, viewSpec, prevView);
      } else if (viewSpec.embedded || viewSpec.autoLoad) {
        var sel = '[nm="' + viewSpec.name + '"]';
        $e = prevView ? $(sel, prevView.$elem()) : $(sel);
        if ($e.length) {
          currentView = this.createView($e, viewSpec, prevView);
        } else {
          return this.loadTemplateThenInit(viewSpec, prevView);
        }
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
    var promise = Trillo.viewManager.loadView(viewSpec.getViewFileName()); // load view using view-manager
    
    promise.done(function(viewDetail) {
      var $e = viewDetail.$e;
      // before we process this view, look for its spec defined in the file and also
      // add any embedded specs to its spec
      var viewSpec2 = self._udpdateViewSpecs(viewDetail.viewSpec, viewSpec);
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
    viewSpec.params = viewSpec.params || {}; // initialize viewSpec.params with an empty object if not specified.
    var controller = this.createController(viewSpec, prevView);
    
    controller.updateViewSpec(viewSpec); // give controller a chance to override viewSpec.
   
    // get impl
    var impl = viewSpec.impl || Trillo.ImplClassByViewType[viewSpec.type];
    
    if (!impl) {
      impl = "Trillo.View";
    }
    
    debug.debug("Creating view: " + viewSpec.name + ", " + impl);
    
    var clsRef = Trillo.getRefByQualifiedName(impl);
    if (!clsRef) {
      Trillo.log.error("Could not find impl class = " + impl + ", type = " + viewSpec.type + ", defaulting to Trillo.View class");
      clsRef = Trillo.View;
    }
    // set view type based on the impl class
    viewSpec.type = viewSpec.type || Trillo.getViewTypeByImplClass(impl);
    viewSpec.prevView = prevView;
    var view = new clsRef($e, controller, viewSpec);
    viewSpec.view = view;
    controller.setView(view);
    // init2() does any other initialization needed post construction, 
    // mainly building list of nodes requiring Mustache processing.
    view.init2(); 
    return view;
  },
  
  modelReloadRequired: function(viewName, listOfViews) {
    if (listOfViews) {
      return listOfViews.indexOf(viewName) >= 0;
    }
    return true;
  },
  /*
   * This is called to refresh models and views hierarchy starting with this view.
   * view - top view of the view hierarchy to be refreshed
   * modelLoadReqired - this applies only to the passed view. If the the view is refreshed as a result
   * by event from the server or form submission, this view may already have the latest data so there is
   * no need to load it. The subsequent will have to be reloaded since the context (as defined by parent model has changed).
   */ 
  refresh: function(view, listOfViews) {
    var self = this;
    var resDeferred = $.Deferred();
    var promise;
    if (this.modelReloadRequired(view.name, listOfViews)) {
      promise = this.initM(view, true);
    } else {
      promise = view.repeatShowUsingModel();
    }
    promise.done(function() {
      if (view.nextView()) {
        self.refresh(view.nextView(), listOfViews).done(function() {
          self.refreshEmbeddedViews(view, resDeferred, 0, listOfViews);
        });
       } else {
         self.refreshEmbeddedViews(view, resDeferred, 0, listOfViews);
       }
    });
    return resDeferred.promise();
  },
  
  refreshEmbeddedViews: function(view, resDeferred, idx, listOfViews) {
    var embeddedViews = view.embeddedViews();
    var self = this;
    if (idx < embeddedViews.length) {
      this.refresh(embeddedViews[idx], listOfViews).done(function() {
        self.refreshEmbeddedViews(view, resDeferred, idx+1, listOfViews);
      });
    } else {
      resDeferred.resolve(view);
    }
  },
  
  initM: function(view, forceModelRefresh) {
    view.viewSpec.modelSpec = view.viewSpec.modelSpec || {}; // initialize viewSpec model to empty if not present.
    return view.show(forceModelRefresh);
  },
  
  createController: function(viewSpec, prevView) {
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
          debug.warn("Controller class '" + viewSpec.controller + "' not found, using default controller.");
        }
        ctrl = new Trillo.Controller(viewSpec);
      }
    }
    if (viewSpec.bizDelegate) {
      if (!this.setBizDelegateForNS(appNamespace, viewSpec, ctrl)) {
        this.setBizDelegateForNS(window.Shared, viewSpec, ctrl);
      }
    }
    if (prevView) {
      ctrl.setParentController(prevView.controller());
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
  
  setBizDelegateForNS: function(ns, viewSpec, ctrl) {
    if (ns && ns[viewSpec.bizDelegate]) {
      ctrl.setBizDelegate(new ns[viewSpec.bizDelegate]({controller: ctrl}));
      return true;
    }
    return false;
  },
  
  udpdateViewSpecs: function($e, parentViewSpec) {
    var viewSpec = Trillo.getSpecObject($e, "script[spec='view']");
    return this._udpdateViewSpecs(viewSpec, parentViewSpec);
  },
  
  _udpdateViewSpecs: function(viewSpec, parentViewSpec) {
    if (!viewSpec) {
      return null;
    }
    var embeddedSpecs = [];
    viewSpec.trigger = viewSpec.trigger || viewSpec.name;
    if (!viewSpec.getMyPath) {
      $.extend(viewSpec, Trillo.ViewSpecFuncs);
    }
    var nextViewSpecs = viewSpec.nextViewSpecs;
    if (nextViewSpecs) {
      $.each( nextViewSpecs, function( key2, spec2 ) {
        $.extend(spec2, Trillo.ViewSpecFuncs);
        if (spec2.embedded || spec2.autoLoad) {
          embeddedSpecs.push(spec2);
        }
      });
    }
    
    if (embeddedSpecs.length) {
      var self = this;
      $.each( embeddedSpecs, function( key2, spec2 ) {
        if (viewSpec.nextView === spec2.name) {
          viewSpec.nextView = null; // the next view will be processed as an embedded view. It does not represent the actual nextView (in URL).
        }
        Trillo.deleteFromArray(nextViewSpecs, spec2);
        self._udpdateViewSpecs(spec2, viewSpec);
      });
      viewSpec.embeddedSpecs = embeddedSpecs;
    }

    return viewSpec;
  }
  
});

Trillo.ViewSpecFuncs = {
    
    initFromPath: function(path) {
      var idx = path.indexOf(":");
      if (idx >= 0) {
        this.trigger = path.substring(0, idx);
        this.name = path.substring(idx+1);
      } else {
        this.name = path;
      }
    },
    
    getMyPath: function() {
      return (this.trigger && this.trigger !== this.name ? (this.trigger + ":") : "") + this.name;
    },
    
    getTrigger: function() {
      return this.trigger ? this.trigger : this.name;
    },
    
    getNextPath: function(trigger) {
      if (!trigger || trigger.indexOf(":") >= 0) {
        return trigger;
      }
      var specs = this.nextViewSpecs;
      var res = trigger;
      if (specs) {
        $.each(specs, function( key, spec ) {
          if (spec.getTrigger() === trigger) {
            res = spec.getMyPath();
            return false;
          }
        });
      }
      return res; 
    },
    
    getDefaultNextPath: function() {
      if (this.nextView) {
        return this.getNextPath(this.nextView);
      }
      return null;
    },
    
    getViewFileName: function() {
      return this.viewFileName || this.name;
    },
    
    getViewSpecByParentPath: function(parentPath) {
      if (!parentPath) {
        return null;
      }
      var specs = this.nextViewSpecs;
      var res = null;
      if (specs) {
        $.each(specs, function( idx, spec ) {
          if (spec.parentPath === parentPath) {
            res = spec;
            return false;
          }
        });
      }
      return res; 
    },
    
    getNextViewSpecByPath: function(path) {
      return this.getNextViewSpecByTrigger(Trillo.getTriggerFromPath(path));
    },
    
    /* do deep search. Required for menu items. */
    getNextViewSpecByTrigger: function(trigger) {
      var res = this._getNextViewSpecByTrigger(this.nextViewSpecs, trigger);
      if (!res) {
        res = this._getNextViewSpecByTrigger(this.embeddedSpecs, trigger);
      }
      return res;
    },
    
    _getNextViewSpecByTrigger: function(l, trigger) {
      if (!l) {
        return null;
      }
      var res = null;
      var trigger2;
      var self = this;
      $.each(l, function( idx, spec ) {
        trigger2 = spec.trigger || spec.name;
        if (trigger2 === trigger) {
          res = spec;
          return false;
        } else if (spec.embedded || spec.autoLoad) { // a path may be due to an external view navigated from an embedded view.
          res = self._getNextViewSpecByTrigger(spec.nextViewSpecs, trigger);
          if (!res) {
            res = self._getNextViewSpecByTrigger(spec.embeddedSpecs, trigger);
          }
          if (res) {
            return false;
          }
        }
      });
      
      return res;
    },
    
    setParam: function(name, value) {
      this.params[name] = value;
    },
    
    getParam: function(name) {
      return this.params[name];
    },
    
    getParams: function() {
      return this.params;
    }
};

Trillo.getRouteSpecsFromRoute = function(route) {
  var routeSpecArr = [];
  
  if (!route || route.length === 0) {
    return routeSpecArr;
  }
  var sl = route.split("/");
  var subroute, spec;
  for (var i=0; i<sl.length; i++) {
    subroute = sl[i];
    spec = {
        name: Trillo.getRouteName(subroute),
        params: Trillo.getRouteParams(subroute)
    };
    if (spec.name) { // if route is simple page parameter then the spec.name will be ""
      routeSpecArr.push(spec);
    }
  }
  return routeSpecArr;
};

Trillo.getRouteName = function(subroute) {
  var idx = subroute.indexOf(";");
  if (idx >= 0) {
    return $.trim(subroute.substring(0,idx));
  }
  return subroute;
};

Trillo.getAppParams = function(route) {
  var idx = route.indexOf(";");
  if (idx === 0) {
    var sl = route.split("/");
    return Trillo.getRouteParams("a" + sl[0]);
  }
  return {};
};

Trillo.getRouteParams = function(subroute) {
  var idx = subroute.indexOf(";");
  if (idx >= 0) {
    subroute = subroute.substring(0,idx) + "?" + subroute.substring(idx+1);
  }
  return Trillo.queryStrToParams(subroute);
};

Trillo.queryStrToParams = function(queryStr) {
  if (!queryStr) {
    return {};
  }
  queryStr = queryStr.replace(/;/g, "&");
  return $.url(queryStr).param();
};

Trillo.getSubrouteAsStr = function(spec, includeQuery) {
  var str = spec.name;
  if (str.length === 0) return "";
  if (includeQuery) {
    var query = Trillo.getQueryStr(spec);
    str += (query.length ? ";"  + query : "");
  }
  return str;
};

Trillo.getQueryStr = function(spec) {
  var query = "";
  if (spec.params) {
    $.each(spec.params, function(key, value) {
      if (key.indexOf("__") !== 0) { // a param's name starting with "_" is not stored in the history
        query = (query.length ? ";" : "") + (key + "=" + value);
      }
    }); 
  }
  return query;
};

// inclusive 'index'
Trillo.getRouteUptoIndex = function(routeSpecArr, idx, includeQuery) {
  if (idx < 0) {
    return "";
  }
  var str = "";
  for (var i=0; i<=idx; i++) {
    str += (i > 0 ? "/" : "") + Trillo.getSubrouteAsStr(routeSpecArr[i], includeQuery);
  }
  return str;
};

Trillo.getFullPath = function(parentPath, lastPath) {
  return (parentPath ? parentPath + "/" : "") + lastPath;
};
Trillo.BaseController = Class.extend({
  
  initialize: function(viewSpec) {
    this.viewSpec = viewSpec;
    this.name = viewSpec.name;
    this._view = null;
    this._model = null;
    this._parentController = null;
    this._nextController = null;
    this._embeddedControllers = [];
    this._bizDelegate = null;
    this.viewsInFlight = {};
  },
  
  setView: function(view) {
    this._view = view;
  },
  
  view: function() {
    return this._view;
  },
  
  parentView: function() {
    return this._view.parentView();
  },
  
  setBizDelegate: function(_bizDelegate) {
    this._bizDelegate = _bizDelegate;
  },
  
  bizDelegate: function() {
    return this._bizDelegate;
  },
  
  model: function() {
    return this._model;
  },
  
  apiAdapter: function() {
    return this._apiAdapter;
  },
  
  modelData: function() {
    return this._model.data;
  },
  
  parentModel: function() {
    return this._parentController ? this._parentController.model() : null;
  },
  
  parentModelData: function() {
    return this._parentController ? this._parentController.modelData() : null;
  },
  
  setParentController: function(parentController) {
    this._parentController = parentController;
  },
  
  parentController: function() {
    return this._parentController;
  },
  
  setNextController: function(controller) {
    this._nextController = controller;
  },
  
  addEmbeddedController: function(embeddedController) {
    this._embeddedControllers.push(embeddedController);
  },
  
  removeEmbeddedController: function(embeddedController) {
    this._embeddedControllers.splice(this._embeddedControllers.indexOf(embeddedController), 1);
  },
  
  clear: function() {
  },
  
  createModel: function(modelSpec, apiSpec) {
    var promise;
    var myDeferred = $.Deferred();
    
    debug.debug("BaseController.createModel() - creating new model for: " + this.viewSpec.name);
    if (this._model) {
      this._model.clear();
    }
    this._model = Trillo.modelFactory.createModel(modelSpec, this);
    if ((!apiSpec && Trillo.supportsTestData(this.viewSpec.type)) && (Trillo.isPreview || Trillo.useTestData)) {
      this._apiAdapter = new Trillo.TestDataAdapter(apiSpec, this);
      promise = this._apiAdapter.loadData(this.viewSpec.name);
      promise.done($.proxy(this.modelDataLoaded, this, myDeferred));
      promise.fail(function(result) {
        myDeferred.reject(result);
      });
    } else if (apiSpec) {
      this._apiAdapter = Trillo.apiAdapterFactory.createApiAdapter(apiSpec, this);
      promise = this._apiAdapter.loadData();
      promise.done($.proxy(this.modelDataLoaded, this, myDeferred));
      promise.fail(function(result) {
        myDeferred.reject(result);
      });
    } else {
      this._model.updateData(this.getModelData(modelSpec));
      this.modelDataLoaded(myDeferred);
    }
    return myDeferred.promise();
  },
  
  isModelDataChanged: function() {
    if (!this.model()) {
      return true;
    }
    if (this.apiAdapter()) {
      return this.apiAdapter().isApiSpecChanged(this.viewSpec.apiSpec);
    }
    var currentData = this.modelData();
    var newData = this.getModelData(this.viewSpec.modelSpec);
    return currentData !== newData;
  },
  
  getModelData: function(modelSpec) {
    if (modelSpec.data) {
      return modelSpec.data; // data can be specified in the modelSpec. This is static/ fixed data (derived from meta data).
    }
    // This method returns model's data based on rules applicable in most common scenario.
    // Override this method is controller to return model data based on some other rule/ logic.
    
    // Rule 1: return parent selected data if parent is tree or collection and selected obj's uid is -1
    var parentSelectedObj = this.getParentSelectedObj();
    if (parentSelectedObj && Trillo.uidToId(parentSelectedObj.uid) === "-1") {
      var parentViewType = this.parentView().viewSpec.type;
      if (parentViewType === Trillo.ViewType.Tree || Trillo.isCollectionView(parentViewType)) {
        // an object with -1 uid is selected in the tree or collection view. Use it as as the data for this model
        // This is probably a newly created data and does not exists in the server.
        return parentSelectedObj;
      }
    }
    
    // Rule 2: if "dataPath" is specified, look up data using it with respect to parent selected obj or parent data.
    var parentContextData = this.getParentSelectedObj() || this.parentModelData();
    var data = null;
    if (parentContextData && modelSpec.dataPath) {
      data = Trillo.getObjectValue(parentContextData, modelSpec.dataPath);
      if (data) {
        return data;
      } else {
        data = this.makeDefaultModelData();
        if (data) {
          Trillo.setObjectValue(parentContextData, modelSpec.dataPath, data);
          return data;
        }
      } 
    }
   
    // Rule 3: call makeDefaultModelData
    data = this.makeDefaultModelData();
    if (data) {
      return data;
    } else {
      // Rule 4: there is not "dataPath" and this is an embedded rule, it is probably part or parent view (included from
      // a different file to increase its reuse). Treat it like a part of parent and use parent data.
      if (!modelSpec.dataPath && this.viewSpec.embedded) {
        // use parent context data
        return parentContextData;
      }
    }
    
    // return empty object
    return {};
  },
  
  makeDefaultModelData: function() {
    var type = this.viewSpec.type;
    if (Trillo.isCollectionView(type) || Trillo.isTreeView(type)) {
      return [];
    } else if (Trillo.isDetailView(type) || Trillo.isFormView(type)) {
      return {};
    } else {
      return null;
    }
  },
  
  modelDataLoaded: function(myDeferred) {
    this.postProcessModel(this._model);
    myDeferred.resolve(this._model);
  },
  
  postProcessModel: function(model) {
    
  },
  
  handleClickGeneric: function($e) {
    if ($e) {
      var actionFunc = $e.dataOrAttr("action-func");
      if (actionFunc && this[actionFunc]) {
        this[actionFunc]($e, this.getSelectedObj(), this);
        return true;
      }
    }
    if (this._handleClickGeneric($e.dataOrAttr("nm"), $e, this.getSelectedObj(), this)) {
      return true;
    }
    var actionName = $e.dataOrAttr("nm");
    if (actionName && actionName !== "_home" && actionName !== "_appHome") {
      var href = $e.attr("href");
      if (!href || href === "#") {
        Trillo.alert.notYetImplemented(actionName);
      }
    }
    return false;
  },
  
  _handleClickGeneric: function(actionName, $e, selectedObj, targetController) {
    var f = false;
    if (this._bizDelegate && this._bizDelegate.handleAction) {
      if (this._bizDelegate.handleAction(actionName, selectedObj, $e, targetController)) {
        return true;
      }
    }
    if (this.handleAction(actionName, selectedObj, $e, targetController)) {
      f = true;
    } else if (this.delegateActionToParent(actionName, selectedObj, $e, targetController)) {
      f = true;
    }
    return f;
  },
  
  handleAction: function(actionName, selectedObj, $e, targetController) {
    
  },
  
  delegateActionToParent: function(actionName, selectedObj, $e, targetController) {
    if (this.parentController()) {
      return this.parentController()._handleClickGeneric(actionName, $e, selectedObj, targetController);
    } 
    return false;
  },
  
  /** Called by BizDelegate when it completes a delegated action 
   * options - may contain any app specific data such as original parameters, result of action etc.
   */
  actionDone: function(options) {
   
  },
  
  getSelectedObj: function() {
    return this._view ? this._view.getSelectedObj() : null;
  },
  
  getParentSelectedObj: function() {
    var pc = this.parentController();
    return pc ? pc.getSelectedObj() : null;
  },
  
  getClosestSelectedObj: function() {
    var res = this.getSelectedObj();
    if (!res) {
      var p = this.parentController();
      res = p ? p.getClosestSelectedObj() : null;
    }
    return res;
  },
  
  canSelectionChange: function(newObjOrName) {
    return true;
  },
  
  selectionChanging: function(newObjOrName) {
  },
  
  selectedObjChanged: function(selectedObj) {
    // custom controllers can take some action by overriding this method.
  },

  /*
   * The difference between updateViewSpec & updateChildViewSpec is that
   * "updateViewSpec" is called on controller by builder for its owner controller.
   * "updateChildViewSpec" is called due to propagation by the owner or one of its parent.
   * "updateChildViewSpec" is particularly useful for letting parent update the viewSpec (which is useful
   * if parent needs to update its parameter list or preserve parameter list when navigating across peer.
   * All such decisions are business logic specific.)
   */
  updateViewSpec: function(viewSpec) {
    if (this.parentController()) {
      return this.parentController().updateChildViewSpec(viewSpec);
    }
  },
  
  updateChildViewSpec: function(viewSpec) {
    // only one level up, custom class is responsible for anything beyond it.
  },
  
  
  routeToSelectedView: function(viewName) {
    this.updateRoute(viewName);
  },
  
  getSelected$Elem: function() {
    return this._view.getSelected$Elem();
  },
  
  getSelectedItem: function() {
    return this._view.getSelectedItem();
  },
  
  selectedItemChanged: function(newObjOrName) {
  },
  
  setParam: function(name, value) {
    this.viewSpec.setParam(name, value);
    this.updateRoute();
  },
  
  getParam: function(name) {
    return this.viewSpec.getParam(name);
  },
  
  getParams: function() {
    return this.viewSpec.getParams();
  },
  
  getRouteUpTo: function(includeQuery, skipIfDefault) {
    if (!this.viewSpec.isAppView) {
      var pc = this.parentController();
      var route = pc ? pc.getRouteUpTo(includeQuery) : "";
      var parentNextView = pc ? pc.viewSpec.nextView : null;
      if (!this.viewSpec.embedded && !this.viewSpec.autoLoad) {
        var str = this.getMySubrouteAsStr(includeQuery);
        if (!skipIfDefault || str !== parentNextView) {
          route = route + (str.length > 0 && route.length > 1 ? "/" : "") + str;
        }
      }
      return route;
    }
    return Trillo.Config.pagePath;
  },
  
  getInternalRoute: function() {
    return "";
  },
  
  getMySubrouteAsStr: function(includeQuery) {
    var viewSpec = this.viewSpec;
    if (!viewSpec) return "";
    var str = viewSpec.getMyPath() + this.getInternalRoute();
    if (str.length === 0) return "";
    if (includeQuery) {
      var query = "";
      $.each(viewSpec.params, function(key, value) {
        query += (query.length ? ";" : "") + (key + "=" + value);
      });
      str += (query.length ? ";"  + query : "");
    }
    return str;
  },
  
  setRoute: function(route) {
    Trillo.router.routeTo(route, true);
  },
  
  selectAndRoute: function(uid) {
    // implement in subclass
  },

  updateRoute: function(lastSegement) {
    var route = this.getRouteUpTo(true);
    if (lastSegement) {
      route += (route.length ? "/" : "") + lastSegement;
    }
    Trillo.router.routeTo(route, true);
  },
  
  // Generally, the two parameters that control the display of a view are - a) its context (for example 
  // a parent view which is using it); b) what is the current user selection (for example a row).
  // If the current selection is available and it is uid then it is give preference.
  // "sel" is also used for other selection such as tab name etc therefore a check is made
  // if it is "uid" before preferring it.
  getSelectionUidOrContextUid: function() {
    var uid = this.getParam("sel");
    if (!uid || !Trillo.isUid(uid)) {
      uid = this.getParam("uid");
    }
    if (!uid) {
      var p = this.parentController();
      uid = p ? p.getSelectionUidOrContextUid() : null;
    }
    return uid;
  },
  
  // returns context-uid of this view or
  // selection (sel) or context uid in hierarchy.
  getContextUid: function() {
    var uid = this.getParam("uid");
    if (!uid) {
      var p = this.parentController();
      uid = p ? p.getSelectionUidOrContextUid() : null;
    }
    return uid;
  },
  
  updateModelSpec: function(modelSpec) {
    
  },

  showView: function(viewSpec) {
    var myDeferred = $.Deferred();
    if (this.viewsInFlight[viewSpec.name]) {
      myDeferred.reject();
      return myDeferred.promise();
    }
    this.viewsInFlight[viewSpec.name] = viewSpec;
    viewSpec.params = viewSpec.params || {};
    viewSpec.embedded = true;
    var self = this;
    Trillo.builder.init(viewSpec, null, this._view).done(function(view) {
      if (view && view.postSetup) {
        view.postSetup(view);
      }
      self.viewsInFlight[viewSpec.name] = null;
      myDeferred.resolve(view);
    });
    
    return myDeferred.promise();
  },
  
  showViewByName: function(name, obj, options) {
    var viewSpec = {name: name, options : options};
    if (obj) {
      viewSpec.modelSpec = {
          data: obj
      };
    }
    return this.showView(viewSpec);
  },
  
  /** Requires this._super call */
  postViewShown: function(view) {
    var p = this.parentController();
    if (p) {
      p.postViewShown(view);
    }
  },
  
  postSetup: function(view) {
  },
  
  viewByName: function(name) {
    var controller = this.controllerByName(name);
    return controller ? controller.view() : null;
  },
  
  controllerByName: function(name) {
    var controller = this.findControllerByNameNextDir(name);
    if (controller) {
      return controller;
    }
    return this.findControllerByNamePrevDir(name);
  },
  
  findControllerByNameNextDir: function(name) {
    if (this.name === name) {
      return this;
    }
    for (var i=0; i<this._embeddedControllers.length; i++) {
      var controller = this._embeddedControllers[i].findControllerByNameNextDir(name);
      if (controller) {
        return controller;
      }
    }
    if (this._nextController) {
      return this._nextController.findControllerByNameNextDir(name);
    }
  },
  
  findControllerByNamePrevDir: function(name) {
    if (this.name === name) {
      return this;
    }
    if (this._parentController) {
      return this._parentController.findControllerByNamePrevDir(name);
    }
  },
  
  attrChanged: function(obj, name, value, oldValue, model) {
    var p = this.parentController();
    if (p) {
      p.attrChanged(obj, name, value, oldValue, model);
    }
  },
  
  objChanged: function(obj) {
    this._view.objChanged(obj);
    var p = this.parentController();
    if (p) {
      p.objChanged(obj);
    }
  },
  
  objAdded: function(newObj, atEnd) {
    this._view.objAdded(newObj, atEnd);
    var p = this.parentController();
    if (p) {
      p.objAdded(newObj, atEnd);
    }
  },
  
  objDeleted: function(obj) {
    this._view.objDeleted(obj);
    var p = this.parentController();
    if (p) {
      p.objDeleted(obj);
    }
  },
  
  modelDataChanged: function(model) {
    this._view.modelDataChanged(model);
    var p = this.parentController();
    if (p) {
      p.modelDataChanged(model);
    }
  },
  
  refreshAllViews: function(lisOfViews) {
    // implemented by subclass
  },
  
  refreshViews: function(lisOfViews) {
    // implemented by subclass
  },
  
  /** Requires this._super call */
  updateTbState: function(selectedObj) {
    // this can be overridden by custom controllers to update tools state.
    if (this._bizDelegate && this._bizDelegate.updateTbState) {
      this._bizDelegate.updateTbState(selectedObj);
    }
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
  showResult: function(result) {
    if (result.status === "failed") {
      Trillo.alert.showError("Error", result.message || result.status);
    } else {
      Trillo.alert.show("Success", result.message || result.status);
    }
  },
  
  getAppRootElem: function() {
    if (this._parentController) {
      return this._parentController.getAppRootElem();
    }
    return this._view.$elem();
  },
  
  /** Requires this._super call */
  showNamedMessagesAsError: function(messages) {
  },
  
  updateTitle: function() {
  },
  
  changeManagerUpdated: function(undoLen, redoLen) {
  },
  
  undoing: function(change, firstInTx) {
  },
  
  redoing: function(change, firstInTx) {
  },
  
  undone: function(change, firstInTx) {
  },
  
  redone: function(change, firstInTx) {
  },
  
  undoCompleted: function() {
  },
  
  redoCompleted: function() {
  },
  
  txStarted: function() {
  },
  
  txEnding: function() {
  },
  
  txEnded: function() {
  },
  
  beforeShowContextMenu: function() {
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
      var promise = Trillo.builder.buildAppView(route);
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
        listOfViews[0].postSetup(listOfViews[0]);
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
        return view.viewSpec.getDefaultNextPath();
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
      Trillo.popoverManager.hideCurrentPopup();
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
    var target = this._view.controller().viewByName(option.targetViewName);
    if (target) {
      target.controller().fileUploadSuccessful(option);
    }
  },
  
  fileUploadFailed: function(option) {
    // one of the property of option is targetViewName. Look up target view and inform it.
    var target = this._view.controller().viewByName(option.targetViewName);
    if (target) {
      target.controller().fileUploadFailed(option);
    }
  },
  
  viewByName: function(name) {
    return this._view ? this._view.controller().viewByName(name) : null;
  },
  
  controllerByName: function(name) {
    return this._view ? this._view.controller().controllerByName(name) : null;
  },
  
  layoutContainers2: function() {
    if (this._view) {
      this._view.layoutContainers2();
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
        url: "/loadCatalogs?appName=" + Trillo.appName,
        type: 'get',
        datatype : "application/json"
      }).done($.proxy(this.catalogsLoaded, this, deferred)).
      fail(function() {
        deferred.reject({
          errorMsg: "Failed to load catalogs"
        });
      });
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

Trillo.BizDelegate = Class.extend({
 
  initialize : function(options) {
    this._controller = options.controller;
  },
  
  controller: function() {
    return this._controller;
  },
  
  informActionDone: function(options) {
    if (this._controller && this._controller.actionDone) {
      this._controller.actionDone(options);
    }
  },
  
  handleAction: function(actionName, selectedObj, $e, targetController) {
    return false;
  }
});

Trillo.Main = Class.extend({
  initialize : function() {
    
    Trillo.hideBusy();
    
    this.setupContextAndConfig();
    
    var initClassName = Trillo.appContext.page.appInitClass || "Trillo.AppInitializer";
    
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
    
    if (!Trillo.appContext.page) {
      Trillo.appContext.page = {
        name : "",
        appInitClass: "Trillo.AppInitializer"
      };
    }
    
    Trillo.appName = Trillo.appContext.appName;
    Trillo.orgName = Trillo.appContext.orgName;
    Trillo.pageName = Trillo.appContext.pageName || Trillo.appContext.appName;
    Trillo.appNamespace = window[Trillo.appName];
    Trillo.isPreview = !!$.url(location.href).param("preview");
    Trillo.useTestData = !!Trillo.appContext.page.useTestData;
    
    if (!(Trillo.Config.basePath)) {
      Trillo.Config.basePath = Trillo.appContext.basePath ? ("/" + Trillo.appContext.basePath) : "/";
    }
    
    if (!(Trillo.Config.pagePath)) {
      Trillo.Config.pagePath = Trillo.appContext.pagePath ? ("/" + Trillo.appContext.pagePath) : Trillo.Config.basePath;
    }
    
    if (!(Trillo.Config.viewPath)) {
      Trillo.Config.viewPath = Trillo.appContext.isTrilloServer ? ("/view/" + Trillo.appName + "/") : 
        (Trillo.Config.basePath === "/" ? "/view/" : Trillo.Config.basePath + "/view/");
    }
    
    if (!Trillo.appContext.isTrilloServer && 
        (!(Trillo.Config.viewFileExtension) || Trillo.Config.viewFileExtension === "")) {
      Trillo.Config.viewFileExtension = ".html";
    }
    
    $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
      var $this = $(this);
      $(".js-navbar-toggle:not([data-target='" + $this.data("target") + "'])").each(function () {
          $($(this).data("target")).removeClass("in").addClass('collapse');
      });
    });
  }

});


Trillo.startApp = function() {
  new Trillo.Main();
};

$(document).ready(function() {
  Trillo.startApp();
});
