(function (window, QUnit, undefined) {

  QUnit.config.noglobals = true;

  window.Backbone = IGBackbone.Backbone;
  window._ = IGBackbone._;
  window.$ = IGBackbone.$;

  var history = window.history;
  var pushState = history.pushState;
  var replaceState = history.replaceState;
  //QUnit.config.autostart = false;
  //QUnit.config.reorder = true;

  QUnit.testStart(function () {
    var env = QUnit.config.current.testEnvironment;

    // We never want to actually call these during tests.
    history.pushState = history.replaceState = function () {};

  });

  QUnit.testDone(function () {

    history.pushState = pushState;
    history.replaceState = replaceState;
  });

})(window, QUnit);
