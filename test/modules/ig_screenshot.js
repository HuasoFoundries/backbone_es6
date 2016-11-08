import {
	canvg,
	html2canvas,
	infoScreenShot
} from 'providers/ig_screenshot';
'use strict';
//console.debug('screenShooter', screenShooter);

//if (screenShooter.__esModule === true && screenShooter.default) {		screenShooter = screenShooter.default;	}
QUnit.module("screenShooter Entities");
QUnit.test("Check validity of screenShooter provider", function (assert) {

	assert.equal(typeof infoScreenShot, 'function', 'infoScreenShot should be if type function');

	assert.equal(typeof canvg, 'function', 'screenShooter.canvg should be a valid method');
	assert.equal(typeof html2canvas, 'function', 'screenShooter.html2canvas should be a valid method');

});
export default infoScreenShot;
