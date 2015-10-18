requirejs.load = (function (originalLoad) {
    return function (context, moduleName, url) {
        if (!/\.js$/.test(url)) {
            url += ".js";
        }
        originalLoad.call(requirejs, context, moduleName, url);
    }
})(requirejs.load);

// make it async
window.__karma__.loaded = function () {};

var tests = [];
for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        var filename = file.match(/\/(\w+\.test)\.js$/);
        if (filename) {
            tests.push(filename[1]);
        }
    }
}

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base/test/_src/js',

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});