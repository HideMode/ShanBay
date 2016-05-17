({
	// appDir: ".",
	baseUrl: ".",
	dir: "../build",
	// modules: [{
	// name: "require",
	// }],
	paths: {
		'underscore': "../bower_components/underscore/underscore",
		'jquery': "../bower_components/jquery/dist/jquery",
		'angular': "../bower_components/angular/angular",
		'angular-ui-router': "../bower_components/angular-ui-router/release/angular-ui-router",
		'ui-bootstrap.min': "../bower_components/angular-bootstrap/ui-bootstrap.min",
		'ui-bootstrap-tpls.min': "../bower_components/angular-bootstrap/ui-bootstrap-tpls.min",
		'cropper.min': "../bower_components/cropper/dist/cropper.min",
		'angular-aria': "../bower_components/angular-aria/angular-aria",
		'angular-cookies': "../bower_components/angular-cookies/angular-cookies",
		'angular-sanitize': "../bower_components/angular-sanitize/angular-sanitize",
		'snackbar.min': "../bower_components/snackbarjs/dist/snackbar.min"
	},
	shim: {
		angular: {
			deps: ["jquery"],
			exports: "angular"
		},
		uiBootstrapTpls: ["angular", "uiBootstrap"],
		uiBootstrap: ["angular", "ngAnimate", "ngAria"],
		ngAnimate: ["angular"],
		ngAria: ["angular"],
		ngSanitize: ["angular"],
		uiRouter: ["angular"],
		ngCookies: ["angular"],
		cropper: ["jquery"],
		snackbar: ["jquery"],
		underscore: {
			exports: "_"
		}
		// tinyMce: ["tinyMce_lang"]
	}
	// mainConfigFile: 'require.js'
	// name: 'require'
})