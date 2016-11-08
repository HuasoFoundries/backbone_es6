import _ from 'underscore';
import {
  CellFormatter
} from './cell.js';
import {
  NumberFormatter
} from './number.js';

/**
   A number formatter that converts a floating point number, optionally
   multiplied by a multiplier, to a percentage string and vice versa.

   @class Backgrid.PercentFormatter
   @extends Backgrid.NumberFormatter
   @constructor
   @throws {RangeError} If decimals < 0 or > 20.
 */
var PercentFormatter = function () {
  Backgrid.NumberFormatter.apply(this, arguments);
};

PercentFormatter.prototype = new NumberFormatter(),

  _.extend(PercentFormatter.prototype, {

    /**
       @member Backgrid.PercentFormatter
       @cfg {Object} options

       @cfg {number} [options.multiplier=1] The number used to multiply the model
       value for display.

       @cfg {string} [options.symbol='%'] The symbol to append to the percentage
       string.
     */
    defaults: _.extend({}, NumberFormatter.prototype.defaults, {
      multiplier: 1,
      symbol: "%"
    }),

    /**
       Takes a floating point number, where the number is first multiplied by
       `multiplier`, then converted to a formatted string like
       NumberFormatter#fromRaw, then finally append `symbol` to the end.

       @member Backgrid.PercentFormatter
       @param {number} rawValue
       @param {Backbone.Model} model Used for more complicated formatting
       @return {string}
    */
    fromRaw: function (number, model) {
      var args = [].slice.call(arguments, 1);
      args.unshift(number * this.multiplier);
      return (NumberFormatter.prototype.fromRaw.apply(this, args) || "0") + this.symbol;
    },

    /**
       Takes a string, possibly appended with `symbol` and/or `decimalSeparator`,
       and convert it back to a number for the model like NumberFormatter#toRaw,
       and then dividing it by `multiplier`.

       @member Backgrid.PercentFormatter
       @param {string} formattedData
       @param {Backbone.Model} model Used for more complicated formatting
       @return {number|undefined} Undefined if the string cannot be converted to
       a number.
    */
    toRaw: function (formattedValue, model) {
      var tokens = formattedValue.split(this.symbol);
      if (tokens && tokens[0] && tokens[1] === "" || tokens[1] == null) {
        var rawValue = NumberFormatter.prototype.toRaw.call(this, tokens[0]);
        if (_.isUndefined(rawValue)) return rawValue;
        return rawValue / this.multiplier;
      }
    }

  });
export {
  PercentFormatter
};
