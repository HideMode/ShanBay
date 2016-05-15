define("app/account", ["angular", "account/controller/avatar", "account/controller/password", "account/controller/account", 
    "account/controller/word", "settings/word/service"], function(angular) {
    return angular
        .module('app.account', [
            "app.account.controller.avatar",
            "app.account.controller.password",
            "app.account.controller.account",
            "app.account.controller.word",
            "app.settings.word.service"
        ]);
}),define("authentication/app", ["angular", "authentication/controller/login", "authentication/controller/register", "authentication/service"], function(angular) {
    return angular
        .module('app.authentication', [
            'app.authentication.controller.login',
            'app.authentication.controller.register',
            'app.authentication.services'
        ]);
}),define("layout/app", ["angular", "layout/navbar/controller"], function(angular) {
    return angular
        .module('app.layout', [
            'app.layout.controllers'
        ]);
}),define("components/cropper/directive", ["angular", "underscore", "cropper", "components/snackbar/service", "authentication/service"], function(angular, _) {
    return angular
        .module('app.component.cropper', [])
        .directive("croperPhoto", ["$rootScope", "$compile", "$parse", "$timeout", "Snackbar", 'Authentication',
            function($rootScope, $compile, $parse, $timeout, Snackbar, Authentication) {
                return {
                    restrict: "EA",
                    templateUrl: "/static/templates/components/cropper.html",
                    scope: {
                        imageUrl: "@",
                    },
                    link: function($scope, iElement) {
                        var $image = iElement.find("#_cropper-container > img"),
                            $inputImage = iElement.find("#fileInput");
                        $image.attr("src", $scope.imageUrl), $image.cropper({
                            aspectRatio: 1,
                            preview: ".account-head-pic",
                            checkImageOrigin: !1,
                            crop: function(data) {
                                // $scope.$root.$$phase || $scope.$apply(function() {
                                //     $scope.jsonImageData = {
                                //         url: $scope.imageUrl,
                                //         x: Math.round(data.x),
                                //         y: Math.round(data.y),
                                //         width: Math.round(data.width),
                                //         height: Math.round(data.height)
                                //     }
                                // })
                            },
                            built: function() {}
                        }), $inputImage.change(function() {
                            var file = this.files[0];
                            return "image/bmp" != file.type && "image/jpg" != file.type && 
                            "image/jpeg" != file.type && "image/png" != file.type ? 
                            void Snackbar.error("图片文件格式不支持，请选择bmp、jpeg、jpg、png格式！") : 
                            file.size > 1048576 ? void Snackbar.error("图片文件大小超过1M!") : 
                            (Authentication.uploadImage(file).then(function(res) {
                                result = res.data
                                if (result){
                                    $scope.imageUrl = result.avatar;
                                    Snackbar.show('头像上传成功!');
                                    $rootScope.currentUser = result
                                    // $rootScope.$apply();
                                    // $scope.$root.$$phase || $rootScope.$apply();
                                }else{
                                    Snackbar.error('错误:'+res.errors);
                                }
                            }, 
                            function() {
                            }), void $inputImage.val(""))
                        }), $scope.changeImage = function(e) {
                            e.stopPropagation(), e.preventDefault(), $inputImage.click()
                        }, $scope.$watch("imageUrl", function(nv, ov) {
                            nv !== ov && $image.cropper("replace", nv)
                        })
                    }
                }
            }
        ])
}),define("components/navbar/directive", ["angular", "underscore", "cropper", "components/snackbar/service", "authentication/service"], function(angular, _) {
    return angular
        .module('app.component.navbar', [])
        .directive("navBar", ["$compile", "$parse", "$timeout", "Snackbar", 'Authentication',
            function($compile, $parse, $timeout, Snackbar, Authentication) {
                return {
                    restrict: "EA",
                    templateUrl: "/static/templates/components/navbar.html",
                    controller: 'NavbarController',
                    controllerAs: 'vm'
                }
            }
        ])
}),define("components/module", ["angular", "components/cropper/directive", "components/snackbar/service", "components/navbar/directive"], function(angular) {
    return angular
        .module('app.components', [
            "app.component.cropper",
            "app.services.snackbar",
            "app.component.navbar"
        ]);
}),define("components/snackbar/service", ["angular", "jquery", "underscore", "snackbar"], function(angular, $, _) {

  return angular
    .module('app.services.snackbar', [])
    .factory('Snackbar', Snackbar);

  /**
   * @namespace Snackbar
   */
  function Snackbar() {
    /**
     * @name Snackbar
     * @desc The factory to be returned
     */
    var Snackbar = {
      error: error,
      show: show
    };

    return Snackbar;

    ////////////////////

    /**
     * @name _snackbar
     * @desc Display a snackbar
     * @param {string} content The content of the snackbar
     * @param {Object} options Options for displaying the snackbar
     */
    function _snackbar(content, options) {
      options = _.extend({
        timeout: 3000,
        htmlAllowed: true
      }, options);
      options.content = content;
      $.snackbar(options);
    }


    /**
     * @name error
     * @desc Display an error snackbar
     * @param {string} content The content of the snackbar
     * @param {Object} options Options for displaying the snackbar
     */
    function error(content, options) {
      _snackbar('错误: ' + content, options);
    }


    /**
     * @name show
     * @desc Display a standard snackbar
     * @param {string} content The content of the snackbar
     * @param {Object} options Options for displaying the snackbar
     */
    function show(content, options) {
      _snackbar(content, options);
    }
  }
}),define("app/word", ["angular", "word/service", "word/word/controller", "word/detail/controller"], function(angular) {
    return angular
        .module('app.word', [
            'app.word.services',
            'app.word.word.controllers',
            'app.word.detail.controllers'
        ]);
}),define("word/service", ["angular"], function(angular) {
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
}),define("account/controller/account", ["angular", "components/cropper/directive", "authentication/service"], function() {

    return angular
        .module('app.account.controller.account', [])
        .controller('AccountController', function($scope, Authentication) {
            $rootScope.$watch('currentUser', function(nv, ov) {
                $scope.user = Authentication.getCurrentUser()
                    // $scope.is_authenticated = $rootScope.currentUser;
            })
        })
}),define("account/controller/avatar", ["angular", "components/cropper/directive", "authentication/service"], function() {

    return angular
        .module('app.account.controller.avatar', [])
        .controller('AvatarController', function($scope, Authentication){
            $scope.user = Authentication.getCurrentUser()
        })
}),define("account/controller/password", ["angular", "authentication/service", "components/snackbar/service"], function() {

    return angular
        .module('app.account.controller.password', [])
        .controller('PassWordController', function($scope, Authentication, Snackbar){
            $scope.is_correct = !1;
            $scope.is_ok = !1;
            $scope.user = {
                oldPwd: '',
                newPwd: '',
                cfmPwd: ''
            }

            $scope.checkPassword = function(){
                Authentication.checkUserPassword($scope.user.oldPwd).then(function(data){
                    if(data.success){
                        Snackbar.show('密码输入正确!')
                        $scope.is_correct = !0;
                    }
                    else{
                        Snackbar.show('错误:请输入正确的密码!')
                        $scope.is_correct = !1;
                    }
                });
            }

            $scope.changePassword = function(){
                Authentication.changePassword($scope.user.newPwd, $scope.user.cfmPwd)
            }

            $scope.$watch('user.newPwd+user.cfmPwd', function(nv, ov){
                if ($scope.user.newPwd && $scope.user.cfmPwd  && $scope.user.newPwd == $scope.user.cfmPwd){
                    $scope.is_ok = !0;
                }else{
                    $scope.is_ok = !1;
                    if ($scope.user.newPwd && $scope.user.cfmPwd){

                        Snackbar.error('错误:输入的两次密码不相同!')
                    }else{

                    }
                }
            })
            // $scope.$watch('user.oldPwd', function(nv, ov) {
            //      // body...  
            //      console.log(nv, ov)
            // })

        })
}),define("account/controller/word", ["angular", "authentication/service", "settings/word/service", "components/snackbar/service"], function() {

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
}),define("settings/word/service", ["angular", "components/snackbar/service"], function(angular) {
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

}),define("authentication/controller/login", ["angular", "ngCookies", "authentication/service", "components/snackbar/service"], function() {

    return angular
        .module('app.authentication.controller.login', [])
        .controller('LoginController', ['$location', '$scope', 'Authentication', "Snackbar", function($location, $scope, Authentication, Snackbar) {
            var vm = this;
            vm.login = function() {
                Authentication.login(vm.email, vm.password);
            }

        }])
}),define("authentication/controller/register", ["angular", "ngCookies", "authentication/service"], function(angular) {
    return angular
        .module('app.authentication.controller.register', [])
        .controller('RegisterController', ['$location', '$scope', 'Authentication', function($location, $scope, Authentication) {
            var vm = this;
            vm.register = function() {
                Authentication.register(vm.email, vm.password, vm.username);
            }
        }]);
}),define("authentication/service", ["angular", "ngCookies", "components/snackbar/service"], function(angular) {
    return angular
        .module('app.authentication.services', ['ngCookies'])
        .factory('Authentication', ['$cookies', '$http', '$q', '$location', '$state', '$window', 'Snackbar', '$timeout', '$rootScope', function($cookies, $http, $q, $location, $state, $window, Snackbar, $timeout, $rootScope) {
            var currentUser;
            return {
                register: register,
                login: login,
                logout: logout,
                isAuthenticatedAccount: isAuthenticatedAccount,
                getCurrentUser: getCurrentUser,
                setCurrentUser: setCurrentUser,
                uploadImage: uploadImage,
                checkUserPassword: checkUserPassword,
                changePassword: changePassword
            }

            function setCurrentUser(user) {
                currentUser = user;
            }

            function getCurrentUser() {
                return currentUser;
            }

            function register(email, password, username) {
                if (!email || !password || !username){
                    return Snackbar.show('邮箱、用户名、密码无法为空!')
                }
                return $http.post('/api/v1/accounts/', {
                    username: username,
                    password: password,
                    email: email
                }).then(registerSuccessFn, registerErrorFn);

                function registerSuccessFn(data, status, headers, config) {
                    login(email, password);
                }

                function registerErrorFn(data, status, headers, config) {
                    console.log('register failed');
                    Snackbar.show(data.data.message)
                }
            }

            function login(email, password) {
                return $http.post('/api/v1/auth/login/', {
                    email: email,
                    password: password
                }).then(loginSuccessFn, loginErrorFn);

                function loginSuccessFn(data, status, headers, config) {
                    // setAuthenticateAccount(data.data);
                    Snackbar.show('登陆成功!');
                    $timeout(function() {
                        var search = $location.search();
                        var url = search.redirect || '/';
                        $rootScope.$apply(function(){
                            $rootScope.currentUser =  data.data;
                        });
                        $state.go('word', {}, { reload: true })
                        // window.location = '/#/account';
                    }, 1000);
                }

                function loginErrorFn(data, status, headers, config) {
                    Snackbar.error('错误:' + data.data);
                    // console.log('login errrors');
                }
            }

            function logout() {
                return $http.post('/api/v1/auth/logout/')
                    .then(logoutSuccessFn, logoutErrorFn);

                function logoutSuccessFn(data, status, headers, config) {
                    // unauthenticate();
                    $rootScope.currentUser = null;
                    // $rootScope.$apply();
                    $state.go('login', {}, { reload: true })
                    // window.location = '/#/login';
                }

                function logoutErrorFn(data, status, headers, config) {
                    console.error('logout failure!');
                }
            }

            function isAuthenticatedAccount() {
                // return !!$cookies.get('authencatedAccount');
                return !!currentUser;
            }

            function setAuthenticateAccount(account) {
                var now = new $window.Date(),
                    exp = new $window.Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);
                $cookies.put('authencatedAccount', JSON.stringify(account), {
                    expires: exp
                });
            }

            function uploadImage(model) {
                var fd = new FormData;
                fd.append("avatar", model);
                var promise = $http.post("/account/uploadimage/", fd, {
                    transformRequest: angular.identity,
                    headers: {
                        "Content-Type": void 0
                    }
                });
                return promise;
            }

            function changePassword(password, confirm_password) {
                return $http.put("/api/v1/accounts/" + currentUser.id + '/', {
                    password: password,
                    confirm_password: confirm_password
                }).then(function(data, status) {
                    Snackbar.show('密码更新成功，请重新登陆！')
                    $timeout(function() {
                        logout();
                    }, 3000);
                }, function() {
                    Snackbar.show('错误:更新失败!')
                });

            }

            function checkUserPassword(password) {
                var d = $q.defer();
                return $http.post("/account/checkpassword/", {
                    password: password
                }).success(function(data) {
                    d.resolve(data)
                }).error(function(err) {
                    d.reject(err);
                }), d.promise;
            }
            // function unauthenticate() {
            //     if (isAuthenticatedAccount()){
            //         $cookies.remove('authencatedAccount');
            //     }
            // }

        }]);

}),define("layout/navbar/controller", ["angular", "authentication/service"], function(angular) {
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
}),define("word/detail/controller", ["angular", "ngSanitize", "authentication/service", "word/service", "components/snackbar/service", "settings/word/service"], function(angular) {

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
}),define("word/word/controller", ["angular", "ngSanitize", "authentication/service", "word/service", "components/snackbar/service"], function(angular) {

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
}),define("app", ["angular", "ngAnimate", "uiBootstrapTpls", "layout/app", "authentication/app", "app/account", "app/routes", "components/module", "app/word"], function(angular) {
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
}),define("app/routes", ["angular", "uiRouter"], function(angular) {
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
}),requirejs.config({
    paths: {
        underscore: "/static/bower_components/underscore/underscore",
        jquery: "/static/bower_components/jquery/dist/jquery",
        angular: "/static/bower_components/angular/angular",
        uiRouter: "/static/bower_components/angular-ui-router/release/angular-ui-router",
        uiBootstrap: "/static/bower_components/angular-bootstrap/ui-bootstrap.min",
        uiBootstrapTpls: "/static/bower_components/angular-bootstrap/ui-bootstrap-tpls.min",
        cropper: "/static/bower_components/cropper/dist/cropper.min",
        ngAnimate: "/static/bower_components/angular-animate/angular-animate",
        ngAria: "/static/bower_components/angular-aria/angular-aria",
        ngCookies: "/static/bower_components/angular-cookies/angular-cookies",
        ngSanitize: "/static/bower_components/angular-sanitize/angular-sanitize",
        app: "/static/javascripts/app",
        snackbar: "/static/bower_components/snackbarjs/dist/snackbar.min"
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
                }]), angular.bootstrap(document, ["app"])
            })
            .error(function(result){
                var currentUser = '';
                var temp = angular.module("app");
                temp.run(["Authentication", "$http", "$rootScope", '$state',
                    function(Authentication, $http, $rootScope, $state) {
                        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
                        $http.defaults.xsrfCookieName = 'csrftoken';
                        $rootScope.currentUser = currentUser;
                        Authentication.setCurrentUser(currentUser);
                        $state.go('login')
                }]), angular.bootstrap(document, ["app"])
            })
    });
}), define("main", function() {})