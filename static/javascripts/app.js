define("app", ["angular", "ngAnimate", "uiBootstrapTpls", "layout/app", "authentication/app", "app/account", "app/routes", "components/module", "app/word"], function(angular) {
    return angular
        .module('app', [
            'ui.bootstrap',
            'app.routes',
            'ngAnimate',
            'app.authentication',
            'app.layout',
            'app.components',
            'app.account',
            'app.word'
        ])
        // .run(['$http', 'Authentication', function($http, Authentication) {
        //     $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        //     $http.defaults.xsrfCookieName = 'csrftoken';
            // $http.get('/account/currentuser/').then(
            //         function(data, status) {
            //             console.log(data.data)
            //             Authentication.setCurrentUser(data.data);
            //         },
            //         function(data, status){
            //             Authentication.setCurrentUser(null);
            //         }
            //     )
        // }]);
})