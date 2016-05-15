define("word/word/controller", ["angular", "ngSanitize", "authentication/service", "word/service", "components/snackbar/service"], function(angular) {

    return angular
        .module('app.word.word.controllers', ['ngSanitize'])
        .controller('WordController', ['$scope', '$rootScope', 'Authentication', 'Word', '$stateParams', 'Snackbar', 'WordOptions',
            function($scope, $rootScope, Authentication, Word, $stateParams, Snackbar, WordOptions) {
                // var vm = this;
                $rootScope.$watch('currentUser', function(nv, ov) {
                    $scope.user = $rootScope.currentUser;
                })

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
                $rootScope.$watch('currentUser', function(nv, ov) {
                    $scope.user = $rootScope.currentUser;
                    WordOptions.getWordOptions().then(function(data) {
                        $scope.options = data;
                        $scope.word_num = get_obj_by_id(data.word_num, $scope.user.word_num) || {};
                    })
                })
            }
        ]);
})