define("layout/navbar/controller", ["angular", "authentication/service"], function(angular) {
    return angular
        .module('app.layout.controllers', [])
        .controller('NavbarController', ['$rootScope', '$scope', '$state', 'Authentication', function($rootScope, $scope, $state, Authentication) {
            var vm = this;
            // vm.user = $rootScope.currentUser;
            // vm.user = Authentication.getCurrentUser();
            vm.logout = function() {
                    Authentication.logout();
                }
                // words
            vm.searchWord = function() {
                Word.serachWord(vm.words).then(function(data){
                    
                })
            }
            $rootScope.$watch('currentUser', function(nv, ov) {
                vm.user = $rootScope.currentUser;
                vm.is_authenticate = $rootScope.currentUser;
            })
        }])
})