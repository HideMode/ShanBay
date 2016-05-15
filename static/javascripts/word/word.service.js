define("word/service", ["angular"], function(angular) {
    return angular
        .module('app.word.services', [])
        .factory('Word', ['$http', '$q', function($http, $q) {
            return {
                getWordList: function(page) {
                    var d = $q.defer();
                    return $http.get('/api/v1/user/words/', {
                            params: {
                                page: page || 1
                            }
                        })
                        .success(function(data) {
                            d.resolve(data.results);
                        })
                        .error(function(err) {
                            d.reject(err);
                        }), d.promise;
                },
                // getWordSynonyms: function(word_id) {
                //     var d = $q.defer();
                //     return $http.get('/api/v1/words/?word_id=' + word_id)
                //         .success(function(data) {
                //             d.resolve(data.results);
                //         })
                //         .error(function(err) {
                //             d.reject(err);
                //         }), d.promise;
                // },
                getWordExample: function(word_id) {
                    var d = $q.defer();
                    return $http.get('/api/v1/examples/?word_id=' + word_id)
                        .success(function(data) {
                            d.resolve(data);
                        })
                        .error(function(err) {
                            d.reject(err);
                        }), d.promise;
                },
                getNote: function(word_id) {
                    var d = $q.defer();
                    return $http.get('/api/v1/notes/?word_id=' + word_id)
                        .success(function(data) {
                            d.resolve(data);
                        })
                        .error(function(err) {
                            d.reject(err);
                        }), d.promise;
                },
                getMyNote: function(word_id) {
                    var d = $q.defer();
                    return $http.get('/api/v1/notes/?word_id=' + word_id + '&my=' + '1')
                        .success(function(data) {
                            d.resolve(data);
                        })
                        .error(function(err) {
                            d.reject(err);
                        }), d.promise;
                },
                createNote: function(word_id, content) {
                    var promise = $http.post("/api/v1/notes/?word_id=" + word_id, {
                        word_id: word_id,
                        content: content
                    });
                    return promise;
                },
                updateNote: function(id, content) {
                    var promise = $http.put("/api/v1/notes/" + id, {
                        content: content
                    });
                    return promise;
                },
                deleteNote: function(id) {
                    var promise = $http.delete("/api/v1/notes/" + id);
                    return promise;
                }
            };
        }])
})