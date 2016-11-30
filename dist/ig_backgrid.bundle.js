(function (global, factory) {
     typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('backbone'), require('underscore'), require('jquery')) :
     typeof define === 'function' && define.amd ? define(['exports', 'backbone', 'underscore', 'jquery'], factory) :
     (factory((global.IGBackgrid = global.IGBackgrid || {}),global.IGBackbone,global._,global.$));
}(this, (function (exports,Backbone,_$1,$$1) { 'use strict';

Backbone = 'default' in Backbone ? Backbone['default'] : Backbone;
_$1 = 'default' in _$1 ? _$1['default'] : _$1;
$$1 = 'default' in $$1 ? $$1['default'] : $$1;

function lpad(str,length,padstr){var paddingLen=length-(str+'').length;paddingLen=paddingLen<0?0:paddingLen;var padding='';for(var i=0;i<paddingLen;i++){padding=padding+padstr;}return padding+str;}var Backgrid$2={VERSION:'0.3.7-es6',Extension:{},resolveNameToClass:function resolveNameToClass(name,suffix){if(_.isString(name)){var key=_.map(name.split('-'),function(e){return e.slice(0,1).toUpperCase()+e.slice(1);}).join('')+suffix,klass=Backgrid$2[key]||Backgrid$2.Extension[key];if(_.isUndefined(klass)){throw new ReferenceError("Class '"+key+"' not found");}return klass;}return name;},callByNeed:function callByNeed(){var value=arguments[0];if(!_.isFunction(value))return value;var context=arguments[1],args=[].slice.call(arguments,2);return value.apply(context,!!(args+'')?args:[]);},$:Backbone.$};_.extend(Backgrid$2,Backbone.Events);

/*
 backgrid-paginator
 http://github.com/wyuenho/backgrid-paginator

 Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
 Licensed under the MIT @license.
 */var PageHandle=Backgrid$2.Extension.PageHandle=Backbone.View.extend({/** @property */tagName:"li",/** @property */events:{"click button":"changePage"},/**
     @property {string|function(Object.<string, string>): string} title
     The title to use for the `title` attribute of the generated page handle
     button elements. It can be a string or a function that takes a `data`
     parameter, which contains a mandatory `label` key which provides the
     label value to be displayed.
     */title:function title(data){return'Page '+data.label;},/**
     @property {boolean} isRewind Whether this handle represents a rewind
     control
     */isRewind:false,/**
     @property {boolean} isBack Whether this handle represents a back
     control
     */isBack:false,/**
     @property {boolean} isForward Whether this handle represents a forward
     control
     */isForward:false,/**
     @property {boolean} isFastForward Whether this handle represents a fast
     forward control
     */isFastForward:false,/**
     Initializer.

     @param {Object} options
     @param {Backbone.Collection} options.collection
     @param {number} pageIndex 0-based index of the page number this handle
     handles. This parameter will be normalized to the base the underlying
     PageableCollection uses.
     @param {string} [options.label] If provided it is used to render the
     button text, otherwise the normalized pageIndex will be used
     instead. Required if any of the `is*` flags is set to `true`.
     @param {string} [options.title]
     @param {boolean} [options.isRewind=false]
     @param {boolean} [options.isBack=false]
     @param {boolean} [options.isForward=false]
     @param {boolean} [options.isFastForward=false]
     */initialize:function initialize(options){var collection=this.collection,state=collection.state,currentPage=state.currentPage,firstPage=state.firstPage,lastPage=state.lastPage;_$1.extend(this,_$1.pick(options,["isRewind","isBack","isForward","isFastForward"]));var pageIndex;if(this.isRewind)pageIndex=firstPage;else if(this.isBack)pageIndex=Math.max(firstPage,currentPage-1);else if(this.isForward)pageIndex=Math.min(lastPage,currentPage+1);else if(this.isFastForward)pageIndex=lastPage;else{pageIndex=+options.pageIndex;pageIndex=firstPage?pageIndex+1:pageIndex;}this.pageIndex=pageIndex;this.label=(options.label||(firstPage?pageIndex:pageIndex+1))+'';var title=options.title||this.title;this.title=_$1.isFunction(title)?title({label:this.label}):title;},/**
     Renders a clickable button element under a list item.
     */render:function render(){this.$el.empty();var button=document.createElement("button");button.type="button";if(this.title)button.title=this.title;button.innerHTML=this.label;this.el.appendChild(button);var collection=this.collection,state=collection.state,currentPage=state.currentPage,pageIndex=this.pageIndex;if(this.isRewind&&currentPage==state.firstPage||this.isBack&&!collection.hasPreviousPage()||this.isForward&&!collection.hasNextPage()||this.isFastForward&&(currentPage==state.lastPage||state.totalPages<1)){this.$el.addClass("disabled");}else if(!(this.isRewind||this.isBack||this.isForward||this.isFastForward)&&state.currentPage==pageIndex){this.$el.addClass("active");}this.delegateEvents();return this;},/**
     jQuery click event handler. Goes to the page this PageHandle instance
     represents. No-op if this page handle is currently active or disabled.
     */changePage:function changePage(e){e.preventDefault();var $el=this.$el,col=this.collection;if(!$el.hasClass("active")&&!$el.hasClass("disabled")){if(this.isRewind)col.getFirstPage();else if(this.isBack)col.getPreviousPage();else if(this.isForward)col.getNextPage();else if(this.isFastForward)col.getLastPage();else col.getPage(this.pageIndex,{reset:true});}return this;}});
 var Paginator=Backgrid$2.Extension.Paginator=Backbone.View.extend({/** @property */className:"backgrid-paginator",/** @property */windowSize:10,/**
     @property {number} slideScale the number used by #slideHowMuch to scale
     `windowSize` to yield the number of pages to slide. For example, the
     default windowSize(10) * slideScale(0.5) yields 5, which means the window
     will slide forward 5 pages as soon as you've reached page 6. The smaller
     the scale factor the less pages to slide, and vice versa.

     Also See:

     - #slideMaybe
     - #slideHowMuch
     */slideScale:0.5,/**
     @property {Object.<string, Object.<string, string>>} controls You can
     disable specific control handles by setting the keys in question to
     null. The defaults will be merged with your controls object, with your
     changes taking precedent.
     */controls:{rewind:{label:"《",title:"First"},back:{label:"〈",title:"Previous"},forward:{label:"〉",title:"Next"},fastForward:{label:"》",title:"Last"}},/** @property */renderIndexedPageHandles:true,/**
     @property renderMultiplePagesOnly. Determines if the paginator
     should show in cases where the collection has more than one page.
     Default is false for backwards compatibility.
     */renderMultiplePagesOnly:false,/**
     @property {Backgrid.Extension.PageHandle} pageHandle. The PageHandle
     class to use for rendering individual handles
     */pageHandle:PageHandle,/** @property */goBackFirstOnSort:true,/**
     Initializer.

     @param {Object} options
     @param {Backbone.Collection} options.collection
     @param {boolean} [options.controls]
     @param {boolean} [options.pageHandle=Backgrid.Extension.PageHandle]
     @param {boolean} [options.goBackFirstOnSort=true]
     @param {boolean} [options.renderMultiplePagesOnly=false]
     */initialize:function initialize(options){var self=this;self.controls=_$1.defaults(options.controls||{},self.controls,Paginator.prototype.controls);_$1.extend(self,_$1.pick(options||{},"windowSize","pageHandle","slideScale","goBackFirstOnSort","renderIndexedPageHandles","renderMultiplePagesOnly"));var col=self.collection;self.listenTo(col,"add",self.render);self.listenTo(col,"remove",self.render);self.listenTo(col,"reset",self.render);self.listenTo(col,"backgrid:sorted",function(){if(self.goBackFirstOnSort&&col.state.currentPage!==col.state.firstPage)col.getFirstPage({reset:true});});},/**
     Decides whether the window should slide. This method should return 1 if
     sliding should occur and 0 otherwise. The default is sliding should occur
     if half of the pages in a window has been reached.

     __Note__: All the parameters have been normalized to be 0-based.

     @param {number} firstPage
     @param {number} lastPage
     @param {number} currentPage
     @param {number} windowSize
     @param {number} slideScale

     @return {0|1}
     */slideMaybe:function slideMaybe(firstPage,lastPage,currentPage,windowSize,slideScale){return Math.round(currentPage%windowSize/windowSize);},/**
     Decides how many pages to slide when sliding should occur. The default
     simply scales the `windowSize` to arrive at a fraction of the `windowSize`
     to increment.

     __Note__: All the parameters have been normalized to be 0-based.

     @param {number} firstPage
     @param {number} lastPage
     @param {number} currentPage
     @param {number} windowSize
     @param {number} slideScale

     @return {number}
     */slideThisMuch:function slideThisMuch(firstPage,lastPage,currentPage,windowSize,slideScale){return~~(windowSize*slideScale);},_calculateWindow:function _calculateWindow(){var collection=this.collection,state=collection.state,firstPage=state.firstPage,lastPage=+state.lastPage;// convert all indices to 0-based here
lastPage=Math.max(0,firstPage?lastPage-1:lastPage);var currentPage=Math.max(state.currentPage,state.firstPage);currentPage=firstPage?currentPage-1:currentPage;var windowSize=this.windowSize,slideScale=this.slideScale,windowStart=Math.floor(currentPage/windowSize)*windowSize;if(currentPage<=lastPage-this.slideThisMuch()){windowStart+=this.slideMaybe(firstPage,lastPage,currentPage,windowSize,slideScale)*this.slideThisMuch(firstPage,lastPage,currentPage,windowSize,slideScale);}var windowEnd=Math.min(lastPage+1,windowStart+windowSize);return[windowStart,windowEnd];},/**
     Creates a list of page handle objects for rendering.

     @return {Array.<Object>} an array of page handle objects hashes
     */makeHandles:function makeHandles(){var handles=[],collection=this.collection,window=this._calculateWindow(),winStart=window[0],winEnd=window[1];if(this.renderIndexedPageHandles){for(var i=winStart;i<winEnd;i++){handles.push(new this.pageHandle({collection:collection,pageIndex:i}));}}var controls=this.controls;_$1.each(["back","rewind","forward","fastForward"],function(key){var value=controls[key];if(value){var handleCtorOpts={collection:collection,title:value.title,label:value.label};handleCtorOpts["is"+key.slice(0,1).toUpperCase()+key.slice(1)]=true;var handle=new this.pageHandle(handleCtorOpts);if(key=="rewind"||key=="back")handles.unshift(handle);else handles.push(handle);}},this);return handles;},/**
     Render the paginator handles inside an unordered list.
     */render:function render(){this.$el.empty();var totalPages=this.collection.state.totalPages;// Don't render if collection is empty
if(this.renderMultiplePagesOnly&&totalPages<=1){return this;}if(this.handles){for(var i=0,l=this.handles.length;i<l;i++){this.handles[i].remove();}}var handles=this.handles=this.makeHandles(),ul=document.createElement("ul");for(var i=0;i<handles.length;i++){ul.appendChild(handles[i].render().el);}this.el.appendChild(ul);return this;}});/**
 Paginator is a Backgrid extension that renders a series of configurable
 pagination handles. This extension is best used for splitting a large data
 set across multiple pages. If the number of pages is larger then a
 threshold, which is set to 10 by default, the page handles are rendered
 within a sliding window, plus the rewind, back, forward and fast forward
 control handles. The individual control handles can be turned off.

 @class Backgrid.Extension.Paginator
 */

var Command=function Command(evt){_$1.extend(this,{altKey:!!evt.altKey,"char":evt["char"],charCode:evt.charCode,ctrlKey:!!evt.ctrlKey,key:evt.key,keyCode:evt.keyCode,locale:evt.locale,location:evt.location,metaKey:!!evt.metaKey,repeat:!!evt.repeat,shiftKey:!!evt.shiftKey,which:evt.which});};_$1.extend(Command.prototype,{/**
     Up Arrow

     @member Backgrid.Command
   */moveUp:function moveUp(){return this.keyCode==38;},/**
     Down Arrow

     @member Backgrid.Command
   */moveDown:function moveDown(){return this.keyCode===40;},/**
     Shift Tab

     @member Backgrid.Command
   */moveLeft:function moveLeft(){return this.shiftKey&&this.keyCode===9;},/**
     Tab

     @member Backgrid.Command
   */moveRight:function moveRight(){return!this.shiftKey&&this.keyCode===9;},/**
     Enter

     @member Backgrid.Command
   */save:function save(){return this.keyCode===13;},/**
     Esc

     @member Backgrid.Command
   */cancel:function cancel(){return this.keyCode===27;},/**
     None of the above.

     @member Backgrid.Command
   */passThru:function passThru(){return!(this.moveUp()||this.moveDown()||this.moveLeft()||this.moveRight()||this.save()||this.cancel());}});

/**
   Just a convenient class for interested parties to subclass.

   The default Cell classes don't require the formatter to be a subclass of
   Formatter as long as the fromRaw(rawData) and toRaw(formattedData) methods
   are defined.

   @abstract
   @class Backgrid.CellFormatter
   @constructor
*/var CellFormatter=function CellFormatter(){};_$1.extend(CellFormatter.prototype,{/**
     Takes a raw value from a model and returns an optionally formatted string
     for display. The default implementation simply returns the supplied value
     as is without any type conversion.

     @member Backgrid.CellFormatter
     @param {*} rawData
     @param {Backbone.Model} model Used for more complicated formatting
     @return {*}
  */fromRaw:function fromRaw(rawData,model){return rawData;},/**
     Takes a formatted string, usually from user input, and returns a
     appropriately typed value for persistence in the model.

     If the user input is invalid or unable to be converted to a raw value
     suitable for persistence in the model, toRaw must return `undefined`.

     @member Backgrid.CellFormatter
     @param {string} formattedData
     @param {Backbone.Model} model Used for more complicated formatting
     @return {*|undefined}
  */toRaw:function toRaw(formattedData,model){return formattedData;}});

var NumberFormatter=function NumberFormatter(options){_$1.extend(this,this.defaults,options||{});if(this.decimals<0||this.decimals>20){throw new RangeError("decimals must be between 0 and 20");}};NumberFormatter.prototype=new CellFormatter();_$1.extend(NumberFormatter.prototype,{/**
     @member Backgrid.NumberFormatter
     @cfg {Object} options

     @cfg {number} [options.decimals=2] Number of decimals to display. Must be an integer.

     @cfg {string} [options.decimalSeparator='.'] The separator to use when
     displaying decimals.

     @cfg {string} [options.orderSeparator=','] The separator to use to
     separator thousands. May be an empty string.
   */defaults:{decimals:2,decimalSeparator:'.',orderSeparator:','},HUMANIZED_NUM_RE:/(\d)(?=(?:\d{3})+$)/g,/**
     Takes a floating point number and convert it to a formatted string where
     every thousand is separated by `orderSeparator`, with a `decimal` number of
     decimals separated by `decimalSeparator`. The number returned is rounded
     the usual way.

     @member Backgrid.NumberFormatter
     @param {number} number
     @param {Backbone.Model} model Used for more complicated formatting
     @return {string}
  */fromRaw:function fromRaw(number,model){if(_$1.isNull(number)||_$1.isUndefined(number))return'';number=parseFloat(number).toFixed(~~this.decimals);var parts=number.split('.'),integerPart=parts[0],decimalPart=parts[1]?(this.decimalSeparator||'.')+parts[1]:'';return integerPart.replace(this.HUMANIZED_NUM_RE,'$1'+this.orderSeparator)+decimalPart;},/**
     Takes a string, possibly formatted with `orderSeparator` and/or
     `decimalSeparator`, and convert it back to a number.

     @member Backgrid.NumberFormatter
     @param {string} formattedData
     @param {Backbone.Model} model Used for more complicated formatting
     @return {number|undefined} Undefined if the string cannot be converted to
     a number.
  */toRaw:function toRaw(formattedData,model){formattedData=formattedData.trim();if(formattedData==='')return null;var rawData='',thousands=formattedData.split(this.orderSeparator);for(var i=0;i<thousands.length;i++){rawData+=thousands[i];}var decimalParts=rawData.split(this.decimalSeparator);rawData='';for(var i=0;i<decimalParts.length;i++){rawData=rawData+decimalParts[i]+'.';}if(rawData[rawData.length-1]==='.'){rawData=rawData.slice(0,rawData.length-1);}var result=(rawData*1).toFixed(~~this.decimals)*1;if(_$1.isNumber(result)&&!_$1.isNaN(result))return result;}});

var PercentFormatter=function PercentFormatter(){Backgrid.NumberFormatter.apply(this,arguments);};PercentFormatter.prototype=new NumberFormatter(),_$1.extend(PercentFormatter.prototype,{/**
       @member Backgrid.PercentFormatter
       @cfg {Object} options

       @cfg {number} [options.multiplier=1] The number used to multiply the model
       value for display.

       @cfg {string} [options.symbol='%'] The symbol to append to the percentage
       string.
     */defaults:_$1.extend({},NumberFormatter.prototype.defaults,{multiplier:1,symbol:"%"}),/**
       Takes a floating point number, where the number is first multiplied by
       `multiplier`, then converted to a formatted string like
       NumberFormatter#fromRaw, then finally append `symbol` to the end.

       @member Backgrid.PercentFormatter
       @param {number} rawValue
       @param {Backbone.Model} model Used for more complicated formatting
       @return {string}
    */fromRaw:function fromRaw(number,model){var args=[].slice.call(arguments,1);args.unshift(number*this.multiplier);return(NumberFormatter.prototype.fromRaw.apply(this,args)||"0")+this.symbol;},/**
       Takes a string, possibly appended with `symbol` and/or `decimalSeparator`,
       and convert it back to a number for the model like NumberFormatter#toRaw,
       and then dividing it by `multiplier`.

       @member Backgrid.PercentFormatter
       @param {string} formattedData
       @param {Backbone.Model} model Used for more complicated formatting
       @return {number|undefined} Undefined if the string cannot be converted to
       a number.
    */toRaw:function toRaw(formattedValue,model){var tokens=formattedValue.split(this.symbol);if(tokens&&tokens[0]&&tokens[1]===""||tokens[1]==null){var rawValue=NumberFormatter.prototype.toRaw.call(this,tokens[0]);if(_$1.isUndefined(rawValue))return rawValue;return rawValue/this.multiplier;}}});

var DatetimeFormatter=function DatetimeFormatter(options){_.extend(this,this.defaults,options||{});if(!this.includeDate&&!this.includeTime){throw new Error("Either includeDate or includeTime must be true");}};DatetimeFormatter.prototype=new CellFormatter();_.extend(DatetimeFormatter.prototype,{/**
     @member Backgrid.DatetimeFormatter

     @cfg {Object} options

     @cfg {boolean} [options.includeDate=true] Whether the values include the
     date part.

     @cfg {boolean} [options.includeTime=true] Whether the values include the
     time part.

     @cfg {boolean} [options.includeMilli=false] If `includeTime` is true,
     whether to include the millisecond part, if it exists.
   */defaults:{includeDate:true,includeTime:true,includeMilli:false},DATE_RE:/^([+\-]?\d{4})-(\d{2})-(\d{2})$/,TIME_RE:/^(\d{2}):(\d{2}):(\d{2})(\.(\d{3}))?$/,ISO_SPLITTER_RE:/T|Z| +/,_convert:function _convert(data,validate){if((data+'').trim()==='')return null;var date,time=null;if(_.isNumber(data)){var jsDate=new Date(data);date=lpad(jsDate.getUTCFullYear(),4,0)+'-'+lpad(jsDate.getUTCMonth()+1,2,0)+'-'+lpad(jsDate.getUTCDate(),2,0);time=lpad(jsDate.getUTCHours(),2,0)+':'+lpad(jsDate.getUTCMinutes(),2,0)+':'+lpad(jsDate.getUTCSeconds(),2,0);}else{data=data.trim();var parts=data.split(this.ISO_SPLITTER_RE)||[];date=this.DATE_RE.test(parts[0])?parts[0]:'';time=date&&parts[1]?parts[1]:this.TIME_RE.test(parts[0])?parts[0]:'';}var YYYYMMDD=this.DATE_RE.exec(date)||[],HHmmssSSS=this.TIME_RE.exec(time)||[];if(validate){if(this.includeDate&&_.isUndefined(YYYYMMDD[0]))return;if(this.includeTime&&_.isUndefined(HHmmssSSS[0]))return;if(!this.includeDate&&date)return;if(!this.includeTime&&time)return;}var jsDate=new Date(Date.UTC(YYYYMMDD[1]*1||0,YYYYMMDD[2]*1-1||0,YYYYMMDD[3]*1||0,HHmmssSSS[1]*1||null,HHmmssSSS[2]*1||null,HHmmssSSS[3]*1||null,HHmmssSSS[5]*1||null)),result='';if(this.includeDate){result=lpad(jsDate.getUTCFullYear(),4,0)+'-'+lpad(jsDate.getUTCMonth()+1,2,0)+'-'+lpad(jsDate.getUTCDate(),2,0);}if(this.includeTime){result=result+(this.includeDate?'T':'')+lpad(jsDate.getUTCHours(),2,0)+':'+lpad(jsDate.getUTCMinutes(),2,0)+':'+lpad(jsDate.getUTCSeconds(),2,0);if(this.includeMilli){result=result+'.'+lpad(jsDate.getUTCMilliseconds(),3,0);}}if(this.includeDate&&this.includeTime){result+="Z";}return result;},/**
     Converts an ISO-8601 formatted datetime string to a datetime string, date
     string or a time string. The timezone is ignored if supplied.

     @member Backgrid.DatetimeFormatter
     @param {string} rawData
     @param {Backbone.Model} model Used for more complicated formatting
     @return {string|null|undefined} ISO-8601 string in UTC. Null and undefined
     values are returned as is.
  */fromRaw:function fromRaw(rawData,model){if(_.isNull(rawData)||_.isUndefined(rawData))return'';return this._convert(rawData);},/**
     Converts an ISO-8601 formatted datetime string to a datetime string, date
     string or a time string. The timezone is ignored if supplied. This method
     parses the input values exactly the same way as
     Backgrid.Extension.MomentFormatter#fromRaw(), in addition to doing some
     sanity checks.

     @member Backgrid.DatetimeFormatter
     @param {string} formattedData
     @param {Backbone.Model} model Used for more complicated formatting
     @return {string|undefined} ISO-8601 string in UTC. Undefined if a date is
     found when `includeDate` is false, or a time is found when `includeTime` is
     false, or if `includeDate` is true and a date is not found, or if
     `includeTime` is true and a time is not found.
  */toRaw:function toRaw(formattedData,model){return this._convert(formattedData,true);}});

var StringFormatter=function StringFormatter(){};StringFormatter.prototype=new CellFormatter();_.extend(StringFormatter.prototype,{/**
     Converts any value to a string using Ecmascript's implicit type
     conversion. If the given value is `null` or `undefined`, an empty string is
     returned instead.

     @member Backgrid.StringFormatter
     @param {*} rawValue
     @param {Backbone.Model} model Used for more complicated formatting
     @return {string}
   */fromRaw:function fromRaw(rawValue,model){if(_.isUndefined(rawValue)||_.isNull(rawValue))return'';return rawValue+'';}});

var EmailFormatter=function EmailFormatter(){};EmailFormatter.prototype=new CellFormatter();_.extend(EmailFormatter.prototype,{/**
     Return the input if it is a string that contains an '@' character and if
     the strings before and after '@' are non-empty. If the input does not
     validate, `undefined` is returned.

     @member Backgrid.EmailFormatter
     @param {*} formattedData
     @param {Backbone.Model} model Used for more complicated formatting
     @return {string|undefined}
   */toRaw:function toRaw(formattedData,model){var parts=formattedData.trim().split("@");if(parts.length===2&&_.all(parts)){return formattedData;}}});

var SelectFormatter=function SelectFormatter(){};SelectFormatter.prototype=new CellFormatter();_.extend(SelectFormatter.prototype,{/**
     Normalizes raw scalar or array values to an array.

     @member Backgrid.SelectFormatter
     @param {*} rawValue
     @param {Backbone.Model} model Used for more complicated formatting
     @return {Array.<*>}
  */fromRaw:function fromRaw(rawValue,model){return _.isArray(rawValue)?rawValue:rawValue!=null?[rawValue]:[];}});

/**
   HeaderCell is a special cell class that renders a column header cell. If the
   column is sortable, a sorter is also rendered and will trigger a table
   refresh after sorting.

   @class Backgrid.HeaderCell
   @extends Backbone.View
 */var HeaderCell=Backbone.View.extend({/** @property */tagName:"th",/** @property */events:{"click button":"onClick"},/**
     Initializer.

     @param {Object} options
     @param {Backgrid.Column|Object} options.column

     @throws {TypeError} If options.column or options.collection is undefined.
   */initialize:function initialize(options){this.column=options.column;if(!(this.column instanceof Column)){this.column=new Column(this.column);}var column=this.column,collection=this.collection,$el=this.$el;this.listenTo(column,"change:editable change:sortable change:renderable",function(column){var changed=column.changedAttributes();for(var key in changed){if(changed.hasOwnProperty(key)){$el.toggleClass(key,changed[key]);}}});this.listenTo(column,"change:direction",this.setCellDirection);this.listenTo(column,"change:name change:label",this.render);if(Backgrid$2.callByNeed(column.editable(),column,collection))$el.addClass("editable");if(Backgrid$2.callByNeed(column.sortable(),column,collection))$el.addClass("sortable");if(Backgrid$2.callByNeed(column.renderable(),column,collection))$el.addClass("renderable");this.listenTo(collection.fullCollection||collection,"backgrid:sorted",this.removeCellDirection);},/**
     Event handler for the collection's `backgrid:sorted` event. Removes
     all the CSS direction classes.
   */removeCellDirection:function removeCellDirection(){this.$el.removeClass("ascending").removeClass("descending");this.column.set("direction",null);},/**
     Event handler for the column's `change:direction` event. If this
     HeaderCell's column is being sorted on, it applies the direction given as a
     CSS class to the header cell. Removes all the CSS direction classes
     otherwise.
   */setCellDirection:function setCellDirection(column,direction){this.$el.removeClass("ascending").removeClass("descending");if(column.cid==this.column.cid)this.$el.addClass(direction);},/**
     Event handler for the `click` event on the cell's anchor. If the column is
     sortable, clicking on the anchor will cycle through 3 sorting orderings -
     `ascending`, `descending`, and default.
   */onClick:function onClick(e){e.preventDefault();var column=this.column,collection=this.collection,event="backgrid:sort";function cycleSort(header,col){if(column.get("direction")==="ascending")collection.trigger(event,col,"descending");else if(column.get("direction")==="descending")collection.trigger(event,col,null);else collection.trigger(event,col,"ascending");}function toggleSort(header,col){if(column.get("direction")==="ascending")collection.trigger(event,col,"descending");else collection.trigger(event,col,"ascending");}var sortable=Backgrid$2.callByNeed(column.sortable(),column,this.collection);if(sortable){var sortType=column.get("sortType");if(sortType==="toggle")toggleSort(this,column);else cycleSort(this,column);}},/**
     Renders a header cell with a sorter, a label, and a class name for this
     column.
   */render:function render(){this.$el.empty();var column=this.column,sortable=Backgrid$2.callByNeed(column.sortable(),column,this.collection),label;if(sortable){label=$$1("<button>").text(column.get("label")).append("<span class='sort-caret' aria-hidden='true'></span>");}else{label=document.createTextNode(column.get("label"));}this.$el.append(label);this.$el.addClass(column.get("name"));this.$el.addClass(column.get("direction"));this.delegateEvents();return this;}});

/**
   A Column is a placeholder for column metadata.

   You usually don't need to create an instance of this class yourself as a
   collection of column instances will be created for you from a list of column
   attributes in the Backgrid.js view class constructors.

   @class Backgrid.Column
   @extends Backbone.Model
*/var Column=Backbone.Model.extend({/**
     @cfg {Object} defaults Column defaults. To override any of these default
     values, you can either change the prototype directly to override
     Column.defaults globally or extend Column and supply the custom class to
     Backgrid.Grid:

         // Override Column defaults globally
         Column.prototype.defaults.sortable = false;

         // Override Column defaults locally
         var MyColumn = Column.extend({
           defaults: _.defaults({
             editable: false
           }, Column.prototype.defaults)
         });

         var grid = new Backgrid.Grid(columns: new Columns([{...}, {...}], {
           model: MyColumn
         }));

     @cfg {string} [defaults.name] The default name of the model attribute.

     @cfg {string} [defaults.label] The default label to show in the header.

     @cfg {string|Backgrid.Cell} [defaults.cell] The default cell type. If this
     is a string, the capitalized form will be used to look up a cell class in
     Backbone, i.e.: string => StringCell. If a Cell subclass is supplied, it is
     initialized with a hash of parameters. If a Cell instance is supplied, it
     is used directly.

     @cfg {string|Backgrid.HeaderCell} [defaults.headerCell] The default header
     cell type.

     @cfg {boolean|string|function(): boolean} [defaults.sortable=true] Whether
     this column is sortable. If the value is a string, a method will the same
     name will be looked up from the column instance to determine whether the
     column should be sortable. The method's signature must be `function
     (Backgrid.Column, Backbone.Model): boolean`.

     @cfg {boolean|string|function(): boolean} [defaults.editable=true] Whether
     this column is editable. If the value is a string, a method will the same
     name will be looked up from the column instance to determine whether the
     column should be editable. The method's signature must be `function
     (Backgrid.Column, Backbone.Model): boolean`.

     @cfg {boolean|string|function(): boolean} [defaults.renderable=true]
     Whether this column is renderable. If the value is a string, a method will
     the same name will be looked up from the column instance to determine
     whether the column should be renderable. The method's signature must be
     `function (Backrid.Column, Backbone.Model): boolean`.

     @cfg {Backgrid.CellFormatter | Object | string} [defaults.formatter] The
     formatter to use to convert between raw model values and user input.

     @cfg {"toggle"|"cycle"} [defaults.sortType="cycle"] Whether sorting will
     toggle between ascending and descending order, or cycle between insertion
     order, ascending and descending order.

     @cfg {(function(Backbone.Model, string): *) | string} [defaults.sortValue]
     The function to use to extract a value from the model for comparison during
     sorting. If this value is a string, a method with the same name will be
     looked up from the column instance.

     @cfg {"ascending"|"descending"|null} [defaults.direction=null] The initial
     sorting direction for this column. The default is ordered by
     Backbone.Model.cid, which usually means the collection is ordered by
     insertion order.
  */defaults:{name:undefined,label:undefined,sortable:true,editable:true,renderable:true,formatter:undefined,sortType:"cycle",sortValue:undefined,direction:null,cell:undefined,headerCell:undefined},/**
     Initializes this Column instance.

     @param {Object} attrs

     @param {string} attrs.name The model attribute this column is responsible
     for.

     @param {string|Backgrid.Cell} attrs.cell The cell type to use to render
     this column.

     @param {string} [attrs.label]

     @param {string|Backgrid.HeaderCell} [attrs.headerCell]

     @param {boolean|string|function(): boolean} [attrs.sortable=true]

     @param {boolean|string|function(): boolean} [attrs.editable=true]

     @param {boolean|string|function(): boolean} [attrs.renderable=true]

     @param {Backgrid.CellFormatter | Object | string} [attrs.formatter]

     @param {"toggle"|"cycle"}  [attrs.sortType="cycle"]

     @param {(function(Backbone.Model, string): *) | string} [attrs.sortValue]

     @throws {TypeError} If attrs.cell or attrs.options are not supplied.

     @throws {ReferenceError} If formatter is a string but a formatter class of
     said name cannot be found in the Backgrid module.

     See:

     - Backgrid.Column.defaults
     - Backgrid.Cell
     - Backgrid.CellFormatter
   */initialize:function initialize(){if(!this.has("label")){this.set({label:this.get("name")},{silent:true});}var headerCell=Backgrid$2.resolveNameToClass(this.get("headerCell"),"HeaderCell"),cell=Backgrid$2.resolveNameToClass(this.get("cell"),"Cell");this.set({cell:cell,headerCell:headerCell},{silent:true});},/**
     Returns an appropriate value extraction function from a model for sorting.

     If the column model contains an attribute `sortValue`, if it is a string, a
     method from the column instance identifified by the `sortValue` string is
     returned. If it is a function, it it returned as is. If `sortValue` isn't
     found from the column model's attributes, a default value extraction
     function is returned which will compare according to the natural order of
     the value's type.

     @return {function(Backbone.Model, string): *}
   */sortValue:function sortValue(){var sortValue=this.get("sortValue");if(_.isString(sortValue))return this[sortValue];else if(_.isFunction(sortValue))return sortValue;return function(model,colName){return model.get(colName);};}/**
     @member Backgrid.Column
     @protected
     @method sortable
     @return {function(Backgrid.Column, Backbone.Model): boolean | boolean}
  *//**
     @member Backgrid.Column
     @protected
     @method editable
     @return {function(Backgrid.Column, Backbone.Model): boolean | boolean}
  *//**
     @member Backgrid.Column
     @protected
     @method renderable
     @return {function(Backgrid.Column, Backbone.Model): boolean | boolean}
  */});_.each(["sortable","renderable","editable"],function(key){Column.prototype[key]=function(){var value=this.get(key);if(_.isString(value))return this[value];else if(_.isFunction(value))return value;return!!value;};});

/**
   Generic cell editor base class. Only defines an initializer for a number of
   required parameters.

   @abstract
   @class Backgrid.CellEditor
   @extends Backbone.View
*/var CellEditor=Backbone.View.extend({/**
     Initializer.

     @param {Object} options
     @param {Backgrid.CellFormatter} options.formatter
     @param {Backgrid.Column} options.column
     @param {Backbone.Model} options.model

     @throws {TypeError} If `formatter` is not a formatter instance, or when
     `model` or `column` are undefined.
  */initialize:function initialize(options){this.formatter=options.formatter;this.column=options.column;if(!(this.column instanceof Column)){this.column=new Column(this.column);}this.listenTo(this.model,"backgrid:editing",this.postRender);},/**
     Post-rendering setup and initialization. Focuses the cell editor's `el` in
     this default implementation. **Should** be called by Cell classes after
     calling Backgrid.CellEditor#render.
  */postRender:function postRender(model,column){if(column==null||column.get("name")==this.column.get("name")){this.$el.focus();}return this;}});

var SelectCellEditor=CellEditor.extend({/** @property */tagName:"select",/** @property */events:{"change":"save","blur":"close","keydown":"close"},/** @property {function(Object, ?Object=): string} template */template:_.template('<option value="<%- value %>" <%= selected ? \'selected="selected"\' : "" %>><%- text %></option>',null,{variable:null,evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g}),setOptionValues:function setOptionValues(optionValues){this.optionValues=optionValues;this.optionValues=_.result(this,"optionValues");},setMultiple:function setMultiple(multiple){this.multiple=multiple;this.$el.prop("multiple",multiple);},_renderOptions:function _renderOptions(nvps,selectedValues){var options='';for(var i=0;i<nvps.length;i++){options=options+this.template({text:nvps[i][0],value:nvps[i][1],selected:_.indexOf(selectedValues,nvps[i][1])>-1});}return options;},/**
     Renders the options if `optionValues` is a list of name-value pairs. The
     options are contained inside option groups if `optionValues` is a list of
     object hashes. The name is rendered at the option text and the value is the
     option value. If `optionValues` is a function, it is called without a
     parameter.
  */render:function render(){this.$el.empty();var optionValues=_.result(this,"optionValues"),model=this.model,selectedValues=this.formatter.fromRaw(model.get(this.column.get("name")),model);if(!_.isArray(optionValues))throw new TypeError("optionValues must be an array");var optionValue=null,optionText=null,optionValue=null,optgroupName=null,optgroup=null;for(var i=0;i<optionValues.length;i++){var optionValue=optionValues[i];if(_.isArray(optionValue)){optionText=optionValue[0];optionValue=optionValue[1];this.$el.append(this.template({text:optionText,value:optionValue,selected:_.indexOf(selectedValues,optionValue)>-1}));}else if(_.isObject(optionValue)){optgroupName=optionValue.name;optgroup=$("<optgroup></optgroup>",{label:optgroupName});optgroup.append(this._renderOptions.call(this,optionValue.values,selectedValues));this.$el.append(optgroup);}else{throw new TypeError("optionValues elements must be a name-value pair or an object hash of { name: 'optgroup label', value: [option name-value pairs] }");}}this.delegateEvents();return this;},/**
     Saves the value of the selected option to the model attribute.
  */save:function save(e){var model=this.model,column=this.column;model.set(column.get("name"),this.formatter.toRaw(this.$el.val(),model));},/**
     Triggers a `backgrid:edited` event from the model so the body can close
     this editor.
  */close:function close(e){var model=this.model,column=this.column,command=new Command(e);if(command.cancel()){e.stopPropagation();model.trigger("backgrid:edited",model,column,new Command(e));}else if(command.save()||command.moveLeft()||command.moveRight()||command.moveUp()||command.moveDown()||e.type=="blur"){e.preventDefault();e.stopPropagation();this.save(e);model.trigger("backgrid:edited",model,column,new Command(e));}}});

var InputCellEditor=CellEditor.extend({/** @property */tagName:"input",/** @property */attributes:{type:"text"},/** @property */events:{"blur":"saveOrCancel","keydown":"saveOrCancel"},/**
     Initializer. Removes this `el` from the DOM when a `done` event is
     triggered.

     @param {Object} options
     @param {Backgrid.CellFormatter} options.formatter
     @param {Backgrid.Column} options.column
     @param {Backbone.Model} options.model
     @param {string} [options.placeholder]
  */initialize:function initialize(options){InputCellEditor.__super__.initialize.apply(this,arguments);if(options.placeholder){this.$el.attr("placeholder",options.placeholder);}},/**
     Renders a text input with the cell value formatted for display, if it
     exists.
  */render:function render(){var model=this.model;this.$el.val(this.formatter.fromRaw(model.get(this.column.get("name")),model));return this;},/**
     If the key pressed is `enter`, `tab`, `up`, or `down`, converts the value
     in the editor to a raw value for saving into the model using the formatter.

     If the key pressed is `esc` the changes are undone.

     If the editor goes out of focus (`blur`) but the value is invalid, the
     event is intercepted and cancelled so the cell remains in focus pending for
     further action. The changes are saved otherwise.

     Triggers a Backbone `backgrid:edited` event from the model when successful,
     and `backgrid:error` if the value cannot be converted. Classes listening to
     the `error` event, usually the Cell classes, should respond appropriately,
     usually by rendering some kind of error feedback.

     @param {Event} e
  */saveOrCancel:function saveOrCancel(e){var formatter=this.formatter,model=this.model,column=this.column,command=new Command(e),blurred=e.type==="blur";if(command.moveUp()||command.moveDown()||command.moveLeft()||command.moveRight()||command.save()||blurred){e.preventDefault();e.stopPropagation();var val=this.$el.val(),newValue=formatter.toRaw(val,model);if(_.isUndefined(newValue)){model.trigger("backgrid:error",model,column,val);}else{model.set(column.get("name"),newValue);model.trigger("backgrid:edited",model,column,command);}}// esc
else if(command.cancel()){// undo
e.stopPropagation();model.trigger("backgrid:edited",model,column,command);}},postRender:function postRender(model,column){if(column==null||column.get("name")==this.column.get("name")){// move the cursor to the end on firefox if text is right aligned
if(this.$el.css("text-align")==="right"){var val=this.$el.val();this.$el.focus().val(null).val(val);}else this.$el.focus();}return this;}});

var BooleanCellEditor=CellEditor.extend({/** @property */tagName:"input",/** @property */attributes:{tabIndex:-1,type:"checkbox"},/** @property */events:{"mousedown":function mousedown(){this.mouseDown=true;},"blur":"enterOrExitEditMode","mouseup":function mouseup(){this.mouseDown=false;},"change":"saveOrCancel","keydown":"saveOrCancel"},/**
     Renders a checkbox and check it if the model value of this column is true,
     uncheck otherwise.
  */render:function render(){var model=this.model,val=this.formatter.fromRaw(model.get(this.column.get("name")),model);this.$el.prop("checked",val);return this;},/**
     Event handler. Hack to deal with the case where `blur` is fired before
     `change` and `click` on a checkbox.
  */enterOrExitEditMode:function enterOrExitEditMode(e){if(!this.mouseDown){var model=this.model;model.trigger("backgrid:edited",model,this.column,new Command(e));}},/**
     Event handler. Save the value into the model if the event is `change` or
     one of the keyboard navigation key presses. Exit edit mode without saving
     if `escape` was pressed.
  */saveOrCancel:function saveOrCancel(e){var model=this.model,column=this.column,formatter=this.formatter,command=new Command(e);// skip ahead to `change` when space is pressed
if(command.passThru()&&e.type!="change")return true;if(command.cancel()){e.stopPropagation();model.trigger("backgrid:edited",model,column,command);}var $el=this.$el;if(command.save()||command.moveLeft()||command.moveRight()||command.moveUp()||command.moveDown()){e.preventDefault();e.stopPropagation();var val=formatter.toRaw($el.prop("checked"),model);model.set(column.get("name"),val);model.trigger("backgrid:edited",model,column,command);}else if(e.type=="change"){var val=formatter.toRaw($el.prop("checked"),model);model.set(column.get("name"),val);$el.focus();}}});

var Cell=Backgrid$2.Cell=Backbone.View.extend({/** @property */tagName:"td",/**
     @property {Backgrid.CellFormatter|Object|string} [formatter=CellFormatter]
  */formatter:CellFormatter,/**
     @property {Backgrid.CellEditor} [editor=Backgrid.InputCellEditor] The
     default editor for all cell instances of this class. This value must be a
     class, it will be automatically instantiated upon entering edit mode.

     See Backgrid.CellEditor
  */editor:InputCellEditor,/** @property */events:{"click":"enterEditMode"},/**
     Initializer.

     @param {Object} options
     @param {Backbone.Model} options.model
     @param {Backgrid.Column} options.column

     @throws {ReferenceError} If formatter is a string but a formatter class of
     said name cannot be found in the Backgrid module.
  */initialize:function initialize(options){this.column=options.column;if(!(this.column instanceof Column)){this.column=new Column(this.column);}var column=this.column,model=this.model,$el=this.$el,formatter=Backgrid$2.resolveNameToClass(column.get("formatter")||this.formatter,"Formatter");if(!_.isFunction(formatter.fromRaw)&&!_.isFunction(formatter.toRaw)){formatter=new formatter();}this.formatter=formatter;this.editor=Backgrid$2.resolveNameToClass(this.editor,"CellEditor");this.listenTo(model,"change:"+column.get("name"),function(){if(!$el.hasClass("editor"))this.render();});this.listenTo(model,"backgrid:error",this.renderError);this.listenTo(column,"change:editable change:sortable change:renderable",function(column){var changed=column.changedAttributes();for(var key in changed){if(changed.hasOwnProperty(key)){$el.toggleClass(key,changed[key]);}}});this.updateStateClassesMaybe();},updateStateClassesMaybe:function updateStateClassesMaybe(){var model=this.model,column=this.column,$el=this.$el;$el.toggleClass("editable",Backgrid$2.callByNeed(column.editable(),column,model));$el.toggleClass("sortable",Backgrid$2.callByNeed(column.sortable(),column,model));$el.toggleClass("renderable",Backgrid$2.callByNeed(column.renderable(),column,model));},/**
     Render a text string in a table cell. The text is converted from the
     model's raw value for this cell's column.
  */render:function render(){var $el=this.$el;$el.empty();var model=this.model,columnName=this.column.get("name");$el.text(this.formatter.fromRaw(model.get(columnName),model));$el.addClass(columnName);this.updateStateClassesMaybe();this.delegateEvents();return this;},/**
     If this column is editable, a new CellEditor instance is instantiated with
     its required parameters. An `editor` CSS class is added to the cell upon
     entering edit mode.

     This method triggers a Backbone `backgrid:edit` event from the model when
     the cell is entering edit mode and an editor instance has been constructed,
     but before it is rendered and inserted into the DOM. The cell and the
     constructed cell editor instance are sent as event parameters when this
     event is triggered.

     When this cell has finished switching to edit mode, a Backbone
     `backgrid:editing` event is triggered from the model. The cell and the
     constructed cell instance are also sent as parameters in the event.

     When the model triggers a `backgrid:error` event, it means the editor is
     unable to convert the current user input to an apprpriate value for the
     model's column, and an `error` CSS class is added to the cell accordingly.
  */enterEditMode:function enterEditMode(){var model=this.model,column=this.column,editable=Backgrid$2.callByNeed(column.editable(),column,model);if(editable){this.currentEditor=new this.editor({column:this.column,model:this.model,formatter:this.formatter});model.trigger("backgrid:edit",model,column,this,this.currentEditor);// Need to redundantly undelegate events for Firefox
this.undelegateEvents();this.$el.empty();this.$el.append(this.currentEditor.$el);this.currentEditor.render();this.$el.addClass("editor");model.trigger("backgrid:editing",model,column,this,this.currentEditor);}},/**
     Put an `error` CSS class on the table cell.
  */renderError:function renderError(model,column){if(column==null||column.get("name")==this.column.get("name")){this.$el.addClass("error");}},/**
     Removes the editor and re-render in display mode.
  */exitEditMode:function exitEditMode(){this.$el.removeClass("error");this.currentEditor.remove();this.stopListening(this.currentEditor);delete this.currentEditor;this.$el.removeClass("editor");this.render();},/**
     Clean up this cell.

     @chainable
  */remove:function remove(){if(this.currentEditor){this.currentEditor.remove.apply(this.currentEditor,arguments);delete this.currentEditor;}return Cell.__super__.remove.apply(this,arguments);}});

var $$2=Backgrid$2.$;
var BooleanCell=Cell.extend({/** @property */className:"boolean-cell",/** @property */editor:BooleanCellEditor,/** @property */events:{"click":"enterEditMode"},/**
     Renders a checkbox and check it if the model value of this column is true,
     uncheck otherwise.
  */render:function render(){this.$el.empty();var model=this.model,column=this.column,editable=Backgrid$2.callByNeed(column.editable(),column,model);this.$el.append($$2("<input>",{tabIndex:-1,type:"checkbox",checked:this.formatter.fromRaw(model.get(column.get("name")),model),disabled:!editable}));this.delegateEvents();return this;}});

var SelectCell=Cell.extend({/** @property */className:"select-cell",/** @property */editor:SelectCellEditor,/** @property */multiple:false,/** @property */formatter:SelectFormatter,/**
     @property {Array.<Array>|Array.<{name: string, values: Array.<Array>}>} optionValues
  */optionValues:undefined,/** @property */delimiter:', ',/**
     Initializer.

     @param {Object} options
     @param {Backbone.Model} options.model
     @param {Backgrid.Column} options.column

     @throws {TypeError} If `optionsValues` is undefined.
  */initialize:function initialize(options){SelectCell.__super__.initialize.apply(this,arguments);this.listenTo(this.model,"backgrid:edit",function(model,column,cell,editor){if(column.get("name")==this.column.get("name")){editor.setOptionValues(this.optionValues);editor.setMultiple(this.multiple);}});},/**
     Renders the label using the raw value as key to look up from `optionValues`.

     @throws {TypeError} If `optionValues` is malformed.
  */render:function render(){this.$el.empty();var optionValues=_.result(this,"optionValues"),model=this.model,rawData=this.formatter.fromRaw(model.get(this.column.get("name")),model),selectedText=[];try{if(!_.isArray(optionValues)||_.isEmpty(optionValues))throw new TypeError();for(var k=0;k<rawData.length;k++){var rawDatum=rawData[k];for(var i=0;i<optionValues.length;i++){var optionValue=optionValues[i];if(_.isArray(optionValue)){var optionText=optionValue[0],optionValue=optionValue[1];if(optionValue==rawDatum)selectedText.push(optionText);}else if(_.isObject(optionValue)){var optionGroupValues=optionValue.values;for(var j=0;j<optionGroupValues.length;j++){var optionGroupValue=optionGroupValues[j];if(optionGroupValue[1]==rawDatum){selectedText.push(optionGroupValue[0]);}}}else{throw new TypeError();}}}this.$el.append(selectedText.join(this.delimiter));}catch(ex){if(ex instanceof TypeError){throw new TypeError("'optionValues' must be of type {Array.<Array>|Array.<{name: string, values: Array.<Array>}>}");}throw ex;}this.delegateEvents();return this;}});

var DatetimeCell=Cell.extend({/** @property */className:"datetime-cell",/**
     @property {boolean} [includeDate=true]
  */includeDate:DatetimeFormatter.prototype.defaults.includeDate,/**
     @property {boolean} [includeTime=true]
  */includeTime:DatetimeFormatter.prototype.defaults.includeTime,/**
     @property {boolean} [includeMilli=false]
  */includeMilli:DatetimeFormatter.prototype.defaults.includeMilli,/** @property {Backgrid.CellFormatter} [formatter=Backgrid.DatetimeFormatter] */formatter:DatetimeFormatter,/**
     Initializes this cell and the datetime formatter.

     @param {Object} options
     @param {Backbone.Model} options.model
     @param {Backgrid.Column} options.column
  */initialize:function initialize(options){DatetimeCell.__super__.initialize.apply(this,arguments);var formatter=this.formatter;formatter.includeDate=this.includeDate;formatter.includeTime=this.includeTime;formatter.includeMilli=this.includeMilli;var placeholder=this.includeDate?"YYYY-MM-DD":"";placeholder+=this.includeDate&&this.includeTime?"T":"";placeholder+=this.includeTime?"HH:mm:ss":"";placeholder+=this.includeTime&&this.includeMilli?".SSS":"";this.editor=this.editor.extend({attributes:_.extend({},this.editor.prototype.attributes,this.editor.attributes,{placeholder:placeholder})});}});

var UriCell=Cell.extend({/** @property */className:"uri-cell",/**
     @property {string} [title] The title attribute of the generated anchor. It
     uses the display value formatted by the `formatter.fromRaw` by default.
  */title:null,/**
     @property {string} [target="_blank"] The target attribute of the generated
     anchor.
  */target:"_blank",initialize:function initialize(options){UriCell.__super__.initialize.apply(this,arguments);this.title=options.title||this.title;this.target=options.target||this.target;},render:function render(){this.$el.empty();var rawValue=this.model.get(this.column.get("name")),formattedValue=this.formatter.fromRaw(rawValue,this.model);this.$el.append($("<a>",{tabIndex:-1,href:rawValue,title:this.title||formattedValue,target:this.target}).text(formattedValue));this.delegateEvents();return this;}});

/**
   NumberCell is a generic cell that renders all numbers. Numbers are formatted
   using a Backgrid.NumberFormatter.

   @class Backgrid.NumberCell
   @extends Backgrid.Cell
*/var NumberCell=Cell.extend({/** @property */className:"number-cell",/**
     @property {number} [decimals=2] Must be an integer.
  */decimals:NumberFormatter.prototype.defaults.decimals,/** @property {string} [decimalSeparator='.'] */decimalSeparator:NumberFormatter.prototype.defaults.decimalSeparator,/** @property {string} [orderSeparator=','] */orderSeparator:NumberFormatter.prototype.defaults.orderSeparator,/** @property {Backgrid.CellFormatter} [formatter=Backgrid.NumberFormatter] */formatter:NumberFormatter,/**
     Initializes this cell and the number formatter.

     @param {Object} options
     @param {Backbone.Model} options.model
     @param {Backgrid.Column} options.column
  */initialize:function initialize(options){NumberCell.__super__.initialize.apply(this,arguments);var formatter=this.formatter;formatter.decimals=this.decimals;formatter.decimalSeparator=this.decimalSeparator;formatter.orderSeparator=this.orderSeparator;}});

var StringCell=Cell.extend({/** @property */className:"string-cell",formatter:StringFormatter});

var EmailCell=StringCell.extend({/** @property */className:"email-cell",formatter:EmailFormatter,render:function render(){this.$el.empty();var model=this.model,formattedValue=this.formatter.fromRaw(model.get(this.column.get("name")),model);this.$el.append($("<a>",{tabIndex:-1,href:"mailto:"+formattedValue,title:formattedValue}).text(formattedValue));this.delegateEvents();return this;}});

var IntegerCell=NumberCell.extend({/** @property */className:"integer-cell",/**
     @property {number} decimals Must be an integer.
  */decimals:0});

var PercentCell=NumberCell.extend({/** @property */className:"percent-cell",/** @property {number} [multiplier=1] */multiplier:PercentFormatter.prototype.defaults.multiplier,/** @property {string} [symbol='%'] */symbol:PercentFormatter.prototype.defaults.symbol,/** @property {Backgrid.CellFormatter} [formatter=Backgrid.PercentFormatter] */formatter:PercentFormatter,/**
     Initializes this cell and the percent formatter.

     @param {Object} options
     @param {Backbone.Model} options.model
     @param {Backgrid.Column} options.column
  */initialize:function initialize(){PercentCell.__super__.initialize.apply(this,arguments);var formatter=this.formatter;formatter.multiplier=this.multiplier;formatter.symbol=this.symbol;}});

var DateCell=DatetimeCell.extend({/** @property */className:"date-cell",/** @property */includeTime:false});

var TimeCell=DatetimeCell.extend({/** @property */className:"time-cell",/** @property */includeDate:false});

var Columns=Backbone.PageableCollection.extend({/**
	   @property {Backgrid.Column} model
	 */model:Column});

/**
   Row is a simple container view that takes a model instance and a list of
   column metadata describing how each of the model's attribute is to be
   rendered, and apply the appropriate cell to each attribute.

   @class Backgrid.Row
   @extends Backbone.View
*/var Row=Backbone.View.extend({/** @property */tagName:"tr",/**
     Initializes a row view instance.

     @param {Object} options
     @param {Backbone.Collection.<Backgrid.Column>|Array.<Backgrid.Column>|Array.<Object>} options.columns Column metadata.
     @param {Backbone.Model} options.model The model instance to render.

     @throws {TypeError} If options.columns or options.model is undefined.
  */initialize:function initialize(options){var columns=this.columns=options.columns;if(!(columns instanceof Backbone.Collection)){columns=this.columns=new Columns(columns);}var cells=this.cells=[];for(var i=0;i<columns.length;i++){cells.push(this.makeCell(columns.at(i),options));}this.listenTo(columns,"add",function(column,columns){var i=columns.indexOf(column),cell=this.makeCell(column,options);cells.splice(i,0,cell);var $el=this.$el;if(i===0){$el.prepend(cell.render().$el);}else if(i===columns.length-1){$el.append(cell.render().$el);}else{$el.children().eq(i).before(cell.render().$el);}});this.listenTo(columns,"remove",function(column,columns,opts){cells[opts.index].remove();cells.splice(opts.index,1);});},/**
     Factory method for making a cell. Used by #initialize internally. Override
     this to provide an appropriate cell instance for a custom Row subclass.

     @protected

     @param {Backgrid.Column} column
     @param {Object} options The options passed to #initialize.

     @return {Backgrid.Cell}
  */makeCell:function makeCell(column){return new(column.get("cell"))({column:column,model:this.model});},/**
     Renders a row of cells for this row's model.
  */render:function render(){this.$el.empty();var fragment=document.createDocumentFragment();for(var i=0;i<this.cells.length;i++){fragment.appendChild(this.cells[i].render().el);}this.el.appendChild(fragment);this.delegateEvents();return this;},/**
     Clean up this row and its cells.

     @chainable
  */remove:function remove(){for(var i=0;i<this.cells.length;i++){var cell=this.cells[i];cell.remove.apply(cell,arguments);}return Backbone.View.prototype.remove.apply(this,arguments);}});

var HeaderRow=Row.extend({/**
     Initializer.

     @param {Object} options
     @param {Backbone.Collection.<Backgrid.Column>|Array.<Backgrid.Column>|Array.<Object>} options.columns
     @param {Backgrid.HeaderCell} [options.headerCell] Customized default
     HeaderCell for all the columns. Supply a HeaderCell class or instance to a
     the `headerCell` key in a column definition for column-specific header
     rendering.

     @throws {TypeError} If options.columns or options.collection is undefined.
   */initialize:function initialize(){Row.prototype.initialize.apply(this,arguments);},makeCell:function makeCell(column,options){var headerCell=column.get("headerCell")||options.headerCell||HeaderCell;headerCell=new headerCell({column:column,collection:this.collection});return headerCell;}});

var Header=Backgrid$2.Header=Backbone.View.extend({/** @property */tagName:"thead",/**
     Initializer. Initializes this table head view to contain a single header
     row view.

     @param {Object} options
     @param {Backbone.Collection.<Backgrid.Column>|Array.<Backgrid.Column>|Array.<Object>} options.columns Column metadata.
     @param {Backbone.Model} options.model The model instance to render.

     @throws {TypeError} If options.columns or options.model is undefined.
   */initialize:function initialize(options){this.columns=options.columns;if(!(this.columns instanceof Backbone.Collection)){this.columns=new Columns(this.columns);}this.row=new Backgrid$2.HeaderRow({columns:this.columns,collection:this.collection});},/**
     Renders this table head with a single row of header cells.
   */render:function render(){this.$el.append(this.row.render().$el);this.delegateEvents();return this;},/**
     Clean up this header and its row.

     @chainable
   */remove:function remove(){this.row.remove.apply(this.row,arguments);return Backbone.View.prototype.remove.apply(this,arguments);}});

var EmptyRow=Backbone.View.extend({/** @property */tagName:"tr",/** @property {string|function(): string} */emptyText:null,/**
     Initializer.

     @param {Object} options
     @param {string|function(): string} options.emptyText
     @param {Backbone.Collection.<Backgrid.Column>|Array.<Backgrid.Column>|Array.<Object>} options.columns Column metadata.
   */initialize:function initialize(options){this.emptyText=options.emptyText;this.columns=options.columns;},/**
     Renders an empty row.
  */render:function render(){this.$el.empty();var td=document.createElement("td");td.setAttribute("colspan",this.columns.length);var span=document.createElement("span");span.innerHTML=_.result(this,"emptyText");td.appendChild(span);this.el.className="empty";this.el.appendChild(td);return this;}});

/**
   Body is the table body which contains the rows inside a table. Body is
   responsible for refreshing the rows after sorting, insertion and removal.

   @class Backgrid.Body
   @extends Backbone.View
*/var Body=Backgrid$2.Body=Backbone.View.extend({/** @property */tagName:"tbody",/**
     Initializer.

     @param {Object} options
     @param {Backbone.Collection} options.collection
     @param {Backbone.Collection.<Backgrid.Column>|Array.<Backgrid.Column>|Array.<Object>} options.columns
     Column metadata.
     @param {Backgrid.Row} [options.row=Backgrid.Row] The Row class to use.
     @param {string|function(): string} [options.emptyText] The text to display in the empty row.

     @throws {TypeError} If options.columns or options.collection is undefined.

     See Backgrid.Row.
  */initialize:function initialize(options){this.columns=options.columns;if(!(this.columns instanceof Backbone.Collection)){this.columns=new Columns(this.columns);}this.row=options.row||this.row||Row;this.rows=this.collection.map(function(model){var row=new this.row({columns:this.columns,model:model});return row;},this);this.emptyText=options.emptyText;this._unshiftEmptyRowMayBe();var collection=this.collection;this.listenTo(collection,"add",this.insertRow);this.listenTo(collection,"remove",this.removeRow);this.listenTo(collection,"sort",this.refresh);this.listenTo(collection,"reset",this.refresh);this.listenTo(collection,"backgrid:sort",this.sort);this.listenTo(collection,"backgrid:edited",this.moveToNextCell);this.listenTo(this.columns,"add remove",this.updateEmptyRow);},_unshiftEmptyRowMayBe:function _unshiftEmptyRowMayBe(){if(this.rows.length===0&&this.emptyText!=null){this.emptyRow=new EmptyRow({emptyText:this.emptyText,columns:this.columns});this.rows.unshift(this.emptyRow);return true;}},/**
     This method can be called either directly or as a callback to a
     [Backbone.Collecton#add](http://backbonejs.org/#Collection-add) event.

     When called directly, it accepts a model or an array of models and an
     option hash just like
     [Backbone.Collection#add](http://backbonejs.org/#Collection-add) and
     delegates to it. Once the model is added, a new row is inserted into the
     body and automatically rendered.

     When called as a callback of an `add` event, splices a new row into the
     body and renders it.

     @param {Backbone.Model} model The model to render as a row.
     @param {Backbone.Collection} collection When called directly, this
     parameter is actually the options to
     [Backbone.Collection#add](http://backbonejs.org/#Collection-add).
     @param {Object} options When called directly, this must be null.

     See:

     - [Backbone.Collection#add](http://backbonejs.org/#Collection-add)
  */insertRow:function insertRow(model,collection,options){if(this.rows[0]instanceof EmptyRow)this.rows.pop().remove();// insertRow() is called directly
if(!(collection instanceof Backbone.Collection)&&!options){this.collection.add(model,options=collection);return;}var row=new this.row({columns:this.columns,model:model}),index=collection.indexOf(model);this.rows.splice(index,0,row);var $el=this.$el,$children=$el.children(),$rowEl=row.render().$el;if(index>=$children.length){$el.append($rowEl);}else{$children.eq(index).before($rowEl);}return this;},/**
     The method can be called either directly or as a callback to a
     [Backbone.Collection#remove](http://backbonejs.org/#Collection-remove)
     event.

     When called directly, it accepts a model or an array of models and an
     option hash just like
     [Backbone.Collection#remove](http://backbonejs.org/#Collection-remove) and
     delegates to it. Once the model is removed, a corresponding row is removed
     from the body.

     When called as a callback of a `remove` event, splices into the rows and
     removes the row responsible for rendering the model.

     @param {Backbone.Model} model The model to remove from the body.
     @param {Backbone.Collection} collection When called directly, this
     parameter is actually the options to
     [Backbone.Collection#remove](http://backbonejs.org/#Collection-remove).
     @param {Object} options When called directly, this must be null.

     See:

     - [Backbone.Collection#remove](http://backbonejs.org/#Collection-remove)
  */removeRow:function removeRow(model,collection,options){// removeRow() is called directly
if(!options){this.collection.remove(model,options=collection);if(this._unshiftEmptyRowMayBe()){this.render();}return;}if(_.isUndefined(options.render)||options.render){this.rows[options.index].remove();}this.rows.splice(options.index,1);if(this._unshiftEmptyRowMayBe()){this.render();}return this;},/**
     Rerender the EmptyRow which empties the DOM element, creates the td with the
     updated colspan, and appends it back into the DOM
  */updateEmptyRow:function updateEmptyRow(){if(this.emptyRow!=null){this.emptyRow.render();}},/**
     Reinitialize all the rows inside the body and re-render them. Triggers a
     Backbone `backgrid:refresh` event from the collection along with the body
     instance as its sole parameter when done.
  */refresh:function refresh(){for(var i=0;i<this.rows.length;i++){this.rows[i].remove();}this.rows=this.collection.map(function(model){var row=new this.row({columns:this.columns,model:model});return row;},this);this._unshiftEmptyRowMayBe();this.render();this.collection.trigger("backgrid:refresh",this);return this;},/**
     Renders all the rows inside this body. If the collection is empty and
     `options.emptyText` is defined and not null in the constructor, an empty
     row is rendered, otherwise no row is rendered.
  */render:function render(){this.$el.empty();var fragment=document.createDocumentFragment();for(var i=0;i<this.rows.length;i++){var row=this.rows[i];fragment.appendChild(row.render().el);}this.el.appendChild(fragment);this.delegateEvents();return this;},/**
     Clean up this body and it's rows.

     @chainable
  */remove:function remove(){for(var i=0;i<this.rows.length;i++){var row=this.rows[i];row.remove.apply(row,arguments);}return Backbone.View.prototype.remove.apply(this,arguments);},/**
     If the underlying collection is a Backbone.PageableCollection in
     server-mode or infinite-mode, a page of models is fetched after sorting is
     done on the server.

     If the underlying collection is a Backbone.PageableCollection in
     client-mode, or any
     [Backbone.Collection](http://backbonejs.org/#Collection) instance, sorting
     is done on the client side. If the collection is an instance of a
     Backbone.PageableCollection, sorting will be done globally on all the pages
     and the current page will then be returned.

     Triggers a Backbone `backgrid:sorted` event from the collection when done
     with the column, direction and a reference to the collection.

     @param {Backgrid.Column|string} column
     @param {null|"ascending"|"descending"} direction

     See [Backbone.Collection#comparator](http://backbonejs.org/#Collection-comparator)
  */sort:function sort(column,direction){if(!_.contains(["ascending","descending",null],direction)){throw new RangeError('direction must be one of "ascending", "descending" or `null`');}if(_.isString(column))column=this.columns.findWhere({name:column});var collection=this.collection,order;if(direction==="ascending")order=-1;else if(direction==="descending")order=1;else order=null;var comparator=this.makeComparator(column.get("name"),order,order?column.sortValue():function(model){return model.cid.replace('c','')*1;});if(Backbone.PageableCollection&&collection instanceof Backbone.PageableCollection){collection.setSorting(order&&column.get("name"),order,{sortValue:column.sortValue()});if(collection.fullCollection){// If order is null, pageable will remove the comparator on both sides,
// in this case the default insertion order comparator needs to be
// attached to get back to the order before sorting.
if(collection.fullCollection.comparator==null){collection.fullCollection.comparator=comparator;}collection.fullCollection.sort();collection.trigger("backgrid:sorted",column,direction,collection);column.set("direction",direction);}else collection.fetch({reset:true,success:function success(){collection.trigger("backgrid:sorted",column,direction,collection);column.set("direction",direction);}});}else{collection.comparator=comparator;collection.sort();collection.trigger("backgrid:sorted",column,direction,collection);column.set("direction",direction);}return this;},makeComparator:function makeComparator(attr,order,func){return function(left,right){// extract the values from the models
var l=func(left,attr),r=func(right,attr),t;// if descending order, swap left and right
if(order===1)t=l,l=r,r=t;// compare as usual
if(l===r)return 0;else if(l<r)return-1;return 1;};},/**
     Moves focus to the next renderable and editable cell and return the
     currently editing cell to display mode.

     Triggers a `backgrid:next` event on the model with the indices of the row
     and column the user *intended* to move to, and whether the intended move
     was going to go out of bounds. Note that *out of bound* always means an
     attempt to go past the end of the last row.

     @param {Backbone.Model} model The originating model
     @param {Backgrid.Column} column The originating model column
     @param {Backgrid.Command} command The Command object constructed from a DOM
     event
  */moveToNextCell:function moveToNextCell(model,column,command){var i=this.collection.indexOf(model),j=this.columns.indexOf(column),cell,renderable,editable,m,n;// return if model being edited in a different grid
if(j===-1)return this;this.rows[i].cells[j].exitEditMode();if(command.moveUp()||command.moveDown()||command.moveLeft()||command.moveRight()||command.save()){var l=this.columns.length,maxOffset=l*this.collection.length;if(command.moveUp()||command.moveDown()){m=i+(command.moveUp()?-1:1);var row=this.rows[m];if(row){cell=row.cells[j];if(Backgrid$2.callByNeed(cell.column.editable(),cell.column,model)){cell.enterEditMode();model.trigger("backgrid:next",m,j,false);}}else model.trigger("backgrid:next",m,j,true);}else if(command.moveLeft()||command.moveRight()){var right=command.moveRight();for(var offset=i*l+j+(right?1:-1);offset>=0&&offset<maxOffset;right?offset++:offset--){m=~~(offset/l);n=offset-m*l;cell=this.rows[m].cells[n];renderable=Backgrid$2.callByNeed(cell.column.renderable(),cell.column,cell.model);editable=Backgrid$2.callByNeed(cell.column.editable(),cell.column,model);if(renderable&&editable){cell.enterEditMode();model.trigger("backgrid:next",m,n,false);break;}}if(offset==maxOffset){model.trigger("backgrid:next",~~(offset/l),offset-m*l,true);}}}return this;}});

/**
   A Footer is a generic class that only defines a default tag `tfoot` and
   number of required parameters in the initializer.

   @abstract
   @class Backgrid.Footer
   @extends Backbone.View
 */var Footer=Backbone.View.extend({/** @property */tagName:"tfoot",/**
     Initializer.

     @param {Object} options
     @param {Backbone.Collection.<Backgrid.Column>|Array.<Backgrid.Column>|Array.<Object>} options.columns
     Column metadata.
     @param {Backbone.Collection} options.collection

     @throws {TypeError} If options.columns or options.collection is undefined.
  */initialize:function initialize(options){this.columns=options.columns;if(!(this.columns instanceof Backbone.Collection)){this.columns=new Columns(this.columns);}}});

/**
   Grid represents a data grid that has a header, body and an optional footer.

   By default, a Grid treats each model in a collection as a row, and each
   attribute in a model as a column. To render a grid you must provide a list of
   column metadata and a collection to the Grid constructor. Just like any
   Backbone.View class, the grid is rendered as a DOM node fragment when you
   call render().

       var grid = Backgrid.Grid({
         columns: [{ name: "id", label: "ID", type: "string" },
          // ...
         ],
         collections: books
       });

       $("#table-container").append(grid.render().el);

   Optionally, if you want to customize the rendering of the grid's header and
   footer, you may choose to extend Backgrid.Header and Backgrid.Footer, and
   then supply that class or an instance of that class to the Grid constructor.
   See the documentation for Header and Footer for further details.

       var grid = Backgrid.Grid({
         columns: [{ name: "id", label: "ID", type: "string" }],
         collections: books,
         header: Backgrid.Header.extend({
              //...
         }),
         footer: Backgrid.Paginator
       });

   Finally, if you want to override how the rows are rendered in the table body,
   you can supply a Body subclass as the `body` attribute that uses a different
   Row class.

   @class Backgrid.Grid
   @extends Backbone.View

   See:

   - Backgrid.Column
   - Backgrid.Header
   - Backgrid.Body
   - Backgrid.Row
   - Backgrid.Footer
*/var Grid=Backgrid$2.Grid=Backbone.View.extend({/** @property */tagName:"table",/** @property */className:"backgrid",/** @property */header:Header,/** @property */body:Body,/** @property */footer:null,/**
     Initializes a Grid instance.

     @param {Object} options
     @param {Backbone.Collection.<Backgrid.Columns>|Array.<Backgrid.Column>|Array.<Object>} options.columns Column metadata.
     @param {Backbone.Collection} options.collection The collection of tabular model data to display.
     @param {string} [options.caption=string] An optional caption to be added to the table.
     @param {Backgrid.Header} [options.header=Backgrid.Header] An optional Header class to override the default.
     @param {Backgrid.Body} [options.body=Backgrid.Body] An optional Body class to override the default.
     @param {Backgrid.Row} [options.row=Backgrid.Row] An optional Row class to override the default.
     @param {Backgrid.Footer} [options.footer=Backgrid.Footer] An optional Footer class.
   */initialize:function initialize(options){// Convert the list of column objects here first so the subviews don't have
// to.
if(!(options.columns instanceof Backbone.Collection)){options.columns=new Columns(options.columns||this.columns);}this.columns=options.columns;this.caption=options.caption;var filteredOptions=_.omit(options,["el","id","attributes","className","tagName","events"]);// must construct body first so it listens to backgrid:sort first
this.body=options.body||this.body;this.body=new this.body(filteredOptions);this.header=options.header||this.header;if(this.header){this.header=new this.header(filteredOptions);}this.footer=options.footer||this.footer;if(this.footer){this.footer=new this.footer(filteredOptions);}this.listenTo(this.columns,"reset",function(){if(this.header){this.header=new(this.header.remove().constructor)(filteredOptions);}this.body=new(this.body.remove().constructor)(filteredOptions);if(this.footer){this.footer=new(this.footer.remove().constructor)(filteredOptions);}this.render();});},/**
     Delegates to Backgrid.Body#insertRow.
   */insertRow:function insertRow(){this.body.insertRow.apply(this.body,arguments);return this;},/**
     Delegates to Backgrid.Body#removeRow.
   */removeRow:function removeRow(){this.body.removeRow.apply(this.body,arguments);return this;},/**
     Delegates to Backgrid.Columns#add for adding a column. Subviews can listen
     to the `add` event from their internal `columns` if rerendering needs to
     happen.

     @param {Object} [options] Options for `Backgrid.Columns#add`.
   */insertColumn:function insertColumn(){this.columns.add.apply(this.columns,arguments);return this;},/**
     Delegates to Backgrid.Columns#remove for removing a column. Subviews can
     listen to the `remove` event from the internal `columns` if rerendering
     needs to happen.

     @param {Object} [options] Options for `Backgrid.Columns#remove`.
   */removeColumn:function removeColumn(){this.columns.remove.apply(this.columns,arguments);return this;},/**
     Delegates to Backgrid.Body#sort.
   */sort:function sort(){this.body.sort.apply(this.body,arguments);return this;},/**
     Renders the grid's caption, then header, then footer, then finally the body. Triggers a
     Backbone `backgrid:rendered` event along with a reference to the grid when
     the it has successfully been rendered.
   */render:function render(){this.$el.empty();if(this.caption){this.$el.append($("<caption>").text(this.caption));}if(this.header){this.$el.append(this.header.render().$el);}if(this.footer){this.$el.append(this.footer.render().$el);}this.$el.append(this.body.render().$el);this.delegateEvents();this.trigger("backgrid:rendered",this);return this;},/**
     Clean up this grid and its subviews.

     @chainable
   */remove:function remove(){this.header&&this.header.remove.apply(this.header,arguments);this.body.remove.apply(this.body,arguments);this.footer&&this.footer.remove.apply(this.footer,arguments);return Backbone.View.prototype.remove.apply(this,arguments);}});

/*!
  backgrid 0.3.7
  http://github.com/wyuenho/backgrid

  Copyright (c) 2016 Jimmy Yuen Ho Wong and contributors <wyuenho@gmail.com>
  Licensed under the MIT license.
*/Backgrid$2.Command=Command;Backgrid$2.CellFormatter=CellFormatter;Backgrid$2.NumberFormatter=NumberFormatter;Backgrid$2.PercentFormatter=PercentFormatter;Backgrid$2.DatetimeFormatter=DatetimeFormatter;Backgrid$2.StringFormatter=StringFormatter;Backgrid$2.EmailFormatter=EmailFormatter;Backgrid$2.SelectFormatter=SelectFormatter;Backgrid$2.CellEditor=CellEditor;Backgrid$2.InputCellEditor=InputCellEditor;Backgrid$2.BooleanCellEditor=BooleanCellEditor;Backgrid$2.SelectCellEditor=SelectCellEditor;Backgrid$2.Cell=Cell;Backgrid$2.StringCell=StringCell;Backgrid$2.UriCell=UriCell;Backgrid$2.EmailCell=EmailCell;Backgrid$2.NumberCell=NumberCell;Backgrid$2.IntegerCell=IntegerCell;Backgrid$2.PercentCell=PercentCell;Backgrid$2.DatetimeCell=DatetimeCell;Backgrid$2.DateCell=DateCell;Backgrid$2.TimeCell=TimeCell;Backgrid$2.BooleanCell=BooleanCell;Backgrid$2.SelectCell=SelectCell;Backgrid$2.HeaderCell=HeaderCell;Backgrid$2.Column=Column;Backgrid$2.Columns=Columns;Backgrid$2.Row=Row;Backgrid$2.EmptyRow=EmptyRow;Backgrid$2.HeaderRow=HeaderRow;Backgrid$2.Header=Header;Backgrid$2.Body=Body;Backgrid$2.Footer=Footer;Backgrid$2.Grid=Grid;

/*
 backgrid-sizeable-columns
 https://github.com/WRidder/backgrid-sizeable-columns

 Copyright (c) 2014 Wilbert van de Ridder
 Licensed under the MIT @license.
 */Backgrid$2.Extension.SizeAbleColumns=Backbone.View.extend({/** @property */tagName:"colgroup",/**
   * Initializer
   * @param options
   */initialize:function initialize(options){this.grid=options.grid;// Attach event listeners once on render
this.listenTo(this.grid.header,"backgrid:header:rendered",this.render);this.listenTo(this.grid.columns,"width:auto",this.setWidthAuto);this.listenTo(this.grid.columns,"width:fixed",this.setWidthFixed);this.listenTo(this.grid,"backgrid:refresh",this.setColToActualWidth);this.listenTo(this.grid.collection,"add remove reset",this.setColToActualWidth);},/**
   * Adds sizeable columns using <col> elements in a <colgroup>
   * @returns {Backgrid.Extension.SizeAbleColumns}
   */render:function render(){var view=this;view.$el.empty();view.grid.columns.each(function(col){if(typeof col.get("renderable")=="undefined"||col.get("renderable")){var $colEl=$$1("<col>").appendTo(view.$el).attr("data-column-cid",col.cid),colWidth=col.get("width"),colMinWidth=col.get("minWidth"),colMaxWidth=col.get("maxWidth");if(colWidth&&colWidth!="*"){if(colMinWidth&&colWidth<colMinWidth){colWidth=colMinWidth;}if(colMaxWidth&&colWidth>colMaxWidth){colWidth=colMaxWidth;}$colEl.width(colWidth);}}});// Add data attribute to column cells
if(view.grid.header.headerRows){_$1.each(view.grid.header.headerRows,function(row){_$1.each(row.cells,function(cell){cell.$el.attr("data-column-cid",cell.column.cid);});});}else{_$1.each(view.grid.header.row.cells,function(cell){cell.$el.attr("data-column-cid",cell.column.cid);});}// Trigger event
view.grid.collection.trigger("backgrid:colgroup:changed");return this;},/**
   * Gets a <col> element belonging to given model
   * @param colModel Backgrid.Column
   * @returns {*|JQuery|any|jQuery}
   * @private
   */getColumnElement:function getColumnElement(colModel){return this.$el.find('col[data-column-cid="'+colModel.cid+'"]');},/**
   * Get the column width of given model
   * @param colModel Backgrid.Column
   * @returns {Integer}
   * @private
   */getHeaderElementWidth:function getHeaderElementWidth(colModel){return this.grid.header.$el.find("th[data-column-cid='"+colModel.cid+"']").outerWidth();},/**
   * Sets a width of the given column to "*" (auto)
   * @param colModel Backgrid.Column
   * @private
   */setWidthAuto:function setWidthAuto(colModel){// Get column element
var $colElement=this.getColumnElement(colModel);// Save width
colModel.set("width","*");// Set column width to auto
$colElement.css("width","");view.grid.collection.trigger("backgrid:colgroup:updated");},/**
   * Sets a width of the given column to a fixed width defined in the model.
   * @param colModel Backgrid.Column
   * @private
   */setWidthFixed:function setWidthFixed(colModel){// Get column element
var $colElement=this.getColumnElement(colModel),width=this.getHeaderElementWidth(colModel);// Get width of header element
// Set column width to the original width
$colElement.css("width",width);// Save width
colModel.set("width",width);view.grid.collection.trigger("backgrid:colgroup:updated");},/**
   * Updates the view's <col> elements to current width
   * @private
   */setColToActualWidth:function setColToActualWidth(){var view=this,changed=false;_$1.each(view.grid.header.row.cells,function(cell){var $colEl=view.getColumnElement(cell.column);if(cell.column.get("width")!=="*"){changed=changed||$colEl.width()==cell.$el.outerWidth();$colEl.width(cell.$el.outerWidth());}});if(changed){view.grid.collection.trigger("backgrid:colgroup:updated");}}});// Makes column resizable; requires Backgrid.Extension.sizeAbleColumns
Backgrid$2.Extension.SizeAbleColumnsHandlers=Backbone.View.extend({/**
   * Initializer
   * @param options
   */initialize:function initialize(options){this.sizeAbleColumns=options.sizeAbleColumns;this.grid=this.sizeAbleColumns.grid;this.columns=this.grid.columns;this.header=this.grid.header;this.saveColumnWidth=options.saveColumnWidth;this.setHeaderElements();this.attachEvents();},/**
   * Adds handlers to resize the columns
   * @returns {Backgrid.Extension.SizeAbleColumnsHandlers}
   */render:function render(){var view=this;view.$el.empty();// For now, loop tds in first row
_$1.each(view.headerElements,function(columnEl,index){// Get matching col element
var $column=$$1(columnEl),columnModelCid=$column.data("column-cid"),$col=view.sizeAbleColumns.$el.find("col[data-column-cid="+columnModelCid+"]"),columnModel=view.columns.get({cid:columnModelCid});if(columnModel&&columnModel.get("resizeable")){// Create helper elements
var $resizeHandler=$$1("<div></div>").addClass("resizeHandler").attr("data-column-index",index).appendTo(view.$el),$resizeHandlerHelper=$$1("<div></div>").hide().addClass("grid-draggable-cursor").appendTo($resizeHandler);// Make draggable
$resizeHandler.on("mousedown",function(e){view._stopEvent(e);var startX=Math.round($resizeHandler.offset().left),$doc=$$1(document),handlerNonDragSize=$resizeHandler.outerWidth();// Set class
$resizeHandler.addClass("grid-draggable");$resizeHandlerHelper.show();// Follow the mouse
var mouseMoveHandler=function mouseMoveHandler(evt){view._stopEvent(evt);// Check for constraints
var minWidth=columnModel.get("minWidth");if(!minWidth||minWidth<20){minWidth=20;}var maxWidth=columnModel.get("maxWidth"),newLeftPos=evt.pageX,currentWidth=columnModel.get("width"),newWidth=currentWidth+(newLeftPos-startX)-handlerNonDragSize/2;if(minWidth&&newWidth<=minWidth){newLeftPos=startX-(currentWidth-minWidth)+handlerNonDragSize/2;}if(maxWidth&&newWidth>=maxWidth){newLeftPos=startX+maxWidth-currentWidth+handlerNonDragSize/2;}// Apply mouse change to handler
$resizeHandler.offset({left:newLeftPos});};$doc.on("mousemove",mouseMoveHandler);// Add handler to listen for mouseup
var mouseUpHandler=function mouseUpHandler(evt){// Cleanup
view._stopEvent(evt);$resizeHandler.removeClass("grid-draggable");$resizeHandlerHelper.hide();$doc.off("mouseup",mouseUpHandler);$doc.off("mousemove",mouseMoveHandler);// Adjust column size
var stopX=Math.round($resizeHandler.offset().left),offset=startX-stopX,oldWidth=$column.outerWidth(),newWidth=oldWidth-offset;$col.width(newWidth);// Get actual width
var finalWidth=$column.outerWidth();$col.width(finalWidth);// Save width and trigger events
if(finalWidth!=oldWidth){if(view.saveColumnWidth){// Save updated width
columnModel.set("width",finalWidth,{silent:true});}// Trigger event
columnModel.trigger("resize",columnModel,finalWidth,oldWidth);// Check if we have an autosize column, if so, trigger resize on it as well
var autoWidthColumn=view.columns.findWhere({width:"*"});if(autoWidthColumn){autoWidthColumn.trigger("resize",autoWidthColumn);}}view.updateHandlerPosition();};$doc.on("mouseup",mouseUpHandler);});}});// Position drag handlers
view.updateHandlerPosition();return this;},/**
   * Helper function to prevent event propagation
   * @param e {Event}
   * @private
   */_stopEvent:function _stopEvent(e){if(e.stopPropagation){e.stopPropagation();}if(e.preventDefault){e.preventDefault();}e.cancelBubble=true;e.returnValue=false;},/**
   * Add listeners
   * @private
   */attachEvents:function attachEvents(){var view=this;view.listenTo(view.columns,"change:resizeable",view.render);view.listenTo(view.columns,"resize width:auto width:fixed add remove",view.checkSpacerColumn);view.listenTo(view.grid.collection,"backgrid:colgroup:updated",view.updateHandlerPosition);view.listenTo(view.grid.collection,"backgrid:colgroup:changed",function(){// Wait for callstack to be cleared
_$1.defer(function(){view.setHeaderElements();view.render();});});var resizeEvtHandler=_$1.debounce(_$1.bind(view.updateHandlerPosition,view),250);view.listenTo(view._asEvents(window),"resize",resizeEvtHandler);},/**
   * Checks whether a spacer column is nessecary. This is the case when widths are set on all columns and it's smaller
   * that the grid element width.
   * @private
   */checkSpacerColumn:function checkSpacerColumn(){var view=this,spacerColumn=_$1.first(view.columns.where({name:"__spacerColumn"})),autoColumns=view.columns.filter(function(col){return col.get("width")=="*"&&col.get("name")!="__spacerColumn";});// Check if there is a column with auto width, if so, no need to do anything
if(_$1.isEmpty(autoColumns)){var totalWidth=view.columns.reduce(function(memo,num){var colWidth=num.get("width")=="*"?0:num.get("width");return memo+colWidth;},0),gridWidth=view.grid.$el.width();if(gridWidth>totalWidth){// The grid is larger than the cumulative column width, we need a spacer column
if(!spacerColumn){// Create new column model
view.columns.add(view.getSpacerColumn());}}else{// Cumulative column width exceeds grid width, no need for a spacerColumn.
if(spacerColumn){view.columns.remove(spacerColumn);}}}else if(spacerColumn){view.columns.remove(spacerColumn);}},/**
   * Returns a spacer column definition
   * @returns Object
   * @private
   */getSpacerColumn:function getSpacerColumn(){return Backgrid$2.Extension.SizeAbleColumns.spacerColumnDefinition;},/**
   * Updates the position of the handlers
   * @private
   */updateHandlerPosition:function updateHandlerPosition(){var view=this;_$1.each(view.headerElements,function(columnEl,index){var $column=$$1(columnEl);// Get handler for current column and update position
view.$el.children().filter("[data-column-index='"+index+"']").css("left",$column.position().left+$column.outerWidth());});},/**
   * Find the current header elements and stores them
   */setHeaderElements:function setHeaderElements(){var self=this,rows=self.grid.header.headerRows||[self.grid.header.row];self.headerCells=[];// Loop all rows
_$1.each(rows,function(row){// Loop cells of row
_$1.each(row.cells,function(cell){var columnModel=self.columns.get({cid:cell.column.cid});if(!_$1.isEmpty(columnModel)){self.headerCells.push({$el:cell.$el,el:cell.el,column:columnModel});}});});// Sort cells
var headerCells=_$1.sortBy(self.headerCells,function(cell){return self.columns.indexOf(cell.column);});// Filter cells
self.headerCells=_$1.filter(headerCells,function(cell){return cell.column.get("renderable")===true||typeof cell.column.get("renderable")==="undefined";});self.headerElements=_$1.map(self.headerCells,function(cell){return cell.el;});},/**
   * Use Backbone Events listenTo/stopListening with any DOM element
   *
   * @param {DOM Element}
   * @return {Backbone Events style object}
   **/_asEvents:function _asEvents(el){var args;return{on:function on(event,handler){if(args)throw new Error("this is one off wrapper");el.addEventListener(event,handler,false);args=[event,handler];},off:function off(){el.removeEventListener.apply(el,args);}};}});/**
 * Sample definition for the spacer column
 */Backgrid$2.Extension.SizeAbleColumns.spacerColumnDefinition={name:"__spacerColumn",label:"",editable:false,cell:Backgrid$2.StringCell,width:"*",nesting:[],resizeable:false,sortable:false,orderable:false,displayOrder:9999};

_$1.templateSettings={interpolate:/\{\{(.+?)\}\}/g,evaluate:/\{\{(.+?)\}\}/g,escape:/\{\{-(.+?)\}\}/g};var EditableHeaderCell=Backgrid$2.HeaderCell.extend({events:{"click .fontello-filter":"toggleFilterDialog","blur label.editable":"renameColumn","keydown label.editable":"renameColumn","click a":"onClick"},renameColumn:function renameColumn(e){var _this=this,$this=_this.$('label.editable');//console.zdebug($this, $this.text().trim(), globalvars.isValidEvent(e));
// Esc deshace el cambio
if(e.keyCode===27){$this.text(_this.column.get('label'));}else if(globalvars.isValidEvent(e)){var newLabel=$this.text().trim();_this.column.set('label',newLabel);}},toggleFilterDialog:function toggleFilterDialog(e){console.warn(e,'Unimplemented toggleFilterDialog, it needs to be overridden');return null;},showFilterinput:function showFilterinput(e){var width=Math.max(this.column.get("width"),this.$el.width());},updateInputFromCriteria:function updateInputFromCriteria(){var _this=this,strCriteria="";if(_this.column.has('filtercriteria')){var filtercriteria=_this.column.get('filtercriteria');if(filtercriteria&&filtercriteria.objCriteria){strCriteria=typeof filtercriteria.objCriteria==='string'?filtercriteria.objCriteria:JSON.stringify(filtercriteria.objCriteria);_this.showFilterinput();}this.$el.data('strCriteria',strCriteria);_this.$el.addClass('active_filter');}else{this.$el.data('strCriteria',null);_this.$el.removeClass('active_filter');}},render:function render(){var _this=this;this.$el.empty();var column=this.column,sortable=Backgrid$2.callByNeed(column.sortable(),column,this.collection),label;if(sortable){label=$$1("<label>").html(column.get("label"));this.$el.append('<span class="sort_container"><a ><b class="sort-caret"></b><i class="fontello-sort"></i></a></span>');}else{label=document.createTextNode(column.get("label"));}this.$el.prepend(label);if(column.get('editable')){this.$el.find('label').addClass('editable').attr('contenteditable',true);}if(column.get('filterable')){this.$el.find('.sort_container').prepend('<i class="fontello-filter"></i>');_this.listenTo(this.column,'change:filtercriteria',function(){console.zdebug('EditableHeaderCell filtercriteria changed');_this.updateInputFromCriteria();});}this.$el.addClass(column.get("name"));this.$el.addClass(column.get("direction"));this.delegateEvents();return this;}});

_$1.templateSettings={interpolate:/\{\{(.+?)\}\}/g,evaluate:/\{\{(.+?)\}\}/g,escape:/\{\{-(.+?)\}\}/g};Backgrid$2.InputCellEditor.prototype._class='Backgrid.InputCellEditor';Backgrid$2.InputCellEditor.prototype.events={"blur":"blurEvent","keydown":"interceptEvent","click":"interceptEvent"};Backgrid$2.InputCellEditor.prototype.initialize=function(options){var _this=this;Backgrid$2.InputCellEditor.__super__.initialize.apply(this,arguments);if(options.placeholder){this.$el.attr("placeholder",options.placeholder);}//console.zdebug('CellEditor initialize', this.model);
_$1.delay(function(){//console.zdebug('Cleaning Cell Editor');
_this.$el.closest('td').removeClass('selected');},500);};Backgrid$2.InputCellEditor.prototype.enableField=function(){//console.zdebug('Backgrid.InputCellEditor enableField');
this.readonly=false;return this;};Backgrid$2.InputCellEditor.prototype.blurEvent=function(e){//console.zdebug('Backgrid.InputCellEditor blurEvent');
this.saveOrCancel(e);return this;};Backgrid$2.InputCellEditor.prototype.alterEvent=function(e){if(this.readonly===undefined){if(e.type==="click"||e.type==="blur"){this.enableField();}else if(e.type==="keydown"){switch(e.keyCode){case 13:this.enableField();break;case 39:e.keyCode=9;e.shiftKey=false;break;case 37:e.keyCode=9;e.shiftKey=true;break;case 9:case 40:case 38:// flecha arriba y flecha abajo, no altero el evento
break;default:this.enableField();break;}}}return e;};Backgrid$2.InputCellEditor.prototype.interceptEvent=function(e){var evt;if(this.readonly===undefined){evt=this.alterEvent(e);}else{evt=e;}this.saveOrCancel(evt);};var GeocodableEditor=Backgrid$2.InputCellEditor.extend({_class:'GeocodableEditor',id:'addressEditor',place_found:null,enableField:function enableField(){var _this=this;if(window.google.maps){var gmaps=window.google.maps;}else{console.warn('GeocodableEditor cannot run without google maps in the window scope');return false;}this.readonly=false;this.model.trigger('mute',true);this.place_found=false;var input=_this.$el[0],autocompleteOptions={},country=null;if(this.model.has('country')){country=this.model.get('country');}else if(this.model.has('pais')){country=this.model.get('pais');}if(country!==null){autocompleteOptions.componentRestrictions={country:country};}var autocomplete=new gmaps.places.Autocomplete(input,autocompleteOptions);input.placeholder='Find an address';gmaps.event.addListener(autocomplete,'place_changed',function(){_this.place_found=true;var place=autocomplete.getPlace(),address={};_$1.each(place.address_components,function(component){address[component.types[0]]=component.short_name;});console.info('Place CHANGED',{address:address,place:place});if(place.geometry){_this.model.save({geocodingAddress:place.place_id,latGoogle:place.geometry.location.lat(),lonGoogle:place.geometry.location.lng(),geoStatus:'OK',geoResult:1,pais:address.country,region:address.administrative_area_level_1,ciudad:address.administrative_area_level_2,comuna:address.locality||address.administrative_area_level_3,country:address.country,state:address.administrative_area_level_1,county:address.administrative_area_level_2,city:address.administrative_area_level_3});}return;});return this;},interceptEvent:function interceptEvent(e){var _this=this,evt;if(this.readonly===undefined){evt=this.alterEvent(e);this.saveOrCancel(evt);//console.zdebug('GeocodableEditor interceptEvent', evt, this.readonly);
}else if(globalvars.isValidEvent(e,true)){this.saveOrCancel(e);_$1.delay(function(){if(_this.place_found===false){_this.model.save();}_this.model.trigger('mute',false);},1000);}}});

_$1.templateSettings={interpolate:/\{\{(.+?)\}\}/g,evaluate:/\{\{(.+?)\}\}/g,escape:/\{\{-(.+?)\}\}/g};Backgrid$2.Extension.ResizableColumns=Backgrid$2.Extension.SizeAbleColumns.extend({className:'resizablecols'});/**
 * [render description]
 * @param  {[type]} ) {		this.$el.html(this.template(this.model.attributes));		this.delegateEvents();		return this;	}} [description]
 * @return {[type]}   [description]
 */Backgrid$2.DeleteCell=Backgrid$2.Cell.extend({template:_$1.template('<a class="removerow" data-row="{{id}}"><i class="fontello-trash" id="removerow{{id}}" data-row="{{id}}"></i></a>&nbsp;{{id}}'),render:function render(){this.$el.html(this.template(this.model.attributes));this.delegateEvents();return this;}});/**
 * [initialize description]
 * @param  {[type]} ) {		Backgrid.StringCell.prototype.initialize.apply(this, arguments);	}} [description]
 * @return {[type]}   [description]
 */var GeocodableCell=Backgrid$2.StringCell.extend({_class:'Backgrid.GeocodableCell',className:"geocodable-cell",formatter:Backgrid$2.StringFormatter,editor:GeocodableEditor,initialize:function initialize(){Backgrid$2.StringCell.prototype.initialize.apply(this,arguments);}});Backgrid$2.GeocodableCell=GeocodableCell;/**
 * [constructor description]
 * @param  {[type]} ) {		var       _this [description]
 * @return {[type]}   [description]
 */var DatasetColumn=Backgrid$2.Column.extend({_class:'Backgrid.DatasetColumn',constructor:function constructor(){var _this=this;//console.zdebug('Constructor DatasetColumn');
this.on('backgrid:edited',function(){console.zdebug('backgrid:edit DatasetColumn');});this.on('change:filtercriteria',function(){console.zdebug('DatasetColumn filtercriteria changed',_this.get('filtercriteria'));});this.on('change:label',function(){var changedAttrs=_this.changedAttributes();console.zdebug('Label Changed',_this.get('label'),changedAttrs);if(changedAttrs.label&&_this.has('label')&&_this.has('model')){_this.get('model').set('alias',_this.get('label')).save();}});Backgrid$2.Column.apply(this,arguments);},parseCriteria:function parseCriteria(strCriteria){var _this=this,objCriteria,val_operador,val_condition;try{objCriteria=JSON.parse(strCriteria);val_operador=_$1.keys(objCriteria)[0];val_condition=_$1.values(objCriteria)[0];}catch(e){objCriteria=strCriteria;val_operador="";val_condition=strCriteria;}var filtercriteria={val_campo:_this.get('nombre_fisico'),val_operador:val_operador,val_condition:val_condition,objCriteria:objCriteria};console.zdebug(this.get('name'),filtercriteria,objCriteria);_this.set('filtercriteria',filtercriteria);return filtercriteria;}});Backgrid$2.DatasetColumn=DatasetColumn;/**
 * [constructor description]
 * @param  {[type]} models   [description]
 * @param  {Array}  options) {		if        (options.tableModel) {			var theModels [description]
 * @return {[type]}          [description]
 */var DatasetColumns=Backgrid$2.Columns.extend({_class:'Backgrid.DatasetColumns',model:Backgrid$2.DatasetColumn,constructor:function constructor(models,options){if(options.tableModel){var theModels=[{name:"id_instagis",label:"ID",editable:false,cell:Backgrid$2.DeleteCell,resizeable:true,minWidth:60,width:80,maxWidth:100,nombre_fisico:"id_instagis"}].concat(options.tableModel.columns.map(function(columna){var columnObj={id:columna.get('id'),name:columna.get('nombre_fisico'),label:columna.get('alias').replace(/_/g,' '),cell:"string",resizeable:true,editable:true,headerCell:EditableHeaderCell,minWidth:110,width:160,maxWidth:250,model:columna,filterable:true,nombre_fisico:columna.get('nombre_fisico')};if(columnObj.name==='direccion'||columnObj.name==='address'){_$1.extend(columnObj,{width:300,minWidth:240,maxWidth:500,cell:Backgrid$2.GeocodableCell});}else if(columnObj.name==='description'||columnObj.name==='descripcion'){_$1.extend(columnObj,{width:400,minWidth:240,maxWidth:600});}return columnObj;})).concat([{name:"lat_google",label:"latitude",editable:false,resizeable:true,cell:Backgrid$2.NumberCell.extend({decimals:6}),minWidth:80,width:80,maxWidth:100,nombre_fisico:"lat_google"},{name:"lon_google",label:"longitude",editable:false,resizeable:true,cell:Backgrid$2.NumberCell.extend({decimals:6}),minWidth:80,width:80,maxWidth:100,nombre_fisico:"lon_google"},{name:"geo_status",label:"geo_status",editable:false,cell:Backgrid$2.StringCell,headerCell:EditableHeaderCell,minWidth:110,width:120,maxWidth:120,filterable:true,resizeable:true,nombre_fisico:"geo_status"},{name:"geo_result",label:"geo_result",editable:false,resizeable:true,cell:Backgrid$2.IntegerCell,minWidth:100,width:100,maxWidth:100,nombre_fisico:"geo_result"}]);Backgrid$2.Columns.apply(this,[theModels]);}}});Backgrid$2.EditableHeaderCell=EditableHeaderCell;Backgrid$2.DatasetColumns=DatasetColumns;Backgrid$2.GeocodableEditor=GeocodableEditor;

exports.Backgrid = Backgrid$2;
exports['default'] = Backgrid$2;

Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=ig_backgrid.bundle.js.map