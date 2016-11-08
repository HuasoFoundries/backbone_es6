import {DatetimeCell} from './datetime.js';
/**
   TimeCell is a Backgrid.DatetimeCell without the date part.

   @class Backgrid.TimeCell
   @extends Backgrid.DatetimeCell
*/
var TimeCell = DatetimeCell.extend({

  /** @property */
  className: "time-cell",

  /** @property */
  includeDate: false

});
export {TimeCell};