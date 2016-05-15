define("word/detail/controller", ["angular", "ngSanitize", "authentication/service", "word/service", "components/snackbar/service", "settings/word/service"], function(angular) {

    return angular
        .module('app.word.detail.controllers', ['ngSanitize'])
        .controller('WordDetailController', ['$scope', '$rootScope', 'Authentication', 'Word', '$stateParams', 'Snackbar',
            'WordOptions', '$uibModal', '$filter',
            function($scope, $rootScope, Authentication, Word, $stateParams, Snackbar, WordOptions, $uibModal, $filter) {
                var video = null;
                $rootScope.$watch('currentUser', function(nv, ov) {
                    $scope.user = $rootScope.currentUser;
                    WordOptions.getWordOptions().then(function(data) {
                        $scope.options = data;
                        $scope.word_num = get_obj_by_id(data.word_num, $scope.user.word_num) || null;
                    })
                })
                $scope.currentIndex = 0;

                $scope.$watch('currentIndex', function(nv, ov) {
                    if (!isNaN(nv) && nv % 10 == 0) {
                        Word.getWordList(nv / 10 + 1).then(function(data) {
                            $scope.words = data;
                            $scope.word = $scope.words[$scope.currentIndex - Math.floor(nv / 10) * 10];
                            fetchExample($scope.word.id);
                            fetchMyNote($scope.word.id);
                        }, function() {
                            Snackbar.error('没有更多的单词了')
                        })
                    } else {
                        $scope.word = $scope.words[$scope.currentIndex - Math.floor(nv / 10) * 10];
                        fetchExample($scope.word.id);
                        fetchMyNote($scope.word.id);
                    }

                })

                // function fetchSynonyms(id) {
                //     Word.getWordSynonyms(id).then(function(data){
                //         console.log(data)
                //     })
                // }
                function fetchMyNote(id) {
                    Word.getMyNote(id).then(function(data) {
                        $scope.mynotes = data
                    })
                }

                function fetchExample(id) {
                    Word.getWordExample(id).then(function(data) {
                        $scope.examples = data
                    })
                }
                $scope.fetchNote = function() {
                    $scope.onLoad = true;
                    var id = $scope.word.id;
                    Word.getNote(id).then(function(data) {
                        $scope.onLoad = false;
                        $scope.notes = data
                    })
                }
                $scope.changeIndex = function() {
                    if ($scope.currentIndex == $scope.word_num.num) {
                        Snackbar.show('完成今日单词背诵!')
                    } else {
                        $scope.currentIndex++;
                        $scope.model.tabIndex = 0;
                    }


                }
                $scope.playAudio = function(url) {
                    video = new Audio(url)
                    video.play()
                    video = null;
                    // (new Audio(url)).play()
                }

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
                // ng-model two-way-binging fials solutions
                // http://stackoverflow.com/questions/13632042/angularjs-two-way-data-binding-fails-if-element-has-ngmodel-and-a-directive-wit
                $scope.model = {
                    content: '',
                    tabIndex: 0
                }
                $scope.createNote = function() {
                        if (!$scope.model.content) {
                            Snackbar.show('笔记不能为空')
                        } else {
                            Word.createNote($scope.word.id, $scope.model.content).then(function(res) {
                                    result = res.data
                                    if (result) {
                                        Snackbar.show('你的笔记创建成功!');
                                        // $rootScope.$apply();
                                        // $scope.$root.$$phase || $rootScope.$apply();
                                        $scope.mynotes.unshift(result);
                                        $scope.model.content = "";
                                        $scope.model.tabIndex = 0;
                                    } else {
                                        Snackbar.error('错误:' + res.errors);
                                    }
                                },
                                function() {
                                    Snackbar.error('服务器出错!');
                                })
                        }
                    },
                    $scope.open = function(note) {

                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'myModalContent.html',
                            controller: function($scope, $uibModalInstance, Word) {
                                var con = angular.copy(note)
                                $scope.content = {
                                    note: con
                                }
                                $scope.ok = function() {
                                    // can note be blank
                                    if ($scope.content.note.content) {
                                        Word.updateNote(note.id, $scope.content.note.content)
                                            .then(function(data) {
                                                note.content = data.data.content;
                                                Snackbar.show('你的笔记修改成功!');
                                                $uibModalInstance.close();
                                            })
                                    }
                                };

                                $scope.cancel = function() {

                                    $uibModalInstance.dismiss('cancel');
                                };

                                $scope.delete = function() {
                                    Word.deleteNote(note.id).then(function(data) {
                                        console.log(data)
                                        if (data.status == 204) {
                                            Snackbar.show('你的笔记删除成功!');
                                            $uibModalInstance.close('delete');
                                        }
                                    })

                                }
                            },

                        });

                        modalInstance.result.then(function(type) {
                            // sync note data
                            if (type == 'delete') {
                                // var obj = $filter('filter')($scope.mynotes, function(res){
                                //     console.log(res.id, note.id)
                                //     res.id === note.id
                                // })
                                var obj = $filter('filter')($scope.mynotes, {
                                    id: note.id
                                })
                                var index = $scope.mynotes.indexOf(obj[0])
                                if (index > -1) {
                                    // remove data from origins
                                    $scope.mynotes.splice(index, 1)
                                }
                            }
                        }, function() {
                            // console.log(new Date())
                            // $log.info('Modal dismissed at: ' + new Date());
                        });
                    };

            }
        ]);
})