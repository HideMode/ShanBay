requirejs.config({paths:{underscore:"/static/bulid/underscore",jquery:"/static/bulid/jquery",angular:"/static/bulid/angular",uiRouter:"/static/bulid/angular-ui-router",uiBootstrap:"/static/bulid/ui-bootstrap.min",uiBootstrapTpls:"/static/bulid/ui-bootstrap-tpls.min",cropper:"/static/bulid/cropper.min",ngAnimate:"/static/bulid/angular-animate",ngAria:"/static/bulid/angular-aria",ngCookies:"/static/bulid/angular-cookies",ngSanitize:"/static/bulid/angular-sanitize",app:"/static/javascripts/app",snackbar:"/static/bulid/snackbar.min"},shim:{angular:{deps:["jquery"],exports:"angular"},uiBootstrapTpls:["angular","uiBootstrap"],uiBootstrap:["angular","ngAnimate","ngAria"],ngAnimate:["angular"],ngAria:["angular"],ngSanitize:["angular"],uiRouter:["angular"],ngCookies:["angular"],cropper:["jquery"],snackbar:["jquery"],underscore:{exports:"_"}}}),require(["app"],function(){angular.element().ready(function(){$.get("/account/currentuser/").success(function(a,r){var t=a,n=angular.module("app");n.run(["Authentication","$http","$rootScope",function(a,r,n){r.defaults.xsrfHeaderName="X-CSRFToken",r.defaults.xsrfCookieName="csrftoken",n.currentUser=t,a.setCurrentUser(t)}]),angular.bootstrap(document,["app"])}).error(function(a){var r="",t=angular.module("app");t.run(["Authentication","$http","$rootScope","$state",function(a,t,n,u){t.defaults.xsrfHeaderName="X-CSRFToken",t.defaults.xsrfCookieName="csrftoken",n.currentUser=r,a.setCurrentUser(r),u.go("login")}]),angular.bootstrap(document,["app"])})})}),define("main",[],function(){});