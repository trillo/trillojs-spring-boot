/*!
 * TrilloJS v0.5.0 (https://github.com/trillo/trillojs#readme)
 * Copyright 2016 Collager Inc.
 * Licensed under the MIT license
 */
Trillo.Controller = Trillo.BaseController.extend({
  
  initialize: function(viewSpec) {
    this._super(viewSpec);
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
  
  handleAction: function(actionName, obj, view) {
    if (this.actionH) {
      if (this.actionH.handleAction(actionName, obj, view)) {
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
      return this.doDefaultDetailView(obj);
    } else if (actionName === 'upload') {
      this.doUpload();
      return true;
    }
    return false;
  },
  
  close: function() {
    this._view.clear();
  },
  
  ok: function() {
    if (this.viewSpec.type === Trillo.ViewType.Form) {
      this.submitForm();
    }
  },
  
  doDefaultDetailView: function(obj) {
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
  }
  
});
Trillo.Tools = Class.extend({
  initialize : function(options) {
    this.$toolsE = options.$toolsE;
    this.$toolsContainer = options.$toolsContainer;
    this.toolSelectedMethod = $.proxy(this.toolSelected, this);
  },
  activate: function(ah) {
    this.actionHandler = ah;
    if (this.$toolsContainer) {
      this.$toolsContainer.append(this.$toolsE);
    }
    this.$toolsE.show();
    this.$toolsE.off("click", this.toolSelectedMethod);
    this.$toolsE.on("click", this.toolSelectedMethod);
  },
  clear: function(mgr) {
    this.actionHandler = null;
    this.$toolsE.off("click", this.toolSelectedMethod);
    this.$toolsE.hide();
    if (this.$toolsContainer) {
      this.$toolsE.remove();
    }
  },
  toolSelected: function(ev) {
    Trillo.contextMenuManager.hideCurrentContextMenu();
    var $e = $(ev.target);
    var tag = $e.prop("tagName").toLowerCase();
    if (tag !== "a" && tag !== "button") {
      var $e2 = $e.find("button");
      if ($e2.length === 0) {
        $e2 = $e.find("a");
      }
      if ($e2.length === 0) {
        $e2 = $e.parent();
        tag = $e2.prop("tagName").toLowerCase();
        if (tag !== "a" && tag !== "button") {
          return;
        }
      }
      $e = $e2;
    }
   
    if ($e.hasClass("dropdown-toggle")) {
      return;
    }
    if (ev) {
      ev.stopPropagation();
      ev.preventDefault();
    }
    $e.closest("." + Trillo.CSS.buttonGroup + "." + Trillo.CSS.buttonGroupOpen).removeClass(Trillo.CSS.buttonGroupOpen);
    $e.closest("." + Trillo.CSS.dropdown + "." + Trillo.CSS.dropdownOpen).removeClass(Trillo.CSS.dropdownOpen);
    this.actionHandler.actionPerformed($e.attr("nm"), $e);
  },
  
  setDisabled: function(disabled) {
    if (disabled) {
      this.$toolsE.find("button").attr("disabled", true);
      this.$toolsE.find("a").attr("disabled", true);
    } else {
      this.$toolsE.find("button").removeAttr("disabled");
      this.$toolsE.find("a").removeAttr("disabled");
    }
  }
});


Trillo.ToolManager = Class.extend({
  initialize : function(view) {
    this._view = view;
    this._controller = view.controller();
    this.$toolbarTools = null;
    this.$hoverTools = null;
    this.$contextTools = null;
    this.tools = [];
  
    var $e = view.$elem();
    
    var $te, t;
    if (view.$container()) {
      var $tce = view.getToolBar$Elem();
      if ($tce.length > 0) {
        $te = $e.find(".js-toolbar-tools");
        if (this.belongsToView($te)) {
          $te.attr("for-view", view.name);
          $te.remove();
          this.$toolbarTools = $te;
          t = new Trillo.Tools({$toolsE : $te, $toolsContainer : $tce});
          this.tools.push(t);
        }
      }
    }
   
    $te = $e.find(".js-tool");
    if (this.belongsToView($te)) {
      $te.attr("for-view", view.name);
      t = new Trillo.Tools({$toolsE : $te});
      this.tools.push(t);
    }
    
    $te = $e.find(".js-hover-tools");
    if (this.belongsToView($te)) {
      $te.attr("for-view", view.name);
      $te.remove();
      this.$hoverTools = $te;
      t = new Trillo.Tools({$toolsE : $te});
      this.tools.push(t);
    }
   
    $te = $e.find(".js-context-menu");
    if (this.belongsToView($te)) {
      $te.attr("for-view", view.name);
      $te.remove();
      this.$contextTools = $te;
      t = new Trillo.Tools({$toolsE : $te});
      this.tools.push(t);
    }
  },
  
  belongsToView: function($te) {
    // an element, that has "for-view" attribute, is matched with the view name.
    // if it does not have "for-view" attr or the value of attr is same as the view name then
    // the element belongs to this view.
    if ($te.length === 0) {
      return false;
    }
    var temp = $te.attr("for-view");
    return !temp || temp === this._view.name;
  },
  
  activate: function() {
    var tools = this.tools;
    for (var i=0; i<tools.length; i++) {
      tools[i].activate(this);
    }
    this.setTbState(null);
    this._controller.postToolsActivate();
  },
  
  clear: function(ah) {
    var tools = this.tools;
    for (var i=0; i<tools.length; i++) {
      tools[i].clear(this);
    }
  },
  
  actionPerformed: function(actionName, $e) {
    return this._controller.actionPerformed(actionName, $e);
  },
  
  setTbState: function(obj) {
    var tools = this.tools;
    var disabled = obj && obj.availabilityState === Trillo.OBJ_LOCKED;
    var i;
    for (i=0; i<tools.length; i++) {
      Trillo.findAndSelf(tools[i].$toolsE, '[data-for-class]').hide();
      tools[i].setDisabled(disabled);
    }
    if (obj) {
      var cls = Trillo.uidToClass(obj.uid);
      if (cls) {
        for (i=0; i<tools.length; i++) {
          Trillo.findAndSelf(tools[i].$toolsE, '[data-for-class="' + cls + '"]').show();
        }
      }
      for (i=0; i<tools.length; i++) {
        if (tools[i].$toolsE.is(':not([data-for-class])') && !tools[i].$toolsE.is('.js-context-menu')) {
          tools[i].$toolsE.show();
        }
      }
    }
    this._controller.updateTbState(obj);
  },
 
  showContextMenu: function(x, y) {
    if (this.$contextTools) {
      Trillo.contextMenuManager.showContextMenu(this.$contextTools, x, y);
      return true;
    }
    return false;
  },
  
  setToolVisible: function(name, visible) {
    var selector = '[nm="' + name + '"]';
    this.setToolVisibleBySelector(selector, visible);
  },
  
  setToolVisibleBySelector: function(selector, visible) {
    var tools = this.tools;
    var i;
    if (visible) {
      for (i=0; i<tools.length; i++) {
        tools[i].$toolsE.find(selector).show();
      }
    } else {
      for (i=0; i<tools.length; i++) {
        tools[i].$toolsE.find(selector).hide();
      }
    }
  },
  
  removeToolsWithInElement: function() {
    var tools = this.tools;
    var newTools = [];
    for (var i=0; i<tools.length; i++) {
      if (tools[i].$toolsE.hasClass(".js-tool")) {
        tools[i].clear(this);
      } else {
        newTools.push(tools[i]);
      }
    }
    this.tools = newTools;
  },
  
  addToolsWithInElement: function($e) {
    var $te = $e.find(".js-tool");
    if (this.belongsToView($te)) {
      var t = new Trillo.Tools({$toolsE : $te});
      this.tools.push(t);
      return t;
    }
    return null;
  }
  
});



/* globals Mustache */
Trillo.InfoElementRepo = Class.extend({
  initialize : function() {
    this.table = {}; // template element by elemKey
    this.tableOfList = {}; // elements created using template and available for use
  },
  addTemplate: function($e, elemKey, hasTemplateTag) {
    $e.show();
    this.table[elemKey] = new Trillo.InfoElement(elemKey, $e, true, hasTemplateTag);
  },
  getE: function(elemKey, obj) {
    var l = this.tableOfList[elemKey];
    if (l && l.length > 0) {
      return l.pop();
    }
   
    var infoE = this.table[elemKey];
    if (!infoE) {
      return null; 
    }
    
    return infoE.copyIt(obj);
  },
  releaseE: function(infoE) {
    if (infoE.useTemplate) {
      return; // info blocks using template need to recreated therefore do not save them.
    }
    var l = this.tableOfList[infoE.elemKey];
    if (!l) {
      this.tableOfList[infoE.elemKey] = l = [];
    }
    l.push(infoE);
    infoE.clear();
  },
  makeInfoBlockList: function(elemKey, l, canvas) {
    var infoE = this.table[elemKey];
    if (!infoE) {
      return null; 
    }
    if (infoE.requiresPositioning) {
      return this.makePositionedInfoBlockList(infoE, elemKey, l, canvas);
    } else {
      return this.makeAutoInfoBlockList(infoE, elemKey, l, canvas);
    }
  },
  makePositionedInfoBlockList: function(infoE, elemKey, l, canvas) {
    var infoBlock;
    var res = [];
    infoE.$rootE.addClass(Trillo.CSS.positionOutside);
    document.body.appendChild(infoE.e);
    var maxH = 0;
    var h;
    var i;
    for (i=0; i<l.length; i++) {
      if (l[i]._trillo_infoBlock) {
        continue;
      }
      infoBlock = new Trillo.InfoBlock(elemKey, l[i], canvas);
      //infoE.$rootE.height("auto"); //setting auto computes incorrect height
      infoE.show(l[i]);
      h = infoBlock.h = infoE.$rootE.outerHeight();
      if (h > maxH) {
        maxH = h;
      }
      infoBlock.w = infoE.$rootE.outerWidth();
      res.push(infoBlock);
      l[i]._trillo_infoBlock = infoBlock;
      infoE.clear();
    }
    if (canvas.areAllSameSize) {
      for (i=0; i<res.length; i++) {
        res[i].h = maxH;
      }
    }
    infoE.$rootE.removeClass(Trillo.CSS.positionOutside);
    infoE.clear();
    document.body.removeChild(infoE.e);
    return res;
  },
  makeAutoInfoBlockList: function(infoE, elemKey, l, canvas) {
    var infoBlock;
    var res = [];
   
    for (var i=0; i<l.length; i++) {
      if (l[i]._trillo_infoBlock) {
        continue;
      }
      infoBlock = new Trillo.InfoBlock(elemKey, l[i], canvas);
      res.push(infoBlock);
      l[i]._trillo_infoBlock = infoBlock;
    }
    return res;
  },
  
  requiresLayout: function(elemKey) {
    var infoE = this.table[elemKey];
    return infoE && infoE.requiresPositioning;
  }
});

Trillo.InfoElement = Class.extend({
  /**
   * @param elemKey - unique key for the template
   * @param $rootE - jquery object for the element
   * @param isTemplate - if true it means it is constructing an object that will be used as template to create 
   *                     more objects with similar element
   * @param hasTemplateTag - indicates if the element's html has mustache tags ({{...}}). If it has tags then 
   *                         a different logic is used to construct new elements.
   */
  initialize : function(elemKey, $rootE, isTemplate, hasTemplateTag) {
    this.$rootE = $rootE;
    this.elemKey = elemKey;
    this.e = $rootE[0];
    this.elements = [];
    this.elClasses = [];
    this.hasTemplateTokens = false;
    this.requiresPositioning = true;
    this.requiresClickEvent = true;
    if (isTemplate) {
      if (hasTemplateTag) {
        debug.debug("Trillo.InfoElement - parsing using Mustache");
        var html = $rootE[0].outerHTML;
        var tokens = Mustache.parse(html);
        // tokens .length === 1 means that entire template is one token and there is no mustache directive ({{...}}) present.
        if (tokens.length > 1) {
          debug.debug("Trillo.InfoElement - requires template processing while doing copyIt");
          this.templateHtml = html;
          this.useTemplate = true;
        } else {
          debug.debug("Trillo.InfoElement - no template processing needed");
        }
      } else {
        debug.debug("Trillo.InfoElement - no template parsing done");
      }
      $rootE.hide();
      document.body.appendChild($rootE[0]);
      var temp = $rootE.css("position");
      document.body.removeChild($rootE[0]);
      $rootE.show();
      this.requiresPositioning = temp && temp.toLowerCase() === "absolute";
      temp =  $rootE.prop("tagName") ;
      if (temp.toLowerCase() === "a") {
        temp = $rootE.prop("href");
        this.requiresClickEvent = !temp || temp === "" || temp === "#";
      }
    }
    var el = this.e.getElementsByTagName("*");
    var e;
    for (var i=0; i<el.length; i++) {
        e = el[i];
        if (e.getAttribute("nm")) {
          this.elements.push(e);
        }
    }
    this.$inputs = Trillo.getInputs($rootE);
  },
  show: function(obj) {
    var $e, el = this.elements, n = el.length, name;
    for (var i=0; i<n; i++) {
      $e = $(el[i]);
      name = $e.attr("nm");
      Trillo.setFieldValue($e, obj[name], false);
    }
  },
  clear: function() {
    var e, el = this.elements, n = el.length;
    for (var i=0; i<n; i++) {
      e = el[i];
      if (this.elClasses[i]) {
        $(e).removeClass(this.elClasses[i]);
        this.elClasses[i] = null;
      } else {
        e.innerHTML = "";
      }
    }
  },
  copyIt: function(obj) {
    var $e;
    if (this.useTemplate) {
      var newHtml = Mustache.render(this.templateHtml, obj);
      $e = $('<div/>').html(newHtml).contents();
    } else {
      $e = this.$rootE.clone();
    }
    var infoE = new Trillo.InfoElement(this.elemKey, $e, false);
    infoE.useTemplate = this.useTemplate;
    infoE.requiresPositioning = this.requiresPositioning;
    infoE.requiresClickEvent = this.requiresClickEvent;
    return infoE;
  }
});

Trillo.InfoBlock = Class.extend({
  initialize : function(elemKey, obj, canvas) {
    this.elemKey = elemKey;
    this.obj = obj;
    this.canvas = canvas;
    this.x = 0;
    this.y = 0;
    this.h = -1;
    this.w = -1;
    this.infoE = null;
    this.clickHandler = $.proxy(this.clicked, this);
    this.dblClickHandler = $.proxy(this.dblClicked, this);
    this.contextMenuHandler = $.proxy(this.onContextMenu, this);
    if (canvas.supportsHoverTools) {
      this.mouseOverHandler = $.proxy(this.mouseOver, this);
      this.mouseLeaveHandler = $.proxy(this.mouseLeave, this);
    }
    this.changeHandler = $.proxy(this.fieldChanged, this);
  },
  
  show: function() {
    var infoE = this.infoE;
    if (!infoE) {
      this.infoE = infoE = Trillo.infoElementRepo.getE(this.elemKey, this.obj);
      if (infoE.requiresPositioning) {
        this.infoE.$rootE.css("min-height", this.h + "px");
      }
      infoE.show(this.obj);
    }
    if (infoE.requiresPositioning) {
      infoE.$rootE.css({ left: this.x, top: this.y});
    }
    this.canvas.canvasE.appendChild(infoE.e);
    if (infoE.requiresClickEvent) {
      infoE.$rootE.off("click", this.clickHandler);
      infoE.$rootE.on("click", this.clickHandler);
      infoE.$rootE.off("dblclick", this.dblClickHandler);
      infoE.$rootE.on("dblclick", this.dblClickHandler);
    }
    infoE.$rootE.off("contextmenu", this.contextMenuHandler);
    infoE.$rootE.on("contextmenu", this.contextMenuHandler);
    if (this.mouseOverHandler) {
      infoE.$rootE.off("mouseover", this.mouseOverHandler);
      infoE.$rootE.on("mouseover", this.mouseOverHandler);
    }
    if (infoE.$inputs.length > 0) {
      infoE.$inputs.off("change", this.changeHandler);
      infoE.$inputs.on("change", this.changeHandler);
    }
    if (this.canvas.postRenderer) {
      this.canvas.postRenderer(this);
    }
  },
  
  refresh: function() {
    if (this.infoE) {
      this.infoE.show(this.obj);
      if (this.canvas.postRenderer) {
        this.canvas.postRenderer(this);
      }
    }
  },
  
  hide: function() {
    var infoE = this.infoE;
    if (infoE) {
      if (infoE.requiresClickEvent) {
        infoE.$rootE.off("click", this.clickHandler);
        infoE.$rootE.off("dblclick", this.dblClickHandler);
      }
      infoE.$rootE.off("contextmenu", this.contextMenuHandler);
      if (this.mouseOverHandler) {
        infoE.$rootE.off("mouseover", this.mouseOverHandler);
        infoE.$rootE.off("mouseleave", this.mouseLeaveHandler);
      }
      Trillo.infoElementRepo.releaseE(infoE);
      if (this.canvas.selected === this) {
        this.canvas.unselectInfoItem(this);
      }
      if (infoE.$inputs.length > 0) {
        infoE.$inputs.off("change", this.changeHandler);
      }
      this.infoE = null;
    }
  },
  setPosition: function(x, y) {
    this.x = x;
    this.y = y;
  },
  move: function(dx, dy) {
    this.x += dx;
    this.y += dy;
  },
  clicked: function(ev) {
    Trillo.contextMenuManager.hideCurrentContextMenu();
    if (ev && !$(ev.target).is(":input")) {
      ev.stopPropagation();
    }
    this.canvas.clicked(this);
  },
  dblClicked: function(ev) {
    Trillo.contextMenuManager.hideCurrentContextMenu();
    if (ev && !$(ev.target).is(":input")) {
      ev.stopPropagation();
    }
    this.canvas.dblClicked(this);
  },
  onContextMenu : function(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    this.canvas.doContextMenu(this, ev.pageX, ev.pageY);
  },
  select: function() {
    if (this.infoE ) {
      this.infoE.$rootE.addClass(Trillo.CSS.selected);
    }
  },
  unselect: function() {
    if (this.infoE ) {
      this.infoE.$rootE.removeClass(Trillo.CSS.selected);
    }
  },
  mouseOver : function(ev) {
    var infoE = this.infoE;
    infoE.$rootE.off("mouseover", this.mouseOverHandler);
    infoE.$rootE.on("mouseleave", this.mouseLeaveHandler);
    this.canvas.setHoverInfoItem(this);
    return true;
  },
  mouseLeave : function(ev, cb2) {
    var infoE = this.infoE;
    infoE.$rootE.on("mouseover", this.mouseOverHandler);
    infoE.$rootE.off("mouseleave", this.mouseLeaveHandler);
    this.canvas.setHoverInfoItem(null);
  },
  fieldChanged: function(ev) {
    var $e = $(ev.target);
    var name = $e.attr("nm");
    var value = Trillo.getFieldValue($e);
    this.canvas.fieldChanged(name, value, this.obj);
  }
});

Trillo.infoElementRepo = new Trillo.InfoElementRepo();

Trillo.Canvas = Class.extend({

  initialize : function(parent, options) {
    // TODO paremeterize this
    this.areAllSameSize = true;
    this.parent = parent;
    this.$c = parent.$container();
    this.$canvasE = parent.$e.hasClass('js-grid') ? parent.$e : parent.$e.find('.js-grid');
    this.canvasE = this.$canvasE[0];
    this.virtual = options.virtual;
    this.elemKey = options.elemKey;
    this.isListViewMode = options.isListViewMode;
    this.$headerRow  = options.$headerRow;
    this.isDialog = options.isDialog;
    this.postRenderer = options.postRenderer;
    this.loadingData = true;
    this.scrollListener = $.proxy(this.doScrolling, this, false);
    this.actualScrollHandler = $.proxy(this._doScrolling, this);
    this.showListHandler = $.proxy(this.doShowList, this);
    this.scrollTimer = null;
    this.actualScrollTimer = null;
    this.showTimer = null;
    this.isScrollListenerAdded = false;
    if (Trillo.isTouchSurface) {
      document.addEventListener('touchstart', $.proxy(this.scrollListener, this));
    }
    this.$pagination = $('.js-pagination');
    this.selected = null;
    
    this.supportsHoverTools = false;
    if (options.canvasToolsSelector) {
      var $te = $(options.canvasToolsSelector);
      if ($te.length > 0) {
        this.canvasTools = new Trillo.Tools({$toolsE : $te});
        this.canvasTools.actionHandler = this;
        this.supportsHoverTools = true;
      }
    }
    
    this.sortM = $.proxy(this.doSort, this);
  },
  
  windowResized : function() {
    this.layout();
    this.showChildren();
    this.updatePagination();
  },
  
  clear: function() {
    this.$canvasE.empty();
    if (this.$headerRow) {
      this.$headerRow.find("[sortable]").off("click", this.sortM);
    }
    if (this.page && this.page.items) {
      $.each(this.page.items, function( ) {
        this._trillo_infoBlock = undefined;
      });
    }
    this.page = null;
    this.infoBlocks = null;
    this.clearShowTimer();
    this.clearScrollTimer();
    this.clearActualScrollTimer();
    this.$pagination.hide();
    this.removeScrollListener();
    $(window).scrollTop(0);
  },
  objAdded: function(newObj, atEnd) {
    var il = Trillo.infoElementRepo.makeInfoBlockList(this.elemKey, [newObj], this);
    if (!this.infoBlocks) {
      this.infoBlocks = il;
    } else {
      if (atEnd) {
        this.infoBlocks = this.infoBlocks.concat(il);
      } else {
        for (var i=il.length-1; i >= 0; i--) {
          this.infoBlocks.unshift(il[i]);
        }
      }
    }
    this.refreshAll();
    if (atEnd) {
      var $e = this.$canvasE.parent();
      $e.scrollTop($e.prop('scrollHeight'));
    }
  },
  objChanged: function(item) {
    if (item._trillo_infoBlock) {
      item._trillo_infoBlock.refresh();
    }
  },
  setContent: function(page) {
    this.addScrollListener();
    this.loadingData = false;
    // We pass all items to the makeInfoBlockList. In case of a paginated model, this will include old and new.
    // "makeInfoBlockList" is smart to skip item which are old (due to _trillo_infoBlock).
    var il = Trillo.infoElementRepo.makeInfoBlockList(this.elemKey, page.items, this);
    if (!this.infoBlocks) {
      this.infoBlocks = il || [];
    } else {
      this.infoBlocks = this.infoBlocks.concat(il);
    }
    this.page = page;
    this.refreshAll();
  },
  
  refreshAll: function(page) {
    this.$canvasE.empty();
    this.showHeader();
    this.layout();
    this.showChildren();
    this.updatePagination();
  },
  showHeader: function() {
    var $h = this.$headerRow;
    if ($h  && $h.length > 0) {
      this.canvasE.appendChild($h [0]);
      $h.find("[sortable]").off("click", this.sortM);
      $h.find("[sortable]").on("click", this.sortM);
      return $h.outerHeight(); 
    }
    return 0;
  },
  
  layout: function() {
    if (Trillo.infoElementRepo.requiresLayout(this.elemKey)) {
      this._layout();
    }
  },
  
  _layout: function() {
    var l = this.infoBlocks, n = l.length, w = 0, h = 0, temp, x, y;
    var colWidth, nCols;
    //Trillo.offsetByFixedAbsolute(this.$canvasE);
    if (this.$headerRow) {
      this.$headerRow.css("top", this.$canvasE.offset().top);
    }
  
    if (this.isListViewMode) {
      nCols = 1;
      colWidth = $(this.$canvasE).width();
    } else {
      colWidth = (n > 0 ? l[0].w : 0) + Trillo.Options.H_MARGIN;
      nCols = Math.floor(($(this.$canvasE).width() - Trillo.Options.H_MARGIN) / colWidth);
      if (nCols <= 0) nCols = 1;
    }
    
    var yStart = this.showHeader();
    if (yStart === 0) {
      yStart = this.isListViewMode ? 0 : Trillo.Options.V_MARGIN_TOP_ROW;
    }
  
    var ys = [];
    var i;
    for(i = 0; i < nCols; i++) {
      ys[i] = yStart;
    }
    var idx = 0, o = null, prev = null, minY;
    for(i = 0; i < n; i++) {
      prev = o;
      o = l[i];
      idx = 0;
      minY = ys[0];
      for(var j = 1; j < ys.length; j++) {
        if(ys[j] < minY && (ys[j] === 0 || (minY - ys[j]) > 50)) {
          minY = ys[j];
          idx = j;
        }
      }
      y = ys[idx]; 
      x = colWidth * idx;
      o.setPosition(x, y);
      temp = x + colWidth;
      if(temp > w) {
        w = temp;
      }
      
      temp = y + o.h + (this.isListViewMode ? 0 : Trillo.Options.V_MARGIN);
      ys[idx] = temp;
      if(temp > h) {
        h = temp;
      }
    }
    if (h === 0) {
      h = yStart; // account for header.
    }
    this.contentW = this.$canvasE.outerWidth();
    this.contentH = h + (this.page.pageNumber < this.page.numberOfPages ? Trillo.Options.BOTTOM_SPACE_FOR_INF_SCROLL : 0);
    this.$canvasE.css({height: this.contentH});
    if (!this.isListViewMode) {
      var delta =  Math.floor((this.contentW - w) / 2);
      if (delta < w / 4) {
        for(i = 0; i < n; i++) {
          o = l[i];
          o.move(delta, 0);
        }
      }
    } 
    
    if (!this.isDialog && this.$headerRow) {
      this.$headerRow.css({width: this.contentW});
    }
   
    this.updateContainerGeom();
  },
  
  showChildren : function() {
    if (this.virtual && Trillo.infoElementRepo.requiresLayout(this.elemKey)) {
      this.showSomeChildren();
    } else {
      this.showAllChildren();
    }
  },
  
  showSomeChildren : function() {
    if (this.loadingData) {
      return;
    }
    this.clearShowTimer();
    this.showList = [];
    var someNotShown = false;
    var h = $( window ).height() - this.$canvasE.offset().top;
    var t, b, t2, b2; // t2 and b2 are top and bottom of viewable area
    var inview, pno;
    t = t2 = $(document).scrollTop();
    b = b2 = t + h;
    t = t - h * 5;
    if (t < 0) t = 0;
    b = b + h * 5;
    if (b > (t + this.contentH)) b = t + this.contentH; 
    var l = this.infoBlocks;
    var n = l.length;
    var f;
    var i;
    for(i = 0; i < n; i++) {
      var o = l[i];
      if(o.y > b) {
        o.hide(true);
        continue;
      }
      var y2 = o.y + o.h;
      if(y2 <= t) {
        o.hide(true);
        continue;
      }
      inview = (y2 >= t2) && (o.y <= b2);
      if (inview) {
        o.show();
      } else {
        if (!o.shown) this.showList.push(o);
      }
    }
    $('.js-load-indicator-top').hide();
    $('.js-load-indicator-bottom').hide();
    if (b2 >= this.contentH) {
      this.loadingData = this.loadNextPage();
      if (this.loadingData) {
        $('.js-load-indicator-bottom').show();
      } else {
        this.noMoreItems = true;
      }
    } 
    if (this.showList.length > 0) {
      this.showTimer = setTimeout(this.showListHandler, 200);
    }
  },
  
  showAllChildren : function() {
    if (this.loadingData) {
      return;
    }
    this.clearShowTimer();
   
    var l = this.infoBlocks;
    var n = l.length;
    for(var i = 0; i < n; i++) {
      var o = l[i];
      o.show();
    }
  },
  
  doShowList: function() {
    var il = this.showList, n = il.length;
    for (var i=0; i<n; i++) {
      il[i].show();
    }
  },
  
  clearShowTimer: function() {
    if (this.showTimer) {
      clearTimeout(this.showTimer);
      this.showTimer = null;
    }
  },
  
  loadNextPage: function() {
    if (this.page.pageNumber < this.page.numberOfPages) {
      this.parent.loadPage(this.page.pageNumber + 1);
      return true;
    }
    return false;
  },
  
  addScrollListener : function() {
    if (!this.virtual) {
      return;
    }
    if(!this.isScrollListenerAdded) {
      this.isScrollListenerAdded = true;
      $(window).bind("scroll", this.scrollListener);
    }
  },
  removeScrollListener : function() {
    if(this.isScrollListenerAdded) {
      this.isScrollListenerAdded = false;
      $(window).unbind("scroll", this.scrollListener);
    }
  },
  doScrolling : function(ev) {
    this.clearScrollTimer();
    this.updatePagination();
    if (this.loadingData) {
      this.scrollTimer = setTimeout(this.scrollListener, 200);
      return;
    }
    this.clearActualScrollTimer();
    this.clearShowTimer();
    var top = $(document).scrollTop();
    var bottom = top + $( window ).height() - this.$canvasE.offset().top;
   
    if (Trillo.isTouchSurface && (bottom < this.contentH)) {
      this.actualScrollTimer = setTimeout(this.actualScrollHandler, 100);
    } else {
      this._doScrolling(); 
    }
    
  },
  updatePagination: function() {
    if (this.virtual) {
      var top = $(document).scrollTop();
      var bottom = top + $( window ).height() - this.$canvasE.offset().top;
      var l = this.infoBlocks;
      var n = l.length;
      var from = -1;
      var to = -1;
      var o, y2;
      var count = 0;
      for(var i = 0; i < n; i++) {
        o = l[i];
        count++;
        y2 = o.y + o.h;
        if ((y2 >= top) && (o.y <= bottom - 20)) {
           if (from === -1) from = count;
           to = count;
        }
      }
      this.$pagination.show();
      this.$pagination.html(from + "-" + to);
    } else {
      this.$pagination.hide();
    }
  },
  _doScrolling: function() {
    this.showChildren();
  },
  clearScrollTimer: function() {
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
      this.scrollTimer = null;
    }
  },
  clearActualScrollTimer: function() {
    if (this.actualScrollTimer) {
      clearTimeout(this.actualScrollTimer);
      this.actualScrollTimer = null;
    }
  },
  clicked : function(infoItem) {
    this.selectInfoItem(infoItem);
  },
  dblClicked: function(infoItem) {
    if (!this.parent.infoItemDblClicked(infoItem)) {
      this.selectInfoItem(infoItem);
    }
  },
  doContextMenu: function(infoItem, x, y) {
    if (this.selected !== infoItem) {
      this.selectInfoItem(infoItem);
    }
    this.parent.showContextMenu(x, y);
  },
  /** called by toolbar manager, all tools are managed by toolbar hander. */
  actionPerformed: function(action, $e) {
    if (this.hoverInfoItem) {
      var infoItem = this.hoverInfoItem;
      if (this.selected !== infoItem) {
        if (this.selected) {
          this.selected.unselect();
        }
        this.selected = infoItem;
        infoItem.select();
        this.parent.selectInfoItem(infoItem);
      }
      this.parent.controller().actionPerformed(action, $e);
    }
  },
  setHoverInfoItem: function(hi) {
    this.hoverInfoItem = hi;
    if (!hi) {
      this.canvasTools.clear();
    } else {
      if (hi.obj.availabilityState === Trillo.OBJ_LOCKED) {
        return;
      }
      hi.infoE.$rootE.append(this.canvasTools.$toolsE);
      this.canvasTools.activate(null, this);
    }
  },
  selectInfoItem : function(infoItem) {
    if (this.selected === infoItem) {
      this.unselectInfoItem(infoItem);
      return;
    }
    if (this.selected) {
      this.selected.unselect();
    }
    this.selected = infoItem;
    infoItem.select();
    this.parent.selectInfoItem(infoItem);
  },
  unselectInfoItem : function(infoItem) {
    if (this.selected === infoItem) {
      this.parent.unselectInfoItem(infoItem);
      infoItem.unselect();
      this.selected = null;
    }
  },
  updateContainerGeom: function() {
    if (this.$c.css("position") === "absolute") {
      if (this.$c.is(this.$canvasE.parent())) {
        // need a inner container for proper size and scroll behavior.
        return;
      }
      var h = 0;
      this.$c.children().each(function(){
        h = h + $(this).outerHeight();
      });
      h -= this.$canvasE.parent().outerHeight();
      h = this.$c.height() - h;
      if (h < 10) {
        h = 10;
      }
      this.$canvasE.parent().height(h);
    }
  },
  doSort: function(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    this.parent.doSort(ev);
  },
  fieldChanged: function(name, value, obj) {
    this.parent.fieldChanged(name, value, obj);
  }
});

Trillo.Tree = Class.extend({

  initialize : function(options) {
    this.name = 'TrilloTree';
    this.parent = options.parent;
    this.alwaysOpen = options.alwaysOpen;
    this.scrollPolicy = options.scrollPolicy || Trillo.Options.NO_SCROLL;
    this.openOnFirstClick = options.openOnFirstClick;
    this.closeOthers = options.closeOthers;
    this.toc = options.toc;
    this.timer = null;
    this.$e = options.$e;
    this.$treeE = this.$e.find(".js-tree");
    this.lookupTable = {};
    this.clickHandler = $.proxy(this.linkClicked, this);
    this.contextMenuHandler = $.proxy(this.onContextMenu, this);
    if (this.scrollPolicy === Trillo.Options.SCROLL_ON_HOVER) {
      this.mouseOverHandler = $.proxy(this.onMouseOver, this);
      this.mouseOutHandler = $.proxy(this.onMouseOut, this);
      this.delayedOnMouseOut = $.proxy(this._onMouseOut, this);
    }
  },
  clear: function() {
    this.clearTimeout();
    this.removeEventHandlers();
    
  },
  removeEventHandlers: function() {
    var $e = this.$e;
    $e.off("click", this.clickHandler);
    $e.off("contextmenu", this.contextMenuHandler);
    if (this.mouseOverHandler) {
      $e.off("mouseover", this.mouseOverHandler);
      $e.off("mouseout", this.mouseOutHandler);
    }
  },
  addHandlers : function() {
    var $e = this.$e;
    this.removeEventHandlers();
    if (this.scrollPolicy === Trillo.Options.SCROLL_ON_HOVER) {
      $e.on("mouseover", this.mouseOverHandler);
      $e.on("mouseout", this.mouseOutHandler);
    }
    $e.on("click", this.clickHandler);
    $e.on("contextmenu", this.contextMenuHandler);
  },
  getSelectedItem: function() {
    return this.selectedItem;
  },
  getSelectedItemUid: function() {
    return this.selectedItem ? this.selectedItem.uid : null;
  },
  setTreeData : function(l, action) {
    this.addHandlers();
    this.lookupTable = {};
    this.updateTree(l, 0, null, this.lookupTable);
    this.unselectCurrent();
    this.list = l;
    this.selectedItem = null;
    
    this.$treeE.empty();
    this.resetElements(l);
    
    this.renderList(null, l, this.$treeE);
    if (this.alwaysOpen || action === Trillo.Options.OPEN_ALL) {
      this.openAll();
    } else if (action === Trillo.Options.CLOSE_ALL) {
      this.closeAll();
    }
  },
  
  renderList : function(parent, l, ce, e2) {
    ce.empty();
    if (e2) {
      ce.append(e2);
    }
    for (var i = 0; i < l.length; i++) {
      var item = l[i];
      var es = item[this.name];
      if (!es) {
        item[this.name] = es = this.renderElement(item);
      } else {
        es.e.attr("data-uid", item.uid); // set new uid value, it may change for a navigation
        if (typeof item.hideNode !== "undefined" && item.hideNode) {
          es.e.hide();
        }
      }
      ce.append(es.e);
    }
  },

  renderElement : function(item) {
    var lvl = item._lvl;
    var e = $('<div></div>');
    var cc = Trillo.CSS.treeNode + " " + Trillo.CSS.treeNodeLevelPrefix + lvl + (item.className ? " " + item.className : "");
    var e2 = $('<div></div>');
    var e3;
    var e4 = null;
    var label = item.displayName || item.name;
    e.attr("data-uid", item.uid);
    if (this.canShowTn && item.tnImage) {
      item.isTn = true;
      e3 = $('<img/>');
      e3.attr("src", item.tnImage);
      e2.addClass(Trillo.CSS.treeItemTn);
      e4 = $('<div></div>');
      e4.addClass(Trillo.CSS.tnLabel);
      e4.html(label);
      cc += ' no-border';
    } else {
      e3 = $('<span></span>');
      e3.html(label);
      e2.addClass(Trillo.CSS.treeItem + (this.canExpand(item, this) ? " " + Trillo.CSS.itemClose : ""));
    }
    e.addClass(cc);
    e2.append(e3);
    if (e4)
      e2.append(e4);
    if (item.userE) {
      e3.append(item.userE);
    }
    e.append(e2);

    if (item.hideNode) {
      e.hide();
    }
    return {
      e : e,
      e2 : e2,
      e3 : e3,
      lvl : lvl
    };
  },
  
  refresh : function() {
    this._refresh(this.list);
  },
  
  _refresh : function(l) {
    if (!l) {
      return;
    }
    for (var i = 0; i < l.length; i++) {
      var item = l[i];
      var es = item[this.name];
      if (es) {
        var label = item.displayName || item.name;
        if (es.e4) {
          es.e4.html(label);
        } else {
          es.e3.html(label);
        }
        this._refresh(item.children);
      }
    }
  },

  resetElements : function(l) {
    var item;
    for (var i = 0; i < l.length; i++) {
      item = l[i];
      item[this.name] = null;
      if (item.children) {
        this.resetElements(item.children);
      }
    }
  },

  linkClicked : function(ev, showingContextMenu) {
    if (!showingContextMenu) {
      Trillo.contextMenuManager.hideCurrentContextMenu();
    }
    var uid = $(ev.target).closest("." + Trillo.CSS.treeNode).attr("data-uid");
    if (uid) {
      var item = this.lookupTable[uid];
      if (showingContextMenu) {
        if (item === this.selectedItem) {
          return;
        }
      } else {
        ev.stopPropagation();
      }
      if (item._isAction && !showingContextMenu) {
        this.parent.treeAction(item.uid, item[this.name].e, item);
        return;
      }
      var es = item[this.name];
      var open = true;
      if (!this.alwaysOpen && this.canExpand(item, this)) {
        var flag1 = item === this.selectedItem || es.e2[0] === ev.target;
        var flag2 = this.openOnFirstClick || flag1;
        if (!es.open) {
          if (flag2) {
            this.openItem(item);
          }
        } else {
          if (flag1) {
            this.closeItem(item);
            open = false;
          }
        }
      }
      if (item !== this.selectedItem) {
        this.selectItem(item, open, !showingContextMenu);
      }
      this.parent.treeItemSelected(item);
    }
  },
  
  onContextMenu : function(ev) {
    ev.stopPropagation();
    var uid = $(ev.target).closest("." + Trillo.CSS.treeNode).attr("data-uid");
    if (uid) {
      var item = this.lookupTable[uid];
      var es = item[this.name];
      var offset1 = es.e.offset();
      this.linkClicked(ev, true);
      es = item[this.name];
      var offset2 = es.e.offset();
      if (this.parent.showContextMenu(ev.pageX + offset2.left - offset1.left,  ev.pageY + offset2.top - offset1.top)) {
        ev.preventDefault();
      }
    }
  },
  
  openItem : function(item) {
    if (!this.canExpand(item, this)) {
      return;
    }
    var es = item[this.name];
    if (es && es.open) {
      return;
    }
    if (!es) {
      item[this.name] = es = this.renderElement(item);
    }
    es.open = true;
    this.renderList(item, item.children, es.e, es.e2);
    es.e2.removeClass(Trillo.CSS.itemClose).addClass(Trillo.CSS.itemOpen);
  },

  closeItem : function(item) {
    var es = item[this.name];
    if (!es) {
      return;
    }
    es.open = false;
    es.e.empty();
    if (this.canExpand(item, this)) {
      es.e2.removeClass(Trillo.CSS.itemOpen).addClass(Trillo.CSS.itemClose);
    }
    es.e.append(es.e2);
  },

  openItem2 : function(item) {
    var l = [];
    var item2 = item;
    while (item2 && item2._lvl !== -1) {
      l.push(item2);
      item2 = item2.parent;
    }
    for (var i = l.length - 1; i >= 0; i--) {
      item2 = l[i];
      var es = item2[this.name];
      if (!es) {
        item2[this.name] = es = this.renderElement(item2);
      }
      this.openItem(item2);
    }
  },

  selectItem : function(item, open, scrollInView) {
    if (item === this.selectedItem) {
      return;
    }
    var es;
    var unselected = this.unselectCurrent();
    if (item) {
      if (open) {
        this.openItem2(item);
      }
      this.selectedItem = item;
      es = item[this.name];
      es.e2.addClass(Trillo.CSS.selected);
      if (scrollInView) {
        this.scrollSelectedInView();
      }
    }
    if (this.closeOthers && scrollInView && unselected) {
      var p1 = this.getCloseableParent(unselected);
      var p2 = !item ? {} : this.getCloseableParent(item);
      if (p1 !== p2 && p1 !== p2.parent) {
        this.closeItem(p1);
        if (item)
          this.scrollSelectedInView(true);
      }
    }
  },
  unselectCurrent : function() {
    var es;
    var res = this.selectedItem;
    if (res) {
      es = res[this.name];
      es.e2.removeClass(Trillo.CSS.selected);
      this.selectedItem = null;
    }
    return res;
  },
  selectItemByUid : function(uid) {
    if (!uid || this.list.length === 0) {
      return false;
    }
    var item = this.lookupTable[uid];
    this.selectItem(item, true, true);
    return item;
  },
  getItemByUid: function(uid) {
    return this.lookupTable[uid];
  },
  scrollSelectedInView : function(forceScroll) {
    setTimeout($.proxy(this._scrollSelectedInView, this, forceScroll), 100);
  },
  _scrollSelectedInView : function(forceScroll) {
    if (!this.selectedItem) {
      return;
    }
    if (!forceScroll && this.scrollPolicy === Trillo.Options.NO_SCROLL) {
      return;
    }
    var cTop, cBottom, eTop, saved, vh, reTop, reBottom;
    var es = this.selectedItem[this.name];
    var e = es.e;
    var el = this.$e;
    var pTop = el.offset().top;
    eTop = e.offset().top;
    if (this.scrollPolicy === Trillo.Options.SCROLL_ON_HOVER || this.scrollPolicy === Trillo.Options.AUTO_SCROLL) {
      vh = el.outerHeight();
      cTop = el.scrollTop();
      cBottom = cTop + vh;
      reTop = eTop - pTop + cTop;
      reBottom = reTop + e.outerHeight();
      if (reTop > cTop && reBottom < cBottom) {
        return; // in view
      }
      saved = el.css("overflow");
      el.css("overflow", "auto");
      cTop = reTop - parseInt((vh - es.e2.outerHeight()) / 2, 10);
      el.scrollTop(cTop);
      if (saved !== "auto") {
        el.css("overflow", "hidden");
      }
    } else if (this.scrollPolicy === Trillo.Options.SMOOTH_SCROLL) {
      cTop = document.viewport.getScrollOffsets().top;
      vh = $( window ).height() - pTop;
      cBottom = cTop + vh;
      reTop = eTop - pTop;
      reBottom = reTop + e.outerHeight();
      var tp = this.getTopParent(this.selectedItem);
      if ((tp !== this.selectedItem) && (reTop > cTop) && (reBottom < cBottom)) {
        return; // in view
      }
      var e2 = tp[this.name].e;
      var eTop2 = e2.offset().top;
      if ((eTop - eTop2 + es.e2.outerHeight()) < vh) {
        cTop = eTop2 - pTop - cTop + parseInt(es.e.css("padding-top"), 10);
      } else {
        cTop = reTop - parseInt((vh - es.e2.outerHeight()) / 2, 10) - cTop;
      }
      if (cTop === 0)
        return;
      var dir = cTop < 0 ? 1 : 2;
      cTop = Math.abs(cTop);
      this.smoothVScroll(cTop, dir);
    }
  },
  openAll : function() {
    this._openAll(this.list);
  },
  _openAll : function(l) {
    var item;
    for (var i = 0; i < l.length; i++) {
      item = l[i];
      if (item.children.length) {
        this.closeItem(l[i]);
        this.openItem(l[i]);
        this._openAll(item.children);
      }
    }
  },
  closeAll : function() {
    this._closeAll(this.list);
  },
  _closeAll : function(l) {
    var item;
    for (var i = 0; i < l.length; i++) {
      item = l[i];
      if (item.children.length) {
        this.closeItem(l[i]);
        this._closeAll(item.children);
      }
    }
  },

  clearTimeout : function() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  },

  onMouseOver : function() {
    this.clearTimeout();
    this.$e.css("overflow", "auto");
  },

  onMouseOut : function() {
    this.clearTimeout();
    this.timer = setTimeout(this.delayedOnMouseOut, 1000);
  },

  _onMouseOut : function() {
    this.clearTimeout();
    this.$e.css("overflow", "hidden");
  },
  
  getTopParent : function(item) {
    if (!item) {
      return null;
    }
    while (item.parent && item.parent._lvl !== -1) {
      item = item.parent;
    }
    return item;
  },
  
  getCloseableParent : function(item) {
    while (item.parent && !item.parent.closeOthers) {
      item = item.parent;
    }
    return item;
  },
  
  canExpand : function(item, tree) {
    if (!item)
      return true;
    return item.children && item.children.length > 0;
  },
  
  updateTree: function(l, lvl, parent, lookupTable) {
    var arr = [];
    this._updateTree(l, lvl, parent, lookupTable, arr);
    var prev = arr.length ? arr[0] : null;
    for (var i=1; i<arr.length; i++) {
      prev._next = arr[i];
      arr[i]._prev = prev;
      prev = arr[i];
    }
  },
  
  _updateTree: function(l, lvl, parent, lookupTable, arr) {
    var n = l.length, item;
    for (var i = 0; i < n; i++) {
      item = l[i];
      if (typeof item.uid === "undefined") {
        item.uid = item.name;
      }
      arr.push(item);
      lookupTable[item.uid] = item;
      item._lvl = lvl;
      item.parent = parent;
      if (item.children) {
        this._updateTree(item.children, lvl + 1, item, lookupTable, arr);
      }
    }
  },
  
  smoothVScroll : function(scrollLimit, dir) {
    var smoothScrollLimit = 100;
    var scrollBy = 10;
    var timeout = 30;
    var t;
    function smoothScroll() {
      t = scrollLimit < scrollBy ? scrollLimit : scrollBy;
      window.scrollBy(0, dir === 1 ? -t : t);
      scrollLimit -= scrollBy;
      if (scrollLimit > 0) {
        setTimeout(smoothScroll, timeout);
      }
    }
    if (scrollLimit > smoothScrollLimit) {
      t = scrollLimit - smoothScrollLimit;
      window.scrollBy(0, dir === 1 ? -t : t);
      scrollLimit = smoothScrollLimit;
      setTimeout(smoothScroll, timeout);
    } else {
      smoothScroll();
    }
  }

});


/* globals Mustache */
Trillo.TitleBar = Class.extend({
  initialize : function(options) {
    this.titleBar = options.titleBar;
    this.ownerView = options.ownerView;
    this.$titleBarE = $(options.titleBar);
  },
  setTitle: function(viewName, title, titlePrefix) {
    title = title || "";
    titlePrefix = titlePrefix || "";
    if (title.length === 0) {
      this.clearTitle(viewName);
      return;
    }
    
    // parse templates and cache
    if (Trillo.HtmlTemplates.titleBarTitlePrefix && !Trillo.HtmlTemplates.titleBarTemplates__parsed__) {
      Mustache.parse(Trillo.HtmlTemplates.titleBarTitlePrefix);
      Mustache.parse(Trillo.HtmlTemplates.titleBarTitle);
      Trillo.HtmlTemplates.titleBarTemplates__parsed__ = true;
    }
    
    
    var $e;
    
    $e = this.$titleBarE.find('[nm="' + viewName + '-title-prefix' + '"]');
    if (titlePrefix.length) {
      if ($e.length) {
        $e.html(titlePrefix);
      } else {
        $e = this.$titleBarE.append(Mustache.render(Trillo.HtmlTemplates.titleBarTitlePrefix, 
              {viewName: viewName, titlePrefix: titlePrefix})); 
      }
    } else {
      if ($e.length) { 
        $e.remove();
      }
    }
    
    $e = this.$titleBarE.find('[nm="' + viewName + "-title" + '"]');
    if ($e.length) {
      $e.html(title);
    } else {
      $e = this.$titleBarE.append(Mustache.render(Trillo.HtmlTemplates.titleBarTitle, 
          {viewName: viewName, title: title})); 
    }
  },
  clearTitle: function(viewName) {
    this.$titleBarE.find('[nm="' + viewName + "-title-prefix" + '"]').remove();
    this.$titleBarE.find('[nm="' + viewName + "-title" + '"]').remove();
  }
});


Trillo.TitleBarManager = Class.extend({
  initialize : function(options) {
    this.options = options;
    this.table = {};
  },
  
  getTitleBar: function(titleBar, view) {
    if (!this.table[titleBar]) {
      debug.debug("Adding titleBar: " + titleBar);
      this.table[titleBar] = new Trillo.TitleBar({titleBar: titleBar, ownerView: view});
    }
    return this.table[titleBar];
  },
  
  viewCleared: function(view) {
    var self = this;
    var titleBar = null;
    $.each(self.table, function() {
      if (this.viewOwner === view) {
        titleBar = this.titleBar;
        return false;
      }
    });
    if (titleBar) {
      debug.debug("Removing titleBar: " + titleBar);
      this.table[titleBar].$titleBarE.html("");
      this.table[titleBar] = null;
    }
  }
});



/* globals Mustache */
Trillo.View = Class.extend({
  
  initialize : function($e, controller, viewSpec) {
    this.$e = $e;
    this.viewSpec = viewSpec;
    viewSpec.params = viewSpec.params || {};
    this.name = viewSpec.name;
    this._controller = controller;
    controller.setView(this);
    this._embeddedViews = [];
    if (viewSpec.embedded) {
      this._parentView = viewSpec.prevView;
      this._parentView._embeddedViews.push(this);
    } else {
      this._prevView = viewSpec.prevView;
      if (this._prevView) {
        this._prevView._nextView = this;
      }
    }
    var previewContainerWidth = 0;
    var containerName = null;
    if (Trillo.isPreview) {
      var previewSpec = viewSpec.previewSpec ;
      if (previewSpec) {
        viewSpec.container = previewSpec.container || viewSpec.container || "main-container";
        previewContainerWidth = previewSpec.containerWidth;
      } else {
        viewSpec.container = viewSpec.container || "main-container";
      }
      containerName = viewSpec.container;
      this.$c = $("[nm='" + containerName + "']");
      if (this.$c) {
        this.$c.css("width", previewContainerWidth === 0 ? "auto" : previewContainerWidth);
      }
      if (viewSpec.type === Trillo.ViewType.Chart) {
        if (!viewSpec.charts && viewSpec.params.charts) {
          viewSpec.charts = viewSpec.params.charts.split(",");
        }
      }
    } else {
      containerName = viewSpec.container;
      if (containerName) {
        this.$c = $("[nm='" + containerName + "']");
      } else {
        this.$c = ($e.parent().length > 0 ? $e.parent() : null);
      }
    }
    if (this.$c) {
      viewSpec.isDialog = this.$c.hasClass("js-dialog-container");
    } 
    // before we process tools for this view, we need to construct embedded views that use 
    // the descendant of this.$e as the element so they can claim tools within their elements.
    this.createEmbeddedViews();
    this.selected = null;
    this.cleared = true;
    this.editable = false;
    this.internalRoute = ""; // the part of the path which is consumed by this view internally
    
    this._textNodes = []; // text nodes requiring mustache template processing
    this._attrNodes = []; // attribute nodes requiring mustache template processing
  }, 
  
  // creates only those embedded views which are created using one of the descendant element.
  createEmbeddedViews: function() {
    var spec = this.viewSpec;
    var embeddedSpecs = spec.embeddedSpecs;
    if (embeddedSpecs && embeddedSpecs.length) {
      for (var i=0; i<embeddedSpecs.length; i++) {
        var espec = embeddedSpecs[i];
        if (espec.elementSelector) {
          console.debug("Creating embedded view: " + espec.name);
          var $e2 = this.$e.find(espec.elementSelector);
          $e2.attr("for-view", espec.name);
          Trillo.builder.createView($e2, espec, this);
        }
      }
    }
  },
  
  init2: function() {
    if (!this.viewSpec.hasTemplateTag) {
      this.toolsMgr = new Trillo.ToolManager(this);
      return;
    }
    var textNodes = this._textNodes;
    var attrNodes = this._attrNodes;
    function processNode(node) {
      var t, i, len;
      if (node.nodeType === 3) {
        t = node.nodeValue;
        if (t && t.indexOf("{{") >= 0) {
          textNodes.push({textNode: node, text: t});
        }
      } else {
        if (!node.hasAttribute) {
          return;
        }
        var forView = node.getAttribute("for-view");
        if (forView && forView !== this.name) {
          return;
        }
        var attributes = node.attributes;
        if (attributes) {
          var a;
          for (i = 0, len = attributes.length; i < len; ++i) {
            a = attributes[i];
            t = a.nodeValue;
            if (t && t.indexOf("{{") >= 0) {
              attrNodes.push({attrNode: a, text: t});
            }
          }
        }
        var cl = node.childNodes;
        for (i = 0, len = cl.length; i < len; ++i) {
          processNode(cl[i]);
        }
      }
    }
    processNode(this.$e[0]);
    this.toolsMgr = new Trillo.ToolManager(this);
  },
  
  $elem: function() {
    return this.$e;
  },
  
  $container: function() {
    return this.$c;
  },
  
  embeddedViews: function() {
    return this._embeddedViews;
  },
  
  show: function(modelSpec, forceModelRefresh) {
    var myDeferred = $.Deferred();
    if (forceModelRefresh || !this._model || this._model.isModelChanged(modelSpec)) {
      debug.debug("View.show() - creating new model for: " + this.viewSpec.name);
      if (this._model) {
        this._model.clear();
      }
      this._model = Trillo.modelFactory.createModel(modelSpec, this);
      var promise;
      if (Trillo.isPreview) {
        promise = this.viewSpec.type === Trillo.ViewType.Chart && this.viewSpec.params.charts ? 
          this._model.loadChartTestData(this.viewSpec.charts[0]) :
          this._model.loadTestData(this.viewSpec.name);
         
        promise.done($.proxy(this.processTestData, this, myDeferred));
      } else {
        promise = this._model.loadData();
        promise.done($.proxy(this.showUsingModel, this, myDeferred));
      }
      promise.fail(function(result) {
        myDeferred.reject(result);
      });
    } else {
      this.postShow(myDeferred);
      debug.debug("View.show() - no changes");
    }
    return myDeferred.promise();
  },
  
  controller: function() {
    return this._controller;
  },

  processTestData: function(myDeferred, model) {
    if (!$.isEmptyObject(model.data) && !model.data.isParameter) {
      this.showUsingModel(myDeferred, model);
    } else {
      if (model.data.isParameter) {
        model.modelSpec.params = model.data;
      }
      // nullify the model data so the data can be reloaded using service etc.
      model.data = null;
      var promise = model.loadData();
      promise.done($.proxy(this.showUsingModel, this, myDeferred));
    }
  },  
  
  showUsingModel: function(myDeferred, model) {
    
    this._model = model;
    this.mapModelData(model);
  
    if (!this.cleared) {
      this.render();
      this.postShow(myDeferred);
      return;
    }
    
    Trillo.router.showingView(this);
    
    if (this.viewSpec.container && !this.viewSpec.isAppView) {
      $("body").addClass(this.viewSpec.container + "-shown");
    }
    
    if (this.$c && this.$e.parent().length === 0) {
      this.$c.empty();
      this.$c.append(this.$e);
    } 
    
    this.$e.show();
    
    this.render();
    this.toolsMgr.activate();
    this.cleared = false;
    this.postShow(myDeferred);
  },
  
  mapModelData: function(model) {
    
  },
  
  model: function() {
    return this._model;
  },
  
  modelData: function() {
    return this._model.data;
  },
  
  render: function() {
    if (this.viewSpec.hasTemplateTag) {
      var textNodes = this._textNodes;
      var attrNodes = this._attrNodes;
      var temp, i;
      for (i=0; i< textNodes.length; i++) {
        temp = textNodes[i];
        temp.textNode.nodeValue = Mustache.render(temp.text, this.modelData());
      }
      for (i=0; i< attrNodes.length; i++) {
        temp = attrNodes[i];
        temp.attrNode.nodeValue = Mustache.render(temp.text, this.modelData());
      }
    }
  },
  
  renderData: function(data) {
    
  },
  
  postShow: function(myDeferred) {
    this._controller.postViewShown(this);
    myDeferred.resolve(this);
    if (this.viewSpec.isDialog) {
      this.centerIt();
    }
  },
  
  postSetup: function() {
    if (this._nextView) {
      this._nextView.postSetup();
    }
    for (var i=0; i<this._embeddedViews.length; i++) {
     this._embeddedViews[i].postSetup();
    }
    this._controller.postSetup();
  },
  
  markForClearing: function() {
    if (!this.viewSpec.isAppView) {
      if (!this.viewSpec.embedded) {
        Trillo.router.markForClearing(this);
      }
      if (this.ownsGlobalProgress) {
        this.hideGlobalProgress();
      }
      if (this._model) {
        // clear observer so this view does not receive any events from back-end
        // while it is being cleared and new set of views are being initialized.
        this._model.clearObserver();
      }
    }
    if (this._nextView) {
      this._nextView.markForClearing();
    }
    for (var i=0; i<this._embeddedViews.length; i++) {
      this._embeddedViews[i].markForClearing();
    }
  },
  
  clear: function() {
    if (this.cleared) {
      return;
    }
    
    for (var i=0; i<this._embeddedViews.length; i++) {
      this._embeddedViews[i].clear();
    }
    
    this._embeddedViews = [];
    
    if (this._model) {
      this._model.clear();
      this._model = null;
    }
  
    this.toolsMgr.clear();
    
    if (Trillo.searchHandler && Trillo.searchHandler.context === this) {
      Trillo.searchHandler.setContext(null);
    }
    
    this.clearTitle();
    Trillo.titleBarManager.viewCleared(this);
    
    if (this.viewSpec.container) {
      $("body").removeClass(this.viewSpec.container + "-shown");
    }
    
    this.$e.remove();
    if (this._prevView) {
      // due to markForDeletion the _prevView._nextView may be the new view and may not require resetting
      // therefore check if _prevView._nextView === this
      if (this._prevView._nextView === this) {
        this._prevView._nextView = null;
      }
    } else if (this._parentView) {
      this._parentView.embeddedViews().splice(this._parentView.embeddedViews().indexOf(this), 1);
    }

    this.cleared = true;
  },
  
  modelChanged: function() {
    var myDeferred = $.Deferred();
    this.showUsingModel(myDeferred, this._model);
    return myDeferred.promise();
  },
 
  showGlobalProgress: function(actionName, progress) {
    console.log("showing .... " + this.viewSpec.name);
    this.ownsGlobalProgress = true;
    var $e = $('.js-global-progress-bar');
    $e.show();
    var $e2 = $e.find('.js-title');
    $e2.html(actionName);
    $e2 = $e.find('.js-message');
    $e2.html(progress);
    $e.find('.js-progress-bar').css("width", (progress || 4) + "%");
  },
  
  hideGlobalProgress: function() {
    this.ownsGlobalProgress = false;
    console.log("hiding .... " + this.viewSpec.name);
    var $e = $('.js-global-progress-bar');
    $e.hide();
  },
  
  updateProgress: function(obj) {
    this._updateProgress(obj);
  },
  
  // let the highest parent own the global progress indicator if it has the same
  // object selected
  _updateProgress: function(obj) {
    var p = this.parentView();
    if (p && p._updateProgress(obj)) {
      return true;
    }
    var uid = this._controller.getSelectionUidOrContextUid();
    if (obj && ((this.selectedObj && this.selectedObj.uid === obj.uid) || uid === obj.uid)) {
      if (obj.availabilityState === Trillo.OBJ_LOCKED && typeof obj.percentComplete !== 'undefined') {
        this.showGlobalProgress(obj.actionName, obj.percentComplete);
      } else {
        this.hideGlobalProgress();
      }
      return true;
    }
    return false;
  },
  
  parentView: function() {
    return this._parentView || this._prevView;
  },
  
  nextView: function() {
    return this._nextView;
  },
  
  getTitleBar: function() {
    if (this.viewSpec.titleBar) {
      return Trillo.titleBarManager.getTitleBar(this.viewSpec.titleBar, this);
    } else {
      var p = this.parentView();
      if (p) {
        return p.getTitleBar();
      } else {
        return Trillo.titleBarManager.getTitleBar(".js-heading", this);
      } 
    }
  },
  
  getToolBar$Elem: function() {
    if (this.viewSpec.toolBar) {
      return this.$c.find(this.viewSpec.toolBar);
    } else {
      var p = this.parentView();
      if (p) {
        return p.getToolBar$Elem();
      } else {
        return $(".js-toolbar");
      } 
    }
  },
 
  /**
   * This is called via controller so controller can override the title settings.
   */
  updateTitle: function() {
    var titlePrefix = "";
    var title;
    
    if (this.viewSpec.type === Trillo.ViewType.Selector || 
        this.viewSpec.type === Trillo.ViewType.List || 
        this.viewSpec.type === Trillo.ViewType.Nav || this.viewSpec.embedded) {
      // do nothing
      // leave the null block here in case we encounter this case.
    } else {
      if (Trillo.isCollectionView(this.viewSpec.type) || this.viewSpec.type === Trillo.ViewType.Chart) {
        title = this.viewSpec.displayName || "";
      } else {
        if (this.viewSpec.type === Trillo.ViewType.Tree) {
          titlePrefix = this.viewSpec.displayName || "";
        }
        var obj = this.selectedObj;
        title = obj ? obj.displayName || obj.name || "" : "";
      }
     
      /* if (this._prevView && this._prevView.viewSpec.type === Trillo.ViewType.Selector) {
        // selector view title is title of this view or its prefix.
        if (titlePrefix.length) {
          titlePrefix = "";
        } else {
          title = "";
        }
      } */
    }
    this.setTitle(title, titlePrefix);
  },
  
  setTitle: function(title, titlePrefix) {
    this.title = title;
    this.titlePrefix = titlePrefix;
    if ((titlePrefix === "" || !titlePrefix) && this.getPrevViewTitle() === title) {
      return; // same title as the parent view. Don't append.
    }
    var titleBar = this.getTitleBar();
    if (titleBar) {
      titleBar.setTitle(this.name, title, titlePrefix);
    }
  },
  
  clearTitle: function() {
    this.title = null;
    this.titlePrefix = null;
    var titleBar = this.getTitleBar();
    if (titleBar) {
      titleBar.clearTitle(this.name);
    }
  },
  
  getPrevViewTitle: function() {
    if (this._prevView) {
      return this._prevView.title;
    }
    return null;
  },
  
  getSelectedObj: function() {
    return this.selectedObj;
  },
  
  setSelectedObj: function(obj) {
    this.selectedObj = obj;
    this._controller.selectedObjChanged(obj);
    this.setTbState();
    this._controller.updateTitle();
  },
  
  setTbState: function() {
    this.toolsMgr.setTbState(this.selectedObj);
  },
 
  searchPhraseAvailable: function(ev, value, datum, dataset) {
    
  },
  
  windowResized : function() {
    if (this.cleared) {
      return;
    }
    if (this.viewSpec.isDialog) {
      this.centerIt();
    }
    if (this._nextView) {
      this._nextView.windowResized();
    }
    for (var i=0; i<this._embeddedViews.length; i++) {
      this._embeddedViews[i].windowResized();
    }
  },
  
  showContextMenu: function(x, y) {
    return this.toolsMgr.showContextMenu(x, y);
  },
  
  getNextViewName: function(historySpec) {
    if (this._nextView) {
      return this._nextView.name;
    }
    if (historySpec) {
      var type = this.viewSpec.type;
      if (type === Trillo.ViewType.Tab || type === Trillo.ViewType.Nav || Trillo.ViewType.Selector) {
        return historySpec.name;
      }
    }
    if (this.viewSpec.nextView) {
      return this.viewSpec.nextView;
    } else {
      return this._getNextViewName(historySpec);
    }
  },
  
  _getNextViewName: function(historySpec) {
    var viewSpec = this.getNextViewSpecByContextUidClass();
    if (viewSpec) {
      return viewSpec.name;
    } 
    return null;
  },
  
  getNextViewSpec: function(name) {
    var specs = this.viewSpec.nextViewSpecs;
    if (specs) {
      return specs[name];
    }
    return null;
  },
  
  getNextViewSpecByContextUidClass: function() {
    var uid = this._controller.getContextUid();
    return this.getNextViewSpecByUidClass(uid);
  },
  
  getNextViewSpecByUidClass: function(uid) {
    var specs = this.viewSpec.nextViewSpecs;
    var res = null;
    if (specs && uid) {
      var cls = Trillo.uidToClass(uid);
      if (cls) {
        $.each(specs, function( key, spec ) {
          if (spec.className === cls) {
            res = spec;
            return false;
          }
        });
      }
    }
    return res;
  },
  
  getNextViewSpecNameByUidClass: function(uid) {
    var spec = this.getNextViewSpecByUidClass(uid);
    return spec ? spec.name : null;
  },
  
  // See comments in builder.js where it is called. Subclassed in the ContentView.js
  doInternalRouting: function(routeSpecArr, indexOfNextView) {
    return 0;
  },
  
  /*
   * This function is invoked when builder is routing to the view following this view.
   * It allows the current view to highlight selection (such an item in nav-bar, view selector, list or tree).
   * Subclass it as required.
   */
  routingToNextView: function(routeSpecArr, indexOfNextView) {
    // Since the routing state of this view is dependent on the path (not just the next view),
    // we iterate over the routeSpecAtt until the routing state of this view is set appropriately.
    // Rememeber that the name of a route can be a path which is a list of names separated by "/" (subroute).
    var n = routeSpecArr.length;
    var path = "";
    for (var i=indexOfNextView; i<n; i++) {
      // route until routing state update is successful.
      path = path + (path.length > 0 ? "/" : "") + routeSpecArr[i].name;
      if (this.synchWithRouteState(path)) {
        break;
      }
    }
  },
  
  synchWithRouteState: function(path) {
    // trivially satisfied.
    return true;
  },
  
  viewByName: function(viewName) {
    var view = this.findViewByNameNextDir(viewName);
    if (view) {
      return view;
    }
    return this.findViewByNamePrevDir(viewName);
  },
  
  findViewByNameNextDir: function(viewName) {
    if (this.name === viewName) {
      return this;
    }
    for (var i=0; i<this._embeddedViews.length; i++) {
      var view = this._embeddedViews[i].findViewByNameNextDir(viewName);
      if (view) {
        return view;
      }
    }
    if (this._nextView) {
      return this._nextView.findViewByNameNextDir(viewName);
    }
  },
  
  findViewByNamePrevDir: function(viewName) {
    if (this.name === viewName) {
      return this;
    }
    if (this._prevView) {
      return this._prevView.findViewByNamePrevDir(viewName);
    } else if (this._parentView) {
      return this._parentView.findViewByNamePrevDir(viewName);
    }
  },
  
  objChanged: function(obj) {
    this._controller.objChanged(obj);
  },
  
  objAdded: function(newObj, atEnd) {
    this._controller.objAdded(newObj, atEnd);
  },
  
  objDeleted: function(obj) {
    this._controller.objDeleted(obj);
  },
  
  validate: function() {
    /* if(!this.$e.is(':visible')) {
      return true;
    } */
    var f = true;
    for (var i=0; i<this._embeddedViews.length; i++) {
      f = this._embeddedViews[i].validate() && f;
    }
    return f;
  },
  
  // view selection related method, mixin for NavView and TabView
  viewSelected: function(ev) {
    Trillo.contextMenuManager.hideCurrentContextMenu();
    if (ev) {
      //ev.stopPropagation();
      ev.preventDefault();
    }
    var $e2 = $(ev.target).closest(this.itemCss);
    var newName = $e2.attr("nm");
    if (this.updateItemSelection(newName)) {
      this.postViewSelected(newName);
    }
  },
  
  updateItemSelection: function(name) {
    var $e = this.$e;
    var $e2 = $e.find(this.itemCss + "[selected]");
    if ($e2.attr("nm") !== name) {
      $e2.removeClass(Trillo.CSS.selected);
      $e2.removeAttr("selected");
      $e2 = $e.find("[nm='" + name + "']");
      $e2.addClass(Trillo.CSS.selected);
      $e2.attr("selected", "selected");
      return true;
    }
    return false;
  },
  
  postViewSelected: function(newName) {
    this._controller.viewSelected(newName);
  },
  
  updateLabel: function() {
  },
  
  redraw: function() {
    if (this._nextView) {
      return this._nextView.redraw();
    }
    for (var i=0; i<this._embeddedViews.length; i++) {
      this._embeddedViews[i].redraw();
    }
  },
  
  setEditable: function(f) {
    if (this._nextView) {
      return this._nextView.setEditable(f);
    }
    for (var i=0; i<this._embeddedViews.length; i++) {
      this._embeddedViews[i].setEditable(f);
    }
  },
  
  centerIt: function() {
    var $w=$(window), $c=this.$c;
    if ($c) {
      var pWidth = $w.width();
      var pTop = $w.scrollTop();
      var eWidth = $c.width();
      $c.css('top', pTop + 100 + 'px');
      $c.css('left', parseInt((pWidth / 2) - (eWidth / 2), 10) + 'px');
    }
  },
  
  addContainerMarks: function() {
    var $el = this.$e.find(".js-container");
    var $markE, $c, pos;
    $.each($el, function() {
      $c = $(this);
      $c.empty();
      $c.addClass(Trillo.CSS.containerPreviewMode);
      $markE = $("<span></span>");
      $c.append($markE);
      $markE.addClass(Trillo.CSS.containerMark);
      $markE.html($c.attr("nm"));
      $("body").addClass($c.attr("nm") + "-shown");
    });
  }
 
});

/* globals autosize */
Trillo.EditableView = Trillo.View.extend({
  
  // TODO move to template
  messageHtml : '<span class="js-field-message ' + Trillo.CSS.fieldMsg + ' text-info"></span>',
  errorHtml : '<span class="js-field-error ' + Trillo.CSS.fieldMsg + ' text-danger"></span>',
  
  initialize : function($e, controller, viewSpec) {
    this._super($e, controller, viewSpec);
    this.editable =   viewSpec.editable !== false;
  }, 
 
  updateElements : function($el, data) {
    var self = this;
    $.each($el, function() {
      var $e = $(this);
      var name = $e.attr("nm");
      var value = Trillo.getObjectValue(data, name);
      if (value === null) {
        value = "";
      }
      Trillo.setFieldValue($e, value);
    });
  },
  retrieveData : function($el) {
    var data = {};
    var self = this;
    $.each($el, function() {
      var $e = $(this);
      var name = $e.attr("nm");
      var value = Trillo.getFieldValue($e);
      if (value !== null && value !== undefined) {
        Trillo.setObjectValue(data, name, value);
      }
    });
    return data;
  },
  _validateOne : function($e) {
    if(!$e.is(':visible')) {
      return true;
    }
    this.clearInlineError($e);
    var f = true;
    var value = Trillo.getFieldValue($e);
    var noValue = value === '' || value === undefined;
    if($e.hasClass("js-required") && noValue) {
      this.inlineError($e, "Required");
      f = false;
    }

    if($e.hasClass("number") && (!noValue && !Trillo.isNumeric(value))) {
      this.inlineError($e, "Numeric value required");
      f = false;
    }  
    if (!f) {
      $e.parent().addClass(Trillo.CSS.hasErrorCss);
    }
    return f;
  },
  validateOne : function(ev) {
    var $e = $(ev.target);
    if(!$e.is(':visible')) {
      return true;
    }
    return this._validateOne($e);
  },
  _validate : function(el) {
    var f = true;
    for(var i = 0; i < el.length; i++) {
      var $e = $(el[i]);
      f = this._validateOne($e) && f;
    }
    return f;
  },
  showNamedMessages: function(namedMessages) {
    var m;
    if (!namedMessages) {
      return;
    }
    for (var i=0; i<namedMessages.length; i++) {
      m = namedMessages[i];
      this.inlineMessage(this.$e.find('[nm="' + m.name + '"]'), m.message);
    }
  },
  showNamedMessagesAsError: function(namedMessages) {
    var m;
    if (!namedMessages) {
      return;
    }
    for (var i=0; i<namedMessages.length; i++) {
      m = namedMessages[i];
      this.inlineError(this.$e.find('[nm="' + m.name + '"]'), m.message);
    }
  },
  inlineMsg : function($e, msg) {
    var $em = $e.siblings('.js-field-message');
    if($em.length === 0) {
      $e.after(this.messageHtml);
      $em = $e.siblings('.js-field-message');
    }
    $em.html(msg);
    $em.parent().addClass(Trillo.CSS.hasMessageCss);
    return $em;
  },
  inlineError : function($e, msg) {
    var $em = $e.siblings('.js-field-error');
    if($em.length === 0) {
      $e.after(this.errorHtml);
      $em = $e.siblings('.js-field-error');
    }
    $em.html(msg);
    $em.parent().addClass(Trillo.CSS.hasErrorCss);
    return $em;
  },
  clearInlineMessage : function($e) {
    var $em = $e.siblings('.js-field-message');
    if($em.length) {
      $em.html('');
      $em.parent().removeClass(Trillo.CSS.hasMessageCss);
    }
  },
  clearInlineError : function($e) {
    var $em = $e.siblings('.js-field-error');
    if($em.length) {
      $em.html('');
      $em.parent().removeClass(Trillo.CSS.hasErrorCss);
    }
  },
  fieldChanged: function(ev) {
    var f = this.validateOne(ev);
    var $e = $(ev.target);
    var name = $e.attr("nm");
    var value = Trillo.getFieldValue($e);
    this.updateModelData(name, value);
    var obj = this.getObjForField($e);
    this.controller().fieldChanged(name, value, f, this, obj);
    return f;
  },
  getFieldValue: function(name) {
    var $e = this.$e.find('[nm="' + name + '"]');
    if ($e.length) {
      return Trillo.getFieldValue($e);
    }
  },
  setFieldValue: function(name, value) {
    var $e = this.$e.find('[nm="' + name + '"]');
    if ($e.length) {
      Trillo.setFieldValue($e, value);
      if (this._validateOne($e)) {
        this.updateModelData(name, value);
      }
    }
  },
  getInputs: function() {
    return Trillo.getInputs(this.$e);
  },
  setEditable: function(f) {
    if (f !== this.editable) {
      this.editable = f;
      this.renderData(this.modelData());
    }
    this._super();
  },
  setFieldEditable: function(name, f) {
    var $e = this.$e.find('[nm="' + name + '"]');
    if ($e.length) {
      Trillo.setFieldValue($e, Trillo.getFieldValue($e), !f);
    }
  },
  
  postShow: function(myDeferred) {
    var $tal = this.$e.find('textarea');
    if ($tal.length) {
      autosize($tal);
      autosize.update($tal);
    }
    this._super(myDeferred);
  },
  
  clear: function() {
    if (!this.cleared) {
      var $tal = this.$e.find('textarea');
      if ($tal.length) {
        autosize.destroy($tal);
      }
    }
    this._super();
  }
});

/**
 * This is the base class for the special types of view that help in the selection of next view such as
 * navigation, drop downs to give choice of the next view, a list of choices meant for views or a navigation
 * tree.
 */
Trillo.ViewSelectionView = Trillo.View.extend({
  containerCss: null,
  itemCss: null,
  initialize : function($e, controller, viewSpec) {
    this._super($e, controller, viewSpec);
    this.viewSelectedMethod = $.proxy(this.viewSelected, this);
  }, 
  
  postShow: function(myDeferred) {
    var $temp = this.$e.find(this.itemCss);
    $temp.off("click", this.viewSelectedMethod);
    $temp.on("click", this.viewSelectedMethod);
    this._super(myDeferred);
  },
  
  clear: function() {
    if (!this.cleared) {
      var $temp = this.$e.find(this.itemCss);
      $temp.off("click", this.viewSelectedMethod);
    }
    this._super();
  },
  
  synchWithRouteState: function(name) {
    // highlight menu
    var $e = this.$e;
    var $e2 = $e.find("[nm='" + name + "']");
    if ($e2.length > 0) {
      this.updateItemSelection(name);
      this.updateLabel();
      this.controller().updateTitle();
      return true;
    }
    return false;
  },
  
  _getNextViewName: function(historySpec) {
    if (historySpec) {
      
    }
    var $e2 = this.$e.find(this.itemCss + "[selected]");
    if ($e2.length > 0) {
      return $e2.attr("nm");
    }
    return null;
  }
});

Trillo.TreeView = Trillo.View.extend({
  initialize : function($e, controller, viewSpec) {
    this._super($e, controller, viewSpec);
    var $treeC = this.$e.find(".js-scrollbar");
    this.tree = new Trillo.Tree({
      $e : $treeC,
      parent : this,
      scrollPolicy: Trillo.isTouchSurface ? Trillo.Options.AUTO_SCROLL : Trillo.Options.SCROLL_ON_HOVER,
      openOnFirstClick: true,
      closeOthers: true
    });
    this.toggleDisplayHandler = $.proxy(this.toggleDisplay, this);
  },
  
  clear: function() {
    if (!this.cleared) {
      this.removeEventHandlers();
      this.renderData([]);
      this.tree.clear();
    }
    this._super();
  },
  
  mapModelData: function(model) {
    model.data = model.data || {};
    model.data.children = model.data.children || [];
  },
  
  render: function() {
    this._super();
    this.renderData(this.modelData().children); // this.modelData() is root node, we do not display it
  },
  
  renderData: function(l) {
    this.addHandlers();
    this.tree.setTreeData(l);
  },
  
  postShow: function(myDeferred) {
    this.selectTreeItem(this.controller().getMySelection());
    this._super(myDeferred);
  },
  
  selectTreeItem: function(uid) {
    var selected = this.tree.selectItemByUid(uid);
    var list = this.modelData().children;
    if (!selected && list && list.length > 0) {
      uid = list[0].uid;
      this.controller().setParam("sel", uid);
      this.tree.selectItemByUid(uid);
    } 
    this.setSelectedObj(this.tree.selectedItem);
  },
  
  selectAndRoute: function(uid) {
    var selected = this.tree.selectItemByUid(uid);
    if (selected) {
      this.treeItemSelected(this.tree.selectedItem);
      return true;
    }
    return false;
  },
  
  synchWithRouteState: function(name) {
    // highlight node
    var item = this.tree.getItemByUid(name);
    if (item && item !== this.selectedObj) {
      this.tree.selectItemByUid(name);
      this.setSelectedObj(this.tree.selectedItem);
      return true;
    }
    return false;
  },
  
  treeAction: function(actionId, $e, item) {
    this.controller().actionPerformed(actionId, $e, item);
  },
  
  treeItemSelected: function(item) {
    this.setSelectedObj(item);
    this.controller().setParam("sel", item.uid);
  },
  
  addHandlers : function() {
    if (this.viewSpec.viewToggle) {
      this.removeEventHandlers();
      $(this.viewSpec.viewToggle).on("click", this.toggleDisplayHandler);
    }
  },
  
  removeEventHandlers: function() {
    if (this.viewSpec.viewToggle) {
      $(this.viewSpec.viewToggle).off("click", this.toggleDisplayHandler);
    }
  },
  
  toggleDisplay: function() {
    var notInView = this.$container().offset().left < 0;
    this.$container().css("left", notInView ? "0px" : "-1000px");
  },
  
  outOfView: function() {
    this.$container().css("left", "-1000px");
  },
  
  withInView: function() {
    this.$container().css("left", "0px");
  },
  
  getNextViewName: function(historySpec) {
    var item = this.selectedObj; 
    if (item) {
      return Trillo.isUid(item.uid) ? this.getNextViewSpecNameByUidClass(item.uid) : item.uid;
    }
    return null;
  },
  
  objChanged: function(obj) {
    this.render();
    this.selectTreeItem(this.controller().getMySelection());
  },
  
  redraw: function() {
    this.tree.refresh();
    this._super();
  }
});

Trillo.SelectorView = Trillo.ViewSelectionView.extend ({
  
  labelSelector: '.js-label',
  containerCss: ".js-menu",
  itemCss: ".js-menu-item",
  
  initialize : function($e, controller, viewSpec) {
    this._super($e, controller, viewSpec);
  }, 
  
  updateLabel: function() {
    var $e = this.$e;
    var $e2 = $e.find(this.itemCss + "[selected]");
    $e.find(this.labelSelector).html($e2.html());
  }
});

Trillo.TabView = Trillo.EditableView.extend ({
  
  containerCss:  ".js-tab-list",
  itemCss: ".js-tab",
  tabPanelCSS: ".js-tab-panel",
  
  initialize : function($e, controller, viewSpec) {
    this._super($e, controller, viewSpec);
    this.viewSelectedMethod = $.proxy(this.viewSelected, this);
    // tab's inputs are inputs seen in the beginning.
    // Anything added later is part of one of its children views.
    this.$inputs = Trillo.getInputs($e);
    this.changeHandler = $.proxy(this.fieldChanged, this);
  },
  
  getInputs: function() {
    return this.$inputs;
  },
  
  mapModelData: function(model) {
    model.data = model.data || {};
  },
  
  render: function() {
    this._super();
    this.setSelectedObj(this.modelData());
    this.updateProgress(this.modelData());
    this.setChangeHandler(true);
    this.renderData(this.modelData());
  },
  
  renderData : function(data) {
    this.updateElements(this.getInputs(), data);
  },
  
  setChangeHandler: function(isOn) {
    var $e = this.getInputs();
    $e.off("change", this.changeHandler);
    if (isOn) {
      $e.on("change", this.changeHandler);
    }
  },
  
  validate : function() {
    var el = this.getInputs();
    var f = this._validate(el);
    f = f & this._super();
    return f;
  },
  
  postShow: function(myDeferred) {
    var $e2 = this.$e.find(this.itemCss + "[selected]");
    if ($e2.length > 0) {
      var name = $e2.attr("nm");
      var $tp = this.$e.find(this.tabPanelCSS + "[for='" + name +"']");
      if ($tp.length > 0) {
        this.updateTabPanelVisibility(name);
      }
    }
    var $temp = this.$e.find(this.itemCss);
    $temp.off("click", this.viewSelectedMethod);
    $temp.on("click", this.viewSelectedMethod);
    this._super(myDeferred);
  },
  
  clear: function() {
    if (!this.cleared) {
      var $temp = this.$e.find(this.itemCss);
      $temp.off("click", this.viewSelectedMethod);
      this.setChangeHandler(false);
    }
    this._super();
  },
  
  updateLabel: function() {
    var $e = this.$e;
    var $e2 = $e.find(this.itemCss + "[selected]");
    $e.find("." + Trillo.CSS.tabActive).removeClass(Trillo.CSS.tabActive);
    $e2.parent().addClass(Trillo.CSS.tabActive);
  },
  
  updateTabPanelVisibility: function(newName) {
    var $e = this.$e;
    $e.find(this.tabPanelCSS + "[for]").hide();
    var $e2 = $e.find(this.tabPanelCSS + "[for='" + newName +"']");
    $e2.show();
    Trillo.resizeAllTextArea ($e);
    this.redraw();
  },
  
  postViewSelected: function(newName) {
    var $tp = this.$e.find(this.tabPanelCSS + "[for='" + newName +"']");
    if ($tp.length > 0) {
      this.updateTabPanelVisibility(newName);
      this.updateLabel();
    } else {
      this._super(newName);
    }
  },
  
  _getNextViewName: function(historySpec) {
    var $e2 = this.$e.find(this.itemCss + "[selected]");
    if ($e2.length > 0) {
      var nextName = $e2.attr("nm");
      var $tp = this.$e.find(this.tabPanelCSS + "[for='" + nextName +"']");
      if ($tp.length > 0) {
        return null;
      } else { 
        return nextName;
      }
    }
    return null;
  },
 
  objChanged: function(obj) {
    if (obj === this.modelData()) {
      Trillo.setFieldsValue(this.$e, obj);
      this.updateProgress(obj);
      this.setTbState();
    }
    this._super(obj);
  },
  
  synchWithRouteState: function(name) {
    // highlight menu
    var $e = this.$e;
    var $e2 = $e.find("[nm='" + name + "']");
    if ($e2.length > 0) {
      this.updateItemSelection(name);
      this.updateLabel();
      this.controller().updateTitle();
      return true;
    }
    return false;
  },
  
  updateModelData: function(name, value) {
    this.model().setValue(name, value);
  },
  
  getObjForField: function($e) {
    return this.modelData();
  }
});

Trillo.NavView = Trillo.ViewSelectionView.extend({
  
  containerCss:  ".js-navigation",
  itemCss: ".js-nav-item",
  
  initialize : function($e, controller, viewSpec) {
    this._super($e, controller, viewSpec);
  }
});

Trillo.sortDescTemplate = '<span class="order"><span class="caret"></span></span>';
Trillo.sortAscTemplate = '<span class="order dropup"><span class="caret"></span></span>';
Trillo.CollectionView = Trillo.View.extend({
  initialize : function($e, controller, viewSpec) {
    this._super($e, controller, viewSpec);
    this.setupView();
    this.sortSpec = {};
  },
  setupView: function() {
   var options = {};
   var viewSpec = this.viewSpec;
   var $e = this.$e;
   var $e2 = $e.find('.js-grid-cell');
   if ($e2.length > 0) {
     options.elemKey = viewSpec.name + "-" + "info-block";
     Trillo.infoElementRepo.addTemplate($e2, options.elemKey, viewSpec.hasTemplateTag);
   } else {
     $e2 = $e.find('.js-content-row');
     if ($e2.length > 0) {
       options.elemKey = viewSpec.name + "-" + "row";
       Trillo.infoElementRepo.addTemplate($e2, options.elemKey, viewSpec.hasTemplateTag);
       options.isListViewMode = true;
     } 
   }
   $e2 = $e.find('.js-heading-row');
   if ($e2.length > 0) {
     $e2.show();
     options.$headerRow  = $e2;
   } 
   options.postRenderer = viewSpec.postRenderer;
   options.isDialog = viewSpec.isDialog;
   options.virtual = viewSpec.virtual || typeof viewSpec.virtual === "undefined" ? true : false;
   this.$asc = $(Trillo.sortAscTemplate);
   this.$desc = $(Trillo.sortDescTemplate);
   this.canvas = new Trillo.Canvas(this, options);
  },
  
  mapModelData: function(model) {
    model.data = model.data || [];
  },
  
  render: function() {
    var num = this.model().numberOfPages;
    if (num === undefined || num === 1) {
      this.viewSpec.virtual = false;
      this.canvas.virtual = false;
    }
    this.controller().updateTitle();
    this._super();
    this.renderData(Trillo.convertToPage(this.modelData()));
  },
  
  renderData: function(data) {
    this.canvas.clear();
    this.canvas.setContent(data);
  },
  
  clear: function() {
    if (!this.cleared) {
      this.unselectInfoItem();
      this.canvas.clear();
    }
    this._super();
  },
  
  windowResized : function() {
    if (this.cleared) {
      return;
    }
    this.canvas.windowResized();
    this._super();
  },
  
  loadPage: function(pageNumber, requireClearing) {
    $.when(this.model().loadData(pageNumber)).done($.proxy(this.pageLoaded, this, requireClearing));
  },
  
  //model and this._model will be same as the current model
  pageLoaded: function(requireClearing, model) {
    if (requireClearing) {
      this.canvas.clear();
    }
    this.canvas.setContent(Trillo.convertToPage(this.modelData()));
  },
  
  selectInfoItem: function(infoItem) {
    this.selectedInfoItem = infoItem;
    this.setSelectedObj(infoItem.obj);
  },
  
  unselectInfoItem: function(infoItem) {
    this.selectedInfoItem = null;
    this.setSelectedObj(null);
  },
  
  infoItemDblClicked: function(infoItem) {
    return this.controller().dblClicked(infoItem ? infoItem.$rootE : null, infoItem ? infoItem.obj : null);
  },
  
  objChanged: function(obj) {
    this.canvas.objChanged(obj);
    if (this.selectedObj === obj) {
      this.setTbState();
    }
    this._super(obj);
  },
  
  objAdded: function(newObj, atEnd) {
    this.canvas.objAdded(newObj, atEnd);
    this._super(newObj, atEnd);
  },
  
  doSort: function(ev) {
    var $e = $(ev.target);
    var name = $e.attr("nm");
    if (!name) {
      Trillo.alert.showError("Error", "Missing 'name' attribute in the header, pl. specify in the HTML temlpate");
      return;
    }
    var currentSort = this.sortSpec[name];
    if (currentSort === "asc") {
      currentSort = "desc";
    } else {
      currentSort = "asc";
    }
    this.$asc.remove();
    this.$desc.remove();
    if (currentSort === "asc") {
      $e.append(this.$asc);
    } else {
      $e.append(this.$desc);
    }
    this.sortSpec = {};
    this.sortSpec[name] = currentSort;
    
    if (this.model().setOrderBy) {
      var orderBy = name + " " + currentSort;
      this.model().setOrderBy(orderBy);
      this.canvas.loadingData = true;
      this.loadPage(1, true);
    } else {
      // local model
      this.model().doSort(name, currentSort);
      this.canvas.clear();
      this.canvas.setContent(Trillo.convertToPage(this.modelData()));
    }
  },
  
  redraw: function() {
    this.canvas.refreshAll();
    this._super();
  },
  
  fieldChanged: function(name, value, obj) {
    this.controller().fieldChanged(name, value, true, this, obj);
  }
});

/*
 * This used query model (without pagination) and renders a simple drop downlist.
 */
/* globals Mustache */
Trillo.DropdownView = Trillo.ViewSelectionView.extend({
  
  labelSelector: '.js-label',
  
  initialize : function($e, controller, viewSpec) {
    this._super($e, controller, viewSpec, ".js-list", ".js-list-item");
    this.itemSelectedMethod = $.proxy(this.itemSelected, this);
  }, 
  
  mapModelData: function(model) {
    model.data = model.data || [];
  },
  
  render: function() {
    this.controller().updateTitle();
    this._super();
    this.renderList();
  },
  
  renderList: function() {
    var $temp = this.$e.find(".js-list");
    var l = Trillo.listFromPage(this.modelData());
    if (Trillo.HtmlTemplates.dropdownListItem && !Trillo.HtmlTemplates.dropdownListItem__parsed__) {
      Mustache.parse(Trillo.HtmlTemplates.titleBarTitlePrefix);
      Mustache.parse(Trillo.HtmlTemplates.dropdownListItem);
      Trillo.HtmlTemplates.dropdownListItem__parsed__ = true;
    }
    var html = "";
    // TODO use template than hard coding the HTML
    for (var i=0; i<l.length; i++) {
      var item = l[i];
      html += Mustache.render(Trillo.HtmlTemplates.dropdownListItem, item);
    }
    $temp.html(html);
  },
  
  postShow: function(myDeferred) {
    this.selectItem();
    this._super(myDeferred);
  },
  
  selectItem: function() {
    var uid = this.controller().getMySelection();
    var selected = null;
    if (uid) {
      selected = this.model().getObj(uid);
    }
    var items = Trillo.listFromPage(this.modelData());
    if (!selected && items.length > 0) {
      selected = items[0];
      uid = selected.uid;
      this.controller().setParam("sel", uid);
    }
    this.setSelectedObj(selected);
  },
  
  synchWithRouteState: function(name) {
    this._super(name);
    // will select row if the list is a list of names (like the case with tree).
    var item = this.model().getObj(name);
    if (item && item !== this.selectedObj) {
      this.setSelectedObj(item);
    }
  },
  
  setSelectedObj: function(selected) {
    this._super(selected);
    this.updateLabel();
  },
 
  postViewSelected: function(newName) {
    var item = this.model().getObj(newName);
    this.setSelectedObj(item);
    var uid = item ? item.uid : null;
    this.controller().setParam("sel", uid);
  },
  
  updateLabel: function() {
    var selected = this.selectedObj;
    var html = selected ? selected.name : "";
    this.$e.find(this.labelSelector).html(html);
  },
  
  _getNextViewName: function(historySpec) {
    var item = this.selectedObj;
    if (item) {
      return Trillo.isUid(item.uid) ? null : item.uid;
    }
  },
  
  objChanged: function(obj) {
    this.renderList();
    if (this.selectedObj === obj) {
      this.setTbState();
    }
    this._super(obj);
  },
  
  objAdded: function(newObj, atEnd) {
    this.renderList();
    if (!this.selectedObj) {
      this.selectItem();
    }
    this._super(newObj, atEnd);
  }
});

Trillo.DetailView = Trillo.View.extend({
  
  initialize : function($e, controller, viewSpec) {
    this._super($e, controller, viewSpec);
  },
  
  mapModelData: function(model) {
    model.data = model.data || {};
  },
  
  render: function() {
    this._super();
    this.setSelectedObj(this.modelData());
    Trillo.setFieldsValue(this.$e, this.modelData());
    this.updateProgress(this.modelData());
  },
 
  objChanged: function(obj) {
    if (obj === this.modelData()) {
      Trillo.setFieldsValue(this.$e, obj);
      this.updateProgress(obj);
      this.setTbState();
    }
    this._super(obj);
  }
});
Trillo.FormView = Trillo.EditableView.extend({
  
  initialize : function($e, controller, viewSpec) {
    this._super($e, controller, viewSpec);
    this.changeHandler = $.proxy(this.fieldChanged, this);
  },
  
  mapModelData: function(model) {
    model.data = model.data || {};
  },
  
  render: function() {
    this._super();
    this.setChangeHandler(true);
    this.renderData(this.modelData());
  },
  
  renderData : function(data) {
    this.updateElements(this.getInputs(), data);
  },
  
  setChangeHandler: function(isOn) {
    var $e = this.getInputs();
    $e.off("change", this.changeHandler);
    if (isOn) {
      $e.on("change", this.changeHandler);
    }
  },
  
  validate : function() {
    var el = this.getInputs();
    var f = this._validate(el);
    f = f & this._super();
    return f;
  },
  
  clear: function() {
    if (!this.cleared) {
      this.setChangeHandler(false);
    }
    this._super();
  },
 
  canSubmit: function() {
    return this.validate();
  },
  
  updateModelData: function(name, value) {
    this.model().setValue(name, value);
  },
  
  getObjForField: function($e) {
    return this.modelData();
  }
});

Trillo.EditableTableView = Trillo.EditableView.extend({
  
  initialize : function($e, controller, viewSpec) {
    this._super($e, controller, viewSpec);
    this.allowsNewRow = typeof viewSpec.allowsNewRow === "undefined" || viewSpec.allowsNewRow;
    this.setupView();
  }, 
  
  setupView: function() {
    this.$templateE = this.$e.find('.js-content-row');
    this.$templateE.remove();
    this.changeHandler = $.proxy(this.rowFieldChanged, this);
    this.rowActionHandler = $.proxy(this.handleRowAction, this);
    this.isStringArray = false;
  },
  
  mapModelData: function(model) {
    model.data = model.data || [];
  },
  
  render: function() {
    this._super();
    this.$tableE =  Trillo.findAndSelf(this.$e, 'table');
    var dt = this.modelData();
    // if array elements are string, convert them to object with "name" being the default attribute
    // This faciliates editing of a list of string using this components.
    if (dt.length && typeof dt[0] === "string") {
      this.isStringArray = true;
      var newDt = [];
      $.each(dt, function() {
        newDt.push({"name" : this});
      });
      dt = newDt;
    }
    this.renderData(dt);
  },
  
  renderData : function(data) {
    this.clearRows();
    this.setRowsData(data);
    this.addLastEmptyRow();
  },
  
  clearRows: function() {
    this.$e.find('.js-content-row').remove();
  },
  
  setRowsData: function(dataList) {
    for (var i=0; i<dataList.length; i++) {
      var $r = this.appendNewRow(i);
      $r.data("_row_data_", dataList[i]);
      this.updateElements(Trillo.getInputs($r), dataList[i]);
    }
  },
  
  appendNewRow: function(rowIndex) {
    var $r = this.$templateE.clone(true);
    $r.attr("row", "" + rowIndex);
    this.$tableE.append($r);
    this.addRowEventHandler($r);
    return $r;
  },
  
  // re-populates data array from the view.
  _viewToData : function(data, includeEmpty) {
   
    data.length = 0;
    
    var $el = this.$e.find('.js-content-row');
    var self = this;
    var $e;
    $.each($el, function() {
      $e = $(this);
      var $inputs = Trillo.getInputs($e);
      if (!self.isEmpty($inputs) || includeEmpty) {
        var rowData = self.retrieveData($inputs);
        if (self.isStringArray) {
          data.push(rowData.name);
        } else {
          rowData = $.extend($e.data("_row_data_"), rowData);
          data.push(rowData);
        }
      }
    });
  },
  
  addRowEventHandler: function($r) {
    var $e = Trillo.getInputs($r);
    $e.on("change", this.changeHandler);
    $e= $r.find(".js-row-tool");
    $e.on("click", this.rowActionHandler);
  },
  
  validate : function() {
    var $el = this.$e.find('.js-content-row');
    var f = true;
    var self = this;
    var $e;
    $.each($el, function() {
      $e = $(this);
      var $inputs = Trillo.getInputs($e);
      if (!self.isEmpty($inputs)) {
        f = self._validate($inputs) && f;
      }
    });
    f = f & this._super();
    return f;
  },
  
  isEmpty : function($e) {
    var f = true;
    var a = $e.serializeArray();
    $.each(a, function() {
      // The attribute is repeated, save it is as array.
      // Convert to array if required.
      var name = this.name; // remember we are iterating over data and not elements
      var value = this.value; 
      if (value && $.trim(value) !== "") {
        f = false;
        return false;
      }
    });
    return f;
  },
  
  rowFieldChanged: function(ev) {
    if (this.fieldChanged(ev)) {
      var $e = $(ev.target);
      if (this.isLastRow($e)) {
        this.addLastEmptyRow();
      }
    }
  },
  
  isLastRow: function($e) {
    var n = this.getNumberOfRows();
    var rowIndex = this.getRowIndex($e);
    return rowIndex === n-1;
  },
  
  getNumberOfRows: function() {
    return this.$e.find('.js-content-row').length;
  },
  
  handleRowAction: function(ev) {
    var $e = $(ev.target);
    switch($e.attr("nm")) {
      case 'up' : this.moveRow($e, -1);
                  break;
      case 'down' : this.moveRow($e, 1);
                  break;
      case 'add' : this.addRowBefore($e);
            break;
      case 'delete' : this.deleteRow($e);
            break;
    }
  },
  
  moveRow: function($e, by) {
    var rowIndex = this.getRowIndex($e) + by;
    if (rowIndex < 0) return;
    var n = this.getNumberOfRows();
    if (rowIndex >= n) {
      return;
    }
    if (by < 0) {
      this.$e.find('[row="' + rowIndex + '"]').before($e.closest("tr"));
    } else {
      this.$e.find('[row="' + rowIndex + '"]').after($e.closest("tr"));
    }
    this.reorder();
    this._viewToData(this.modelData(), false);
  },
  
  addRowBefore: function($e) {
    var $r = this.$templateE.clone(true);
    $e.closest("tr").before($r);
    this.addRowEventHandler($r);
    this.reorder();
    this._viewToData(this.modelData(), false);
  },
  
  deleteRow: function($e) {
    $e.closest("tr").remove();
    if (this.getNumberOfRows() === 0) {
      this.appendNewRow(0);
    } else {
      this.reorder();
    }
    this._viewToData(this.modelData(), false);
  },
  
  reorder: function() {
    var $el = this.$e.find('.js-content-row');
    var n = 0;
    $.each($el, function() {
      $(this).attr("row", n++);
    });
  },
  
  getRowIndex: function($e) {
    return parseInt($e.closest("tr").attr("row"), 10);
  },
  
  removeLastRowIfEmpty: function() {
    var $e = this.$e.find('.js-content-row').last();
    if (this.isEmpty($e)) {
      $e.remove();
    }
  },
  
  addLastEmptyRow: function() {
    if (this.editable  && this.allowsNewRow && 
        (this.modelData().length === 0 || !this.isEmpty(Trillo.getInputs(this.$e.find('.js-content-row').last())))) {
      this.appendNewRow(this.getNumberOfRows());
    }
  },
  
  setAllowsNewRow: function(f) {
    if (f !== this.allowsNewRow) {
      this.allowsNewRow = f;
      if (f) {
        this.addLastEmptyRow();
      } else {
        this.removeLastRowIfEmpty();
      }
    }
  },
  
  updateModelData: function(name, value) {
    this._viewToData(this.modelData(), false);  // populate model data from view
  },
  
  getObjForField: function($e) {
    var rowIndex = this.getRowIndex($e);
    return this.modelData()[rowIndex];
  }
  
});

/* globals c3 */
Trillo.ChartView = Trillo.View.extend({
  initialize : function($e, controller, viewSpec) {
    this._super($e, controller, viewSpec);
    this.setupView();
    this.charts = [];
    this.$chartContainers = [];
  },
  
  setupView: function() {
   this.$chartE = this.$e.find('.js-chart-cell');
   this.$chartE.remove();
  },
  
  mapModelData: function(model) {
    model.data = model.data || [];
  },
  
  render: function() {
    this.controller().updateTitle();
    this._super();
    //this.createTestData();
    this.renderCharts();
  },
  
  clear: function() {
    this._super();
    this.chart = null;
  },
  
  windowResized : function() {
    if (this.cleared) {
      return;
    }
    this._super();
    for (var i=0; i<this.charts.length; i++) {
      this.charts[i].resize();
    }
  },
  
  loadPage: function(pageNumber) {
    $.when(this.model().loadData(pageNumber)).done($.proxy(this.pageLoaded, this));
  },
  
  pageLoaded: function(model) {
    
  },
  
  renderCharts: function() {
    if (!this.viewSpec.charts) {
      return;
    }
    var deferred = Trillo.chartManager.getChartList(this.viewSpec.charts);
    deferred.done($.proxy(this._renderCharts, this));
  },
  
  _renderCharts: function(chartList) {
    var i;
    var l = this.$chartContainers;
    for (i=0; i<l.length; i++) {
      l[i].remove();
    }
    this.$chartContainers.length = 0;
    this.charts.length = 0;
    l = this.viewSpec.charts;
    if (!l) return;
    for (i=0; i<chartList.length; i++) {
      this.renderChart(chartList[i]);
    }
  },
  
  renderChart: function(spec) {
    debug.debug("Rendering chart: " + spec.name);
    if (spec.type === "pie") {
      this.renderPieChart(spec);
    } else {
      this.renderXYChart(spec);
    }
  },
  
  renderXYChart: function(spec) {
    var xs = [];
    var ys, name, displayName;
    var columns = [];
    var dt = Trillo.listFromPage(this.modelData());
    var xAttr = spec.xAttr;
    var yAttrs = spec.yAttrs;
    var i;
    
    // initialize x data
    xs.push(xAttr);
    for (i=0; i<dt.length; i++) {
      if (dt[i][xAttr]) {
        xs.push(dt[i][xAttr]);
      }
    }
    columns.push(xs);
    
    // initialize y data
    for (i=0; i<yAttrs.length; i++) {
      name = yAttrs[i];
      displayName = name; // will be retrieved from the property file
      ys = [];
      ys.push(displayName);
      for (var j=0; j<dt.length; j++) {
        if (typeof dt[j][name] !== "undefined") {
          ys.push(dt[j][name]);
        }
      }
      columns.push(ys);
    }
    
    var cdata = {
        x: xAttr,
        columns: columns,
        type : spec.type
    };
    var chart = c3.generate({
      bindto: "#" + this.viewSpec.elemId + " .chart",
      data: cdata,
      axis: spec.axis,
      legend : {
        show: true
      },
      transition: {
        duration: 0
      }
    });
    
    this.setChartElement(spec, chart);
  },
  
  renderPieChart: function(spec) {
    var columns = [];
    var dt = Trillo.listFromPage(this.modelData());
    var xAttr = spec.xAttr;
    var yAttrs = spec.yAttrs;
    var name, displayName;
    var i, j;
    var ys;
    if (!yAttrs || yAttrs.length === 0) {
      return;
    }
    
    if (xAttr) {
      // each row corresponds to a slice of pie
      var yAttr = yAttrs[0];
      for (j=0; j<dt.length; j++) {
        ys = [];
        ys.push(dt[j][xAttr]);
        ys.push(dt[j][yAttr]);
        columns.push(ys);
      }
    } else {
      // slice for a yAttrs[n] is built using value from each row
      for (i=0; i<yAttrs.length; i++) {
        name = yAttrs[i];
        displayName = name; // will be retrieved from the property file
        ys = [];
        ys.push(displayName);
        for (j=0; j<dt.length; j++) {
          if (typeof dt[j][name] !== "undefined") {
            ys.push(dt[j][name]);
          }
        }
        columns.push(ys);
      }
    }
    var cdata = {
        columns: columns,
        type : spec.type
    };
    
    var pie = null;
    if (spec.label) {
      pie = {
        label : {
          format: function (value, ratio, id) {
            return value + " " + spec.label;
          }
        }
      };
    }
    
    var chart = c3.generate({
      data: cdata,
      pie: pie
    });
    this.setChartElement(spec, chart);
  },
  
  setChartElement: function(spec, chart) {
    var $ce = this.$chartE.clone(true);
    this.$chartContainers.push($ce);
    this.$e.append($ce);
    $ce.find('.js-chart')[0].appendChild(chart.element);
    $ce.find('.js-title').html(spec.displayName ? spec.displayName: "");
    this.charts.push(chart);
  },
  
  createTestData: function() {
    var testData = [];
    var dt = new Date();
    dt.setTime(dt.getTime()- 24 * 60 * 60 * 1000);
    for (var i=0; i < 10; i++) {
      
      testData.push({timeStamp: dt.getTime(), 
        cpuUsage: Math.floor(Math.random() * ((i % 4 === 0 ? 20 : 10))) + 1,
        cpuReady: Math.floor(Math.random() * ((i % 4 === 0 ? 10 : 5))) + 1,
        cpuMhz: Math.floor(Math.random() * ((i % 4 === 0 ? 150 : 600))) + 1,
        memoryMb: Math.floor(Math.random() * ((i % 4 === 0 ? 20 : 100))) + 1,
        memorySwapOut: Math.floor(Math.random() * ((i % 4 === 0 ? 1 : 5))) + 1,
        memorySwapIn: Math.floor(Math.random() * ((i % 4 === 0 ? 1 : 3))) + 1,
        itemName: "Time-" + i
      });
      dt.setTime(dt.getTime() + (30 * 60 * 1000));
    }
    this.model().data = {items: testData};
  }
  
});

Trillo.ContentView = Trillo.View.extend({
  
  initialize : function($e, controller, viewSpec) {
    this._super($e, controller, viewSpec);
  },
  
  doInternalRouting: function(routeSpecArr, indexOfNextView) {
    var n = routeSpecArr.length - indexOfNextView;
    if (n < 0) {
      n = 0;
    }
    var forward = 0;
    var $e = this.$e;
    var $foundE = Trillo.findAndSelf($e, '[nm="' + this.name + '"]');
    var internalRoute = "";
    for (var i = 0; i< n; i++) {
      var $t = $e.find('[nm="' + routeSpecArr[indexOfNextView + i].name + '"]');
      if ($t.length > 0) {
        $foundE = $t;
      }
      internalRoute = internalRoute + (i > 0 ? "/" : "") + routeSpecArr[indexOfNextView + i].name;
    }
    this.internalRoute = internalRoute;
    $e.find(".js-pointed").remove();
    if ($foundE) {
      var $sp = $("<span></span>");
      $sp.addClass(Trillo.CSS.pointed + " js-pointed");
      var $firstChild = $foundE.find(":first-child").filter(":header");
      if ($firstChild.length) {
        $firstChild = $($firstChild[0]);
        $firstChild.prepend($sp);
        var top = parseInt($firstChild.css("height"), 10) / 2;
        $sp.css("top", top);
        var p = this.parentView();
        if (p) {
          p.synchWithRouteState($foundE.attr("nm")); // not required if parent is tocView.
        }
      }
      this.scrollIntoView($foundE);
    }
    
    return n; // we always consume rest of the path in the content view
  },
  
  scrollIntoView: function($content) {
    var containerTop = this.$e.offset().top;
    var scrollTo = $content.offset().top - containerTop;
    /* The following code enables smooth scrolling. 
     * TODO: Provide options in the viewSpec to:
     * enableSmoothScrolling : [true | false]
     * animationDurationPer1000Pixel : 200 etc.
     */
    /* var delta = Math.abs( $(window).scrollTop() - scrollTo);
    var time = Math.ceil(delta / 1000) * 100; // 100 ms for each 1000px
    $('html, body').animate({scrollTop: $content.offset().top - containerTop}, time); */
    setTimeout(function() {
      $(window).scrollTop($content.offset().top - containerTop);
    }, 0);
    return;
  }
});
Trillo.TocView = Trillo.ViewSelectionView.extend ({
  
  //TODO refactor common functionality of TocView, TabView and ViewSelectionView 
  
  itemCss: ".js-item",
  
  initialize : function($e, controller, viewSpec) {
    this._super($e, controller, viewSpec);
    this.viewSelectedMethod = $.proxy(this.viewSelected, this);
    this.mouseOverHandler = $.proxy(this.onMouseOver, this);
    this.mouseOutHandler = $.proxy(this.onMouseOut, this);
    this.delayedOnMouseOut = $.proxy(this._onMouseOut, this);
  },
  
  postShow: function(myDeferred) {
    this.$e.on("mouseover", this.mouseOverHandler);
    this.$e.on("mouseout", this.mouseOutHandler);
    this._super(myDeferred);
  },
  
  clear: function() {
    this.$e.off("mouseover", this.mouseOverHandler);
    this.$e.off("mouseout", this.mouseOutHandler);
    this._super();
  },
  
  getNextViewName: function(historySpec) {
    var $t = this.$e.find(".js-item"); 
    if ($t.length > 0) {
      return $t.attr("nm");
    }
    return null;
  },
  
  _getNextViewName: function(historySpec) {
    return null;
  },
  
  // since tocView is used with ContentView which may consume multiple paths, we look in backward direction.
  // Also note that the nodes of tocView are not fully qualified path.
  routingToNextView: function(routeSpecArr, indexOfNextView) {
    var n = routeSpecArr.length;
    for (var i=n-1; i>=indexOfNextView; i--) {
      // route until routing state update is successful.
      if (this.synchWithRouteState(routeSpecArr[i].name)) {
        break;
      }
    }
  },
  
  //view selection related method, mixin for NavView and TabView
  viewSelected: function(ev) {
    Trillo.contextMenuManager.hideCurrentContextMenu();
    if (ev) {
      //ev.stopPropagation();
      ev.preventDefault();
    }
    var $e2 = $(ev.target).closest(this.itemCss);
    var newName = $e2.attr("nm");
    if (this.updateItemSelection(newName)) {
      var l = $e2.parents(this.itemCss);
      l = l.map(function() {
        return $(this).attr("nm");
      }).get();
      var path;
      if (l.length) {
        path = l.join("/") + "/" + newName;
      } else {
        path = newName;
      }
      this.postViewSelected(path);
    }
  },
  
  clearTimeout : function() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  },
  
  onMouseOver : function() {
    this.clearTimeout();
    this.$e.find(".js-scrollbar").css("overflow", "auto");
  },

  onMouseOut : function() {
    this.clearTimeout();
    this.timer = setTimeout(this.delayedOnMouseOut, 1000);
  },

  _onMouseOut : function() {
    this.clearTimeout();
    this.$e.find(".js-scrollbar").css("overflow", "hidden");
  }
});
Trillo.FileUploadC = Trillo.Controller.extend({
  
  allowedFileTypes : ['jpg','png','gif'],
  
  initialize : function(viewSpec) {
    this._super(viewSpec);
    this.allowedFileTypes = viewSpec.params.allowedFileTypes || this.allowedFileTypes;
  },
  postViewShown : function() {
    var $e = this.$elem();
    var params = this.viewSpec.params || {};
    this.$fileNameE = $e.find('[nm="fileName"]');
    this.$file = $e.find('[nm="file"]');
    this.$file.on("change", $.proxy(this.fileSelected, this));
    $e.find('[nm="uploadFile"]').on("click", $.proxy(this.uploadFile, this));
    $e.find('form').attr("action", params.uploadUrl);
    $.each(params, function(name, value) {
      $e.find('[nm="' + name + '"]').val(value);
    });
    
  },
  fileSelected: function() {
    var s = this.$file.val(),
        ext = s.split('.').pop(),
        err = this.allowedFileTypes.indexOf(ext.toLowerCase()) < 0;
    this.$fileNameE.val(err ? "" : s);
    if (err) {
      Trillo.alert.showError("Unsupported File Type", "Only '" + this.allowedFileTypes.join() + "' files are allowed.");
    }
  },
  uploadFile : function(ev) {
    if (ev) {
      ev.stopPropagation();
      ev.preventDefault();
    }
    if($.trim(this.$fileNameE.val()) === "") {
      Trillo.alert.showError("Missing File", "Please choose a file from your computer to upload.");
      return;
    }
    Trillo.fileUploadForm = this;
    this.$elem().find('form')[0].submit();
  },
  uploadFileCompleted : function(data) {
    this.parent.fileSaved(data, this);
  },
  uploadFileFailed : function(s) {
    Trillo.alert.showError("Error", s);
  },
  postShow : function() {
    Trillo.alert.clear();
  }
});
Trillo.BaseActionH = Class.extend({
 
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
  
  handleAction: function(actionName, obj, view) {
    return false;
  }
});
