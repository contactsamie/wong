var wongJq = jQuery.noConflict();
; (function ($, window, document, undefined) {
    var Plugin = function (elem, options) {
        this.elem = elem;
        this.$elem = $(elem);
        this.options = options;
        this.metadata = this.$elem.data('plugin-options');
    };
    Plugin.prototype = {
        defaults: {
            color: '#ffeeee',
            operations: [],
            def_indicator: "data-sa-method-",
            indicator: "sa-method-",
            ver: "1.0.0",
            scope: {},
            rootScope: {},
            moduleName: "default",
            console: {
                log: function (o) { console && console.log(o) },
                error: function (o) { console && console.error(o) },
                warn: function (o) { console && console.warn(o) }
            },
            test: function (o, msg, f) {
                var m = msg || "";
                var testResult = o ? true : false;
                var testMsg = testResult ? "Test passed: " + m : "Test failed: " + m;
                testResult ? this.console.warn(testMsg) : this.console.error(testMsg);
                typeof f === "function" && f(testResult, testMsg);
                return testResult;
            }
        },

        init: function (that) {
            this.config = $.extend({}, this.defaults, this.options, this.metadata);
            this.op(that);
        },
        check: function (a, t) {
            return ($(t).is("[" + this.config.indicator + a + "]") || $(t).is("[" + this.config.def_indicator + a + "]")) ? true : false;
        },
        work: function (that, sw, f) {
            var argP = $(that).attr(this.config.indicator + sw) || $(that).attr(this.config.def_indicator + sw);

            try {
                this.check(sw, that) &&
                   (typeof f === "function") &&
                   f(argP, this.config.scope.model, this.config.rootScope, this.config.test, {
                       jElement: that,
                       root: this.config,
                       console: this.config.console,
                       arg: argP,
                       $: $,
                       test: this.config.test,
                       scope: this.config.scope,
                       rootScope: this.config.rootScope,
                       module: this.config.moduleName
                   }
                   );
            }
            catch (ex) {
                console.log("invalid controller compilation");
            }
        },
        op: function (that) {
            for (var i = 0; i < this.config.operations.length; i++) {
                var ope = this.config.operations[i];
                this.work(that, ope.arg, ope.method);
            }
        }
    };

    Plugin.defaults = Plugin.prototype.defaults;

    $.fn.Wo$ng = function (options) {
        return this.each(function () {
            new Plugin(this, options).init(this);
        });
    };
})(wongJq, window, document);

(function ($, w) {
    if (w.Wo$ng) {
    } else {
        var wong = function () { };
        wong.prototype.serviceFactory = (function () {
            var services = function (name, service) {
                if (name && (typeof service === "function")) {
                    services.obj = services.obj || [];
                    services.obj.push({
                        method: service,
                        arg: name
                    })
                }
            };
            wong.prototype.rootScope = function () { };

            var servBuilder = function (that, pluginName) {
                if (($(that).attr("data-sa-ran") === "exe") || ($(that).attr("sa-ran") === "exe")) {
                } else {
                    //wong.prototype.rootScope[pluginName]["model"]["$look"] = wong.prototype.rootScope[pluginName]["model"]["$look"] || function (n, v) {
                    //    $(that).css(n, v);
                    //};

                    $(that).attr("data-sa-ran", "exe");
                    $(that).attr("sa-ran", "exe");
                    var model = $(that).attr("data-sa-model") || $(that).attr("sa-model");
                    if (model) {
                        var mVal = model.split('=');
                        wong.prototype.rootScope[pluginName]["model"][mVal[0]] =
                           wong.prototype.rootScope[pluginName]["model"][mVal[0]] || (function () {
                               var model = function () {
                                   return (typeof mVal[1] === "undefined" ? $(that).val() : mVal[1]);
                               };
                               model.look = function (n, v) {
                                   $(that).css(n, v);
                               };
                               model.addClass = function (c) {
                                   $(that).addClass(c);
                               };
                               model.removeClass = function (c) {
                                   $(that).addClass(c);
                               };
                               model.remove = function (c) {
                                   $(that).remove(c);
                               };

                               return model;
                           })();
                    }

                    $(that).Wo$ng({
                        scope: wong.prototype.rootScope[pluginName],
                        color: "#c0c0c0",
                        operations: services.obj,
                        rootScope: wong.prototype.rootScope,
                        moduleName: pluginName
                    });
                }
            };

            services.execute = function (pluginName) {
                wong.prototype.rootScope[pluginName] = wong.prototype.rootScope[pluginName] || {
                    model: function () { }
                };
                $("[data-sa-module='" + pluginName + "'],[sa-module='" + pluginName + "']").each(function () {
                    servBuilder(this, pluginName);

                    if (($(this).attr("data-sa-module") === pluginName) || ($(this).attr("sa-module") === pluginName)) {
                        $(this).find("*").each(function () {
                            servBuilder(this, pluginName);
                        });
                    }
                });
            };

            return services;
        })();

        w.Wo$ng = function (pluginName) {
            if (pluginName) {
                w.Wo$ng[pluginName] = new wong();
                w.Wo$ng[pluginName].init = function () {
                    w.Wo$ng[pluginName].serviceFactory.execute(pluginName);
                };

                return w.Wo$ng[pluginName];
            }
        }
    }
})(wongJq, window);