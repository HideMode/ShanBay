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
})