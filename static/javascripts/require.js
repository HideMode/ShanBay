requirejs.config({
    // paths: {
    //     underscore: "/static/bower_components/underscore/underscore",
    //     jquery: "/static/bower_components/jquery/dist/jquery",
    //     angular: "/static/bower_components/angular/angular",
    //     uiRouter: "/static/bower_components/angular-ui-router/release/angular-ui-router",
    //     uiBootstrap: "/static/bower_components/angular-bootstrap/ui-bootstrap.min",
    //     uiBootstrapTpls: "/static/bower_components/angular-bootstrap/ui-bootstrap-tpls.min",
    //     cropper: "/static/bower_components/cropper/dist/cropper.min",
    //     ngAnimate: "/static/bower_components/angular-animate/angular-animate",
    //     ngAria: "/static/bower_components/angular-aria/angular-aria",
    //     ngCookies: "/static/bower_components/angular-cookies/angular-cookies",
    //     ngSanitize: "/static/bower_components/angular-sanitize/angular-sanitize",
    //     app: "/static/javascripts/app",
    //     snackbar: "/static/bower_components/snackbarjs/dist/snackbar.min"
    // },
    paths: {
        underscore: "/static/build/underscore",
        jquery: "/static/build/jquery",
        angular: "/static/build/angular",
        uiRouter: "/static/build/angular-ui-router",
        uiBootstrap: "/static/build/ui-bootstrap.min",
        uiBootstrapTpls: "/static/build/ui-bootstrap-tpls.min",
        cropper: "/static/build/cropper.min",
        ngAnimate: "/static/build/angular-animate",
        ngAria: "/static/build/angular-aria",
        ngCookies: "/static/build/angular-cookies",
        ngSanitize: "/static/build/angular-sanitize",
        app: "/static/javascripts/app",
        snackbar: "/static/build/snackbar.min"
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
}), require(["app"], function() {

    angular.element().ready(function() {
        // $.get("/account/currentuser/", function(result, status) {
        //     console.log(result)
        //     console.log(status)
        //     var currentUser = result;
        //     var temp = angular.module("app");
        //     temp.run(["Authentication", "$http",
        //         function(Authentication, $http) {
        //             $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        //             $http.defaults.xsrfCookieName = 'csrftoken';
        //             Authentication.setCurrentUser(currentUser);
        //     }]), angular.bootstrap(document, ["app"])
        // })
        $.get("/account/currentuser/")
            .success(function(result, status) {
                var currentUser = result;
                var temp = angular.module("app");
                temp.run(["Authentication", "$http", "$rootScope",
                    function(Authentication, $http, $rootScope) {
                        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
                        $http.defaults.xsrfCookieName = 'csrftoken';
                        $rootScope.currentUser = currentUser;
                        Authentication.setCurrentUser(currentUser);
                    }
                ]), angular.bootstrap(document, ["app"])
            })
            .error(function(result) {
                var currentUser = '';
                var temp = angular.module("app");
                temp.run(["Authentication", "$http", "$rootScope", '$state',
                    function(Authentication, $http, $rootScope, $state) {
                        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
                        $http.defaults.xsrfCookieName = 'csrftoken';
                        $rootScope.currentUser = currentUser;
                        Authentication.setCurrentUser(currentUser);
                        $state.go('login')
                    }
                ]), angular.bootstrap(document, ["app"])
            })
    });
}), define("main", function() {})