(function () {
    Wo$ng && Wo$ng("sam").serviceFactory("enable", function ($arg, $model, $rootModel, $test, $param) {
        $param.console.log($param);
        $param.$($param.jElement).css("color", $param.root.color);
        $test(typeof $arg === "function", "arg must be a function");
        $model.memberId.addClass("thisIsWorking");
    });


    Wo$ng && Wo$ng("sam").serviceFactory("disable", function ($arg, $model, $rootModel, $test, $param) {
       
        $model.memberId.look("background-color", $arg);
     
    });


})();