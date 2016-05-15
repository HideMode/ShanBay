define("account/controller/account", ["angular", "components/cropper/directive", "authentication/service"], function() {

    return angular
        .module('app.account.controller.account', [])
        .controller('AccountController', function($scope, Authentication) {
            $rootScope.$watch('currentUser', function(nv, ov) {
                $scope.user = Authentication.getCurrentUser()
                    // $scope.is_authenticated = $rootScope.currentUser;
            })
        })
})