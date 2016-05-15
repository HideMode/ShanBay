define("app/word", ["angular", "word/service", "word/word/controller", "word/detail/controller"], function(angular) {
    return angular
        .module('app.word', [
            'app.word.services',
            'app.word.word.controllers',
            'app.word.detail.controllers'
        ]);
})