import {DatetimeCell} from './datetime.js';
/**
   DateCell is a Backgrid.DatetimeCell without the time part.

   @class Backgrid.DateCell
   @extends Backgrid.DatetimeCell
*/
var DateCell = DatetimeCell.extend({

  /** @property */
  className: "date-cell",

  /** @property */
  includeTime: false

});
export {DateCell};