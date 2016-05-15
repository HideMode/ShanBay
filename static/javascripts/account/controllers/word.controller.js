define("account/controller/word", ["angular", "authentication/service", "settings/word/service", "components/snackbar/service"], function() {

    return angular
        .module('app.account.controller.word', [])
        .controller('WordSettingController', function($rootScope, $scope, Authentication, WordOptions, Snackbar, $state) {
            function get_obj_by_id(obj, id) {
                var val = null;
                if (id) {
                    obj.forEach(function(element, index) {
                        if (element.id == id && !val)
                            val = element
                    });
                }
                return val
            }
            $scope.user = $rootScope.currentUser;
            // $scope.user = Authentication.getCurrentUser();
            $rootScope.$watch('currentUser', function(nv, ov) {
                $scope.user = $rootScope.currentUser;
            })
            WordOptions.getWordOptions().then(function(data) {
                $scope.options = data;
                $scope.level = get_obj_by_id(data.levels, $scope.user.level) || null;
                $scope.word_num = get_obj_by_id(data.word_num, $scope.user.word_num) || null;
                    // $scope.models.level = 
            })
            $scope.$watch('level', function(nv, ov) {
                // console.log(nv, ov)
            })
            $scope.$watch('word_num', function(nv, ov) {
                // console.log(nv, ov)
            })
            $scope.changeWordOptions = function() {
                if ($scope.level){
                    WordOptions.updateWordOptions($scope.level.id, $scope.word_num.id);
                }else{
                    return Snackbar.error('请选择学习的内容');
                }
            }
            $rootScope.$watch('currentUser', function(nv, ov) {
                $scope.user = $rootScope.currentUser;
                if($scope.user === null){
                    $state.go('login');
                }
            })
        })
})