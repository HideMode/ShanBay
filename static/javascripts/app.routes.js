define("app/routes", ["angular", "uiRouter"], function(angular) {
    angular
        .module('app.routes', ['ui.router'])
        .config(function($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('register', {
                    url: "/register",
                    controller: 'RegisterController',
                    controllerAs: 'vm',
                    templateUrl: '/static/templates/authentication/register.html'
                })
                .state('login', {
                    url: '/login?redirect',
                    controller: 'LoginController',
                    controllerAs: 'loginCtrl',
                    templateUrl: '/static/templates/authentication/login.html'
                })
                .state('settings', {
                    url: '/settings',
                    templateUrl: '/static/templates/account/settings.html'
                })
                .state('settings.word', {
                    url: '/word',
                    templateUrl: '/static/templates/account/settings/settings-word.html',
                    controller: 'WordSettingController'
                })
                .state('settings.avatar', {
                    url: '/avatar',
                    templateUrl: '/static/templates/account/settings/settings-avatar.html',
                    controller: 'AvatarController'
                })
                .state('settings.password', {
                    url: '/password',
                    templateUrl: '/static/templates/account/settings/settings-password.html',
                    controller: 'PassWordController'
                })
                .state('settings.feedback', {
                    url: '/feedback',
                    templateUrl: '/static/templates/account/settings/settings-feedback.html'
                })

                .state('search', {
                    url: '/search?search',
                    templateUrl: '/static/templates/course/explore.html',
                    controller: 'SearchController'
                })
                .state('word', {
                    url: '/word',
                    templateUrl: '/static/templates/word/word.html',
                    controller: 'WordController'

                })
                .state('detail', {
                    url: '/detail',
                    templateUrl: '/static/templates/word/detail.html',
                    controller: 'WordDetailController'

                })
            $urlRouterProvider.otherwise("login");
        })
})