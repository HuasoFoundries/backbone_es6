import ReportFactory from 'providers/ig_reportfactory';
'use strict';
//console.debug('ReportFactory', ReportFactory);

//console.debug('ReportFactory is', ReportFactory);
QUnit.module("ReportFactory Entities");

QUnit.test("Check validity of ReportFactory provider", function (assert) {

	assert.equal(typeof ReportFactory, 'object', 'ReportFactory should be if type object');

	assert.equal(typeof ReportFactory.beforeReport, 'function', 'ReportFactory.beforeReport should be a valid method');
	assert.equal(typeof ReportFactory.cloudTag, 'function', 'ReportFactory.cloudTag should be a valid method');
	assert.equal(typeof ReportFactory.reportSummary, 'function', 'ReportFactory.reportSummary should be a valid method');
	assert.equal(typeof ReportFactory.reporteAlcohol, 'function', 'ReportFactory.reporteAlcohol should be a valid method');
	assert.equal(typeof ReportFactory.reporteCanasta, 'function', 'ReportFactory.reporteCanasta should be a valid method');
	assert.equal(typeof ReportFactory.reporteComisaria, 'function', 'ReportFactory.reporteComisaria should be a valid method');
	assert.equal(typeof ReportFactory.reporteDemografico, 'function', 'ReportFactory.reporteDemografico should be a valid method');
	assert.equal(typeof ReportFactory.reporteIsocrona, 'function', 'ReportFactory.reporteIsocrona should be a valid method');
	assert.equal(typeof ReportFactory.reportePivottable, 'function', 'ReportFactory.reportePivottable should be a valid method');

});
export default ReportFactory;
