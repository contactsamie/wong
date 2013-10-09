(function () {
    Wo$ng && Wo$ng("sam").serviceFactory("enable", function (param) {
        param.$(param.ref).css("color", param.root.color);
        param.test(typeof param.arg === "function", "arg must be a function");
        param.console.log(param.arg);
    });
})();