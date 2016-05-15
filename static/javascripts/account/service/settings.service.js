define("settings/word/service", ["angular", "components/snackbar/service"], function(angular) {
    return angular
        .module('app.settings.word.service', [])
        .factory('WordOptions', ['$rootScope', '$http', '$q', 'Snackbar', function($rootScope, $http, $q, Snackbar) {
            return {
                getWordOptions: function(page) {
                    var d = $q.defer();
                    return $http.get('/api/v1/options/')
                        .success(function(data) {
                            d.resolve(data);
                        })
                        .error(function(err) {
                            d.reject(err);
                        }), d.promise;
                },
                updateWordOptions: function(level, word_num) {
                    var d = $q.defer();
                    return $http.post('/api/v1/options/', {
                            level: level || null,
                            word_num: word_num || null
                        })
                        .success(function(data) {
                            d.resolve(data);
                            $rootScope.currentUser = data;
                            Snackbar.show('设置修改成功')
                        })
                        .error(function(err) {
                            d.reject(err);
                            Snackbar.error('设置修改失败')
                        }), d.promise;
                }
            };
        }])

})