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
            indicator: "data-wo-",
            ver: "1.0.0",
            console: {
                log: function (o) {console&& console.log (o)},
                error: function (o) { console && console.error(o) },
                warn: function (o) { console && console.warn(o) }
            },
            test: function (o, msg, f) {
                var m = msg || "";
                var testResult = o ? true : false;
                var testMsg=testResult ? "Test passed: " + m: "Test failed: " + m ;
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
            return $(t).is("[" + this.config.indicator + a + "]") ? true : false;
        },
        work: function (that, sw, f) {
            return this.check(sw, that) && (typeof f === "function") && f({
                ref: that,
                root: this.config,
                console:this.config.console,
                arg: $(that).attr(this.config.indicator + sw),
                $: $,
                test: this.config.test
            }
                );
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
            services.execute = function () {
                if (services.execute.executed) {
                } else {
                    services.execute.executed = true;
                    $("[data-wo]").each(function () {
                        $(this).Wo$ng({
                            color: "#c0c0c0",
                            operations: services.obj
                        });
                    });
                }
            };

            return services;
        })();

        w.Wo$ng = function (pluginName) {
            if (pluginName) {
                w.Wo$ng[pluginName] = new wong();
                w.Wo$ng[pluginName].init = function () {
                    w.Wo$ng[pluginName].serviceFactory.execute();
                };

                return w.Wo$ng[pluginName];
            }
        }
    }
})(wongJq, window);