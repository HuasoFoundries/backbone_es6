import {
  Backbone,
  Backgrid
} from '../core.js';
import {
  CellFormatter
} from '../formatters/cell.js';
import {
  InputCellEditor
} from '../editors/input_cell.js';
import {
  Column
} from '../column.js';
/**
   The super-class for all Cell types. By default, this class renders a plain
   table cell with the model value converted to a string using the
   formatter. The table cell is clickable, upon which the cell will go into
   editor mode, which is rendered by a Backgrid.InputCellEditor instance by
   default. Upon encountering any formatting errors, this class will add an
   `error` CSS class to the table cell.

   @abstract
   @class Backgrid.Cell
   @extends Backbone.View
*/
var Cell = Backgrid.Cell = Backbone.View.extend({

  /** @property */
  tagName: "td",

  /**
     @property {Backgrid.CellFormatter|Object|string} [formatter=CellFormatter]
  */
  formatter: CellFormatter,

  /**
     @property {Backgrid.CellEditor} [editor=Backgrid.InputCellEditor] The
     default editor for all cell instances of this class. This value must be a
     class, it will be automatically instantiated upon entering edit mode.

     See Backgrid.CellEditor
  */
  editor: InputCellEditor,

  /** @property */
  events: {
    "click": "enterEditMode"
  },

  /**
     Initializer.

     @param {Object} options
     @param {Backbone.Model} options.model
     @param {Backgrid.Column} options.column

     @throws {ReferenceError} If formatter is a string but a formatter class of
     said name cannot be found in the Backgrid module.
  */
  initialize: function (options) {
    this.column = options.column;
    if (!(this.column instanceof Column)) {
      this.column = new Column(this.column);
    }

    var column = this.column,
      model = this.model,
      $el = this.$el;

    var formatter = Backgrid.resolveNameToClass(column.get("formatter") ||
      this.formatter, "Formatter");

    if (!_.isFunction(formatter.fromRaw) && !_.isFunction(formatter.toRaw)) {
      formatter = new formatter();
    }

    this.formatter = formatter;

    this.editor = Backgrid.resolveNameToClass(this.editor, "CellEditor");

    this.listenTo(model, "change:" + column.get("name"), function () {
      if (!$el.hasClass("editor")) this.render();
    });

    this.listenTo(model, "backgrid:error", this.renderError);

    this.listenTo(column, "change:editable change:sortable change:renderable",
      function (column) {
        var changed = column.changedAttributes();
        for (var key in changed) {
          if (changed.hasOwnProperty(key)) {
            $el.toggleClass(key, changed[key]);
          }
        }
      });

    this.updateStateClassesMaybe();
  },

  updateStateClassesMaybe: function () {
    var model = this.model;
    var column = this.column;
    var $el = this.$el;
    $el.toggleClass("editable", Backgrid.callByNeed(column.editable(), column, model));
    $el.toggleClass("sortable", Backgrid.callByNeed(column.sortable(), column, model));
    $el.toggleClass("renderable", Backgrid.callByNeed(column.renderable(), column, model));
  },

  /**
     Render a text string in a table cell. The text is converted from the
     model's raw value for this cell's column.
  */
  render: function () {
    var $el = this.$el;
    $el.empty();
    var model = this.model;
    var columnName = this.column.get("name");
    $el.text(this.formatter.fromRaw(model.get(columnName), model));
    $el.addClass(columnName);
    this.updateStateClassesMaybe();
    this.delegateEvents();
    return this;
  },

  /**
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
  */
  enterEditMode: function () {
    var model = this.model;
    var column = this.column;

    var editable = Backgrid.callByNeed(column.editable(), column, model);
    if (editable) {

      this.currentEditor = new this.editor({
        column: this.column,
        model: this.model,
        formatter: this.formatter
      });

      model.trigger("backgrid:edit", model, column, this, this.currentEditor);

      // Need to redundantly undelegate events for Firefox
      this.undelegateEvents();
      this.$el.empty();
      this.$el.append(this.currentEditor.$el);
      this.currentEditor.render();
      this.$el.addClass("editor");

      model.trigger("backgrid:editing", model, column, this, this.currentEditor);
    }
  },

  /**
     Put an `error` CSS class on the table cell.
  */
  renderError: function (model, column) {
    if (column == null || column.get("name") == this.column.get("name")) {
      this.$el.addClass("error");
    }
  },

  /**
     Removes the editor and re-render in display mode.
  */
  exitEditMode: function () {
    this.$el.removeClass("error");
    this.currentEditor.remove();
    this.stopListening(this.currentEditor);
    delete this.currentEditor;
    this.$el.removeClass("editor");
    this.render();
  },

  /**
     Clean up this cell.

     @chainable
  */
  remove: function () {
    if (this.currentEditor) {
      this.currentEditor.remove.apply(this.currentEditor, arguments);
      delete this.currentEditor;
    }
    return Cell.__super__.remove.apply(this, arguments);
  }

});
export {
  Cell
};
