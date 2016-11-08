import _ from 'underscore';
/**
   Command translates a DOM Event into commands that Backgrid
   recognizes. Interested parties can listen on selected Backgrid events that
   come with an instance of this class and act on the commands.

   It is also possible to globally rebind the keyboard shortcuts by replacing
   the methods in this class' prototype.

   @class Backgrid.Command
   @constructor
 */
var Command = function (evt) {
  _.extend(this, {
    altKey: !!evt.altKey,
    "char": evt["char"],
    charCode: evt.charCode,
    ctrlKey: !!evt.ctrlKey,
    key: evt.key,
    keyCode: evt.keyCode,
    locale: evt.locale,
    location: evt.location,
    metaKey: !!evt.metaKey,
    repeat: !!evt.repeat,
    shiftKey: !!evt.shiftKey,
    which: evt.which
  });
};

_.extend(Command.prototype, {
  /**
     Up Arrow

     @member Backgrid.Command
   */
  moveUp: function () {
    return this.keyCode == 38;
  },
  /**
     Down Arrow

     @member Backgrid.Command
   */
  moveDown: function () {
    return this.keyCode === 40;
  },
  /**
     Shift Tab

     @member Backgrid.Command
   */
  moveLeft: function () {
    return this.shiftKey && this.keyCode === 9;
  },
  /**
     Tab

     @member Backgrid.Command
   */
  moveRight: function () {
    return !this.shiftKey && this.keyCode === 9;
  },
  /**
     Enter

     @member Backgrid.Command
   */
  save: function () {
    return this.keyCode === 13;
  },
  /**
     Esc

     @member Backgrid.Command
   */
  cancel: function () {
    return this.keyCode === 27;
  },
  /**
     None of the above.

     @member Backgrid.Command
   */
  passThru: function () {
    return !(this.moveUp() || this.moveDown() || this.moveLeft() ||
      this.moveRight() || this.save() || this.cancel());
  }
});

export {
  Command
};
