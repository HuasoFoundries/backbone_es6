(function (QUnit) {

QUnit.module("ReportFactory Entities");

QUnit.test('ReportFactory.cloudTag should be a valid method', function (assert) {
	assert.equal(typeof ReportFactory.cloudTag, 'function', 'ReportFactory.cloudTag should be a valid method');
});
QUnit.test('ReportFactory.reportSummary should be a valid method', function (assert) {
	assert.equal(typeof ReportFactory.reportSummary, 'function', 'ReportFactory.reportSummary should be a valid method');
});
QUnit.test('ReportFactory.reporteAlcohol should be a valid method', function (assert) {
	assert.equal(typeof ReportFactory.reporteAlcohol, 'function', 'ReportFactory.reporteAlcohol should be a valid method');
});
QUnit.test('ReportFactory.reporteCanasta should be a valid method', function (assert) {
	assert.equal(typeof ReportFactory.reporteCanasta, 'function', 'ReportFactory.reporteCanasta should be a valid method');
});
QUnit.test('ReportFactory.reporteComisaria should be a valid method', function (assert) {
	assert.equal(typeof ReportFactory.reporteComisaria, 'function', 'ReportFactory.reporteComisaria should be a valid method');
});
QUnit.test('ReportFactory.reporteDemografico should be a valid method', function (assert) {
	assert.equal(typeof ReportFactory.reporteDemografico, 'function', 'ReportFactory.reporteDemografico should be a valid method');
});
QUnit.test('ReportFactory.reporteIsocrona should be a valid method', function (assert) {
	assert.equal(typeof ReportFactory.reporteIsocrona, 'function', 'ReportFactory.reporteIsocrona should be a valid method');
});
QUnit.test('ReportFactory.reportePivottable should be a valid method', function (assert) {
	assert.equal(typeof ReportFactory.reportePivottable, 'function', 'ReportFactory.reportePivottable should be a valid method');
});


})(QUnit);
