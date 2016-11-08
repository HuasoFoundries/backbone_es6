import {Cell} from './cell.js';
import {StringFormatter} from '../formatters/string.js';
/**
   StringCell displays HTML escaped strings and accepts anything typed in.

   @class Backgrid.StringCell
   @extends Backgrid.Cell
*/
var StringCell = Cell.extend({

  /** @property */
  className: "string-cell",

  formatter: StringFormatter

});
export {StringCell};