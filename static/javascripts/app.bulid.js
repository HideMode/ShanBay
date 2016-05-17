({
	// appDir: ".",
	baseUrl: ".",
	dir: "../build",
	// modules: [{
	// name: "require",
	// }],
	paths: {
		underscore: "../bower_components/underscore/underscore",
		jquery: "../bower_components/jquery/dist/jquery",
		angular: "../bower_components/angular/angular",
		uiRouter: "../bower_components/angular-ui-router/release/angular-ui-router",
		uiBootstrap: "../bower_components/angular-bootstrap/ui-bootstrap.min",
		uiBootstrapTpls: "../bower_components/angular-bootstrap/ui-bootstrap-tpls.min",
		cropper: "../bower_components/cropper/dist/cropper.min",
		ngAria: "../bower_components/angular-aria/angular-aria",
		ngCookies: "../bower_components/angular-cookies/angular-cookies",
		ngSanitize: "../bower_components/angular-sanitize/angular-sanitize",
		snackbar: "../bower_components/snackbarjs/dist/snackbar.min"
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