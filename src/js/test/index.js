(window.webpackJsonp = window.webpackJsonp || []).push([
    [9], {
        0: function(t, e, n) {
            "use strict";
            n(1);
            var i = window.jsp_config.baseUrl;
            hookAjax({
                onreadystatechange: function(t) {
                    if (t.responseXML) return window.open(i + "login.html", "_top"), !0
                },
                onload: function(t) {
                    if (t.responseXML) return window.open(i + "login.html", "_top"), !0
                }
            })
        },
        1: function(t, e, n) {
            "use strict";
            var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                return typeof t
            } : function(t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            };
            ! function(t) {
                function e(i) {
                    if (n[i]) return n[i].exports;
                    var r = n[i] = {
                        exports: {},
                        id: i,
                        loaded: !1
                    };
                    return t[i].call(r.exports, r, r.exports, e), r.loaded = !0, r.exports
                }
                var n = {};
                e.m = t, e.c = n, e.p = "", e(0)
            }([function(t, e, n) {
                n(1)(window)
            }, function(t, e) {
                t.exports = function(t) {
                    t.hookAjax = function(t) {
                        function e(e) {
                            return function() {
                                var n = this.hasOwnProperty(e + "_") ? this[e + "_"] : this.xhr[e],
                                    i = (t[e] || {}).getter;
                                return i && i(n, this) || n
                            }
                        }

                        function n(e) {
                            return function(n) {
                                var i = this.xhr,
                                    r = this,
                                    a = t[e];
                                if ("function" == typeof a) i[e] = function() {
                                    t[e](r) || n.apply(i, arguments)
                                };
                                else {
                                    var o = (a || {}).setter;
                                    n = o && o(n, r) || n;
                                    try {
                                        i[e] = n
                                    } catch (i) {
                                        this[e + "_"] = n
                                    }
                                }
                            }
                        }

                        function r(e) {
                            return function() {
                                var n = [].slice.call(arguments);
                                if (!t[e] || !t[e].call(this, n, this.xhr)) return this.xhr[e].apply(this.xhr, n)
                            }
                        }
                        return window._ahrealxhr = window._ahrealxhr || XMLHttpRequest, XMLHttpRequest = function() {
                            for (var t in this.xhr = new window._ahrealxhr, this.xhr) {
                                var a = "";
                                try {
                                    a = i(this.xhr[t])
                                } catch (t) {}
                                "function" === a ? this[t] = r(t) : Object.defineProperty(this, t, {
                                    get: e(t),
                                    set: n(t)
                                })
                            }
                        }, window._ahrealxhr
                    }, t.unHookAjax = function() {
                        window._ahrealxhr && (XMLHttpRequest = window._ahrealxhr), window._ahrealxhr = void 0
                    }, t.default = t
                }
            }])
        },
        12: function(t, e, n) {
            "use strict";
            Object.defineProperty(e, "__esModule", {
                value: !0
            }), e.STable = e.Border = e.View = void 0;
            var i = function() {
                    function t(t, e) {
                        for (var n = 0; n < e.length; n++) {
                            var i = e[n];
                            i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
                        }
                    }
                    return function(e, n, i) {
                        return n && t(e.prototype, n), i && t(e, i), e
                    }
                }(),
                r = n(18),
                a = n(17),
                o = n(16),
                s = function() {
                    function t(e, n, i) {
                        var r = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : "1";
                        ! function(e, n) {
                            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                        }(this);
                        var a = n.id,
                            o = n.type,
                            s = n.index,
                            l = n.viewTitle;
                        this.container = e, this.viewType = o, this.borderType = "0", this.viewTitle = l, this.id = a, this.index = s, this.status = r, this.init(i)
                    }
                    return i(t, [{
                        key: "init",
                        value: function(t) {
                            var e = this.container.children(".view-content"),
                                n = this.container.children(".bgSvg");
                            this.border = !!n.length, this.borderType = this.border && n.attr("echo-type") || "0", this.border && this.initBorder(n), e.html(this.renderContent());
                            var i = e.children(".chart");
                            this[{
                                table: "initTable",
                                chart: "initChart",
                                realTime: "initRealTime"
                            }[this.viewType]](i, t)
                        }
                    }, {
                        key: "initChart",
                        value: function(t, e) {
                            var n = this.borderType;
                            this.chart = new a.Chart(t[0], {
                                border: n
                            }, e)
                        }
                    }, {
                        key: "initTable",
                        value: function(t, e) {
                            var n = this.borderType;
                            this.table = new o.STable(t, {
                                border: n
                            }, e)
                        }
                    }, {
                        key: "initRealTime",
                        value: function(t, e) {}
                    }, {
                        key: "initBorder",
                        value: function(t) {
                            var e = this.viewTitle,
                                n = this.id;
                            this.border = new r.Border(t, {
                                id: n,
                                title: e
                            })
                        }
                    }, {
                        key: "renderViewOpt1",
                        value: function() {
                            return '<div class="view-optBox ' + ("2" === this.borderType ? "border3-opt" : "") + '" >\n\t        \t\t<div class="btn-handle">\n\t\t\t\t\t\t<span class="fa fa-bars" ></span>\n\t\t\t\t\t</div>\n\t        \t\t<div class="view-btns" echo-id="' + this.id + '" echo-index="' + this.index + '">\n\t\t\t\t\t\t\n\t\t\t\t\t\t<span class="fa fa-expand view-btn" sign="expand" title="最大化"></span>\n\t\t\t\t\t\t<span class="fa fa-file-excel-o view-btn" sign="excel" title="导出excel"></span>\n\t\t\t\t\t\t<span class="fa fa-file-image-o view-btn" sign="image" title="导出图片"></span>\n\t\t\t\t\t\t\n\t\t\t\t\t</div>\n\t\t\t\t\t\n\t        \t</div>'
                        }
                    }, {
                        key: "renderViewOpt2",
                        value: function() {
                            return '<div class="view-optBox ' + ("2" === this.borderType ? "border3-opt" : "") + '" >\n\t        \t\t<div class="btn-handle">\n\t\t\t\t\t\t<span class="fa fa-bars" ></span>\n\t\t\t\t\t</div>\n\t        \t\t<div class="view-btns" echo-id="' + this.id + '" echo-index="' + this.index + '">\n\t\t\t\t\t\t<span class="fa fa-trash view-btn" sign="remove" title="删除"></span>\n\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t<span class="fa fa-edit view-btn" sign="set" title="设置"></span>\n\t\t\t\t\t</div>\n\t\t\t\t\t\n\t        \t</div>'
                        }
                    }, {
                        key: "renderContent",
                        value: function() {
                            return (1 == this.status && this.renderViewOpt1() || this.renderViewOpt2()) + '<div class="chart"></div>'
                        }
                    }]), t
                }();
            e.View = s, e.Border = r.Border, e.STable = o.STable
        },
        13: function(t, e, n) {
            "use strict";
            Object.defineProperty(e, "__esModule", {
                value: !0
            });
            var i = function() {
                function t(t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var i = e[n];
                        i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
                    }
                }
                return function(e, n, i) {
                    return n && t(e.prototype, n), i && t(e, i), e
                }
            }();
            n(0);
            var r = window.jsp_config.baseUrl,
                a = r + "layout/",
                o = r + "chart/",
                s = r + "Expo/",
                l = new(function() {
                    function t() {
                        ! function(t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, t)
                    }
                    return i(t, [{
                        key: "showLayoutModel",
                        value: function(t) {
                            return Promise.resolve($.post(a + "showLayoutModel", {
                                layout_id: t
                            }))
                        }
                    }, {
                        key: "getGraphData",
                        value: function(t) {
                            return Promise.resolve($.post(o + "getGraphData", {
                                chart_id: t
                            }))
                        }
                    }, {
                        key: "getExeclld",
                        value: function(t) {
                            return Promise.resolve($.ajax({
                                url: s + "getExeclId",
                                type: "post",
                                contentType: "application/json",
                                data: JSON.stringify(t)
                            }))
                        }
                    }, {
                        key: "getTableData",
                        value: function(t) {
                            return Promise.resolve($.post(o + "getTableData", {
                                chartId: t
                            }))
                        }
                    }]), t
                }());
            e.api = l
        },
        15: function(t, e) {},
        16: function(t, e, n) {
            "use strict";
            Object.defineProperty(e, "__esModule", {
                value: !0
            }), e.STable = void 0;
            var i = function() {
                function t(t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var i = e[n];
                        i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
                    }
                }
                return function(e, n, i) {
                    return n && t(e.prototype, n), i && t(e, i), e
                }
            }();
            n(15);
            var r = function() {
                function t(e, n, i) {
                    ! function(e, n) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    }(this);
                    var r = n.border,
                        a = JSON.parse(JSON.stringify(i));
                    this.border = r, this.container = e, this.init(a)
                }
                return i(t, [{
                    key: "init",
                    value: function(t) {
                        var e = this,
                            n = t.tabInfo,
                            i = n.chartName,
                            r = n.row_wd,
                            a = n.col_wd,
                            o = n.total,
                            s = n.tab_style,
                            l = t.data;
                        this.title = i, this.config = {
                            row_wd: r,
                            col_wd: a,
                            total: o,
                            tab_style: s
                        };
                        var c = this.renderTableHead(l),
                            d = this.renderTableBody(l),
                            h = this.container.height(),
                            f = this.border,
                            u = "0" === f ? 0 : 30,
                            p = "0" === f ? 10 : 0,
                            g = '\n\t\t\t\t\t\t<div  class="s-tableBox fix-tab ' + ("0" !== s ? "border-box" : "") + '" style="margin-top: ' + u + 'px;">\n\t\t\t\t\t\t\t\t' + ("0" === f ? '<p class="s-table-title">' + (i || "") + "</p>" : "") + '\n\t\t\t\t\t\t\t\t<div class="tab-head">\n\t\t\t\t\t\t\t\t\t<table class="tab-list ">\n\t\t\t\t\t\t\t\t\t\t<thead>\n\t\t\t\t\t\t\t\t\t\t    ' + c.join("") + '   \n\t\t\t\t\t\t\t\t\t    </thead>\n\t\t\t\t\t\t\t\t\t</table>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<div class="table-body-wrap " >\n\t\t\t\t\t\t\t\t\t   <table  border="' + s + '" class="tab-list table-body" frame="void">\n\t\t\t\t\t\t\t\t\t\t\t' + d.join("") + "\n\n\t\t\t\t\t\t\t\t\t   </table>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t";
                        this.container.html(g);
                        var w = this.container.find(".table-body-wrap");
                        r.length, w.css("height", h - this.container.find(".tab-head").height() - 14 - u - p);
                        var v = 0 < w.height() - w.children("table").height();
                        !v && this.container.find(".gutter").show(), $(window).on("resize", function() {
                            w.css("height", h - e.container.find(".tab-head").height() - 20), !v && e.container.find(".gutter").show()
                        })
                    }
                }, {
                    key: "getRandom",
                    value: function() {
                        var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 500;
                        return Math.floor(Math.random() * (t - 100 + 1) + 100)
                    }
                }, {
                    key: "renderTableHead",
                    value: function(t) {
                        var e = this,
                            n = this.config,
                            i = n.row_wd,
                            r = n.col_wd,
                            a = n.total,
                            o = ["", "时间", "科室", "指标", "维度值"],
                            s = i.length;
                        return t.slice(0, s).map(function(t, n) {
                            var l = e.colspanCount(t, a),
                                c = l.headData,
                                d = l.colspanCount,
                                h = c.reduce(function(t, e, i) {
                                    var r = "";
                                    return n < s - 1 && (i + 1) % d == 0 ? r = '<th colspan="' + d + '">' + e + "</th>" : n == s - 1 && (r = "<th>" + e + "</th>"), t.push(r), t
                                }, []);
                            if (0 === n) {
                                var f = r.map(function(t) {
                                    return o[+t]
                                });
                                h.unshift('<th rowspan="' + i.length + '" width="' + (120 * r.length + r.length - 1) + '">' + f.join(" / ") + "</th>"), ["1", "3"].includes(a) && (h[h.length] = '<th rowspan="' + s + '">合计</th>'), h.push('<th class="gutter" rowspan="' + s + '"></th>')
                            }
                            return "<tr>" + h.join("") + "</tr>"
                        })
                    }
                }, {
                    key: "renderRow",
                    value: function(t, e, n) {
                        var i = this;
                        return t.reduce(function(t, r, a) {
                            if (a < n.length) {
                                var o = n[a];
                                (e + 1) % o != 1 && 1 !== o || t.push('<td rowspan="' + r + '" width="120">' + r + "</td>")
                            } else {
                                var s = i.getRandom();
                                t.push("<td>" + s + "</td>")
                            }
                            return t
                        }, [])
                    }
                }, {
                    key: "renderTableBody",
                    value: function(t) {
                        var e = this,
                            n = this.config,
                            i = n.row_wd,
                            r = n.col_wd,
                            a = n.total,
                            o = n.tab_style,
                            s = t.slice(i.length),
                            l = this.rowspanCount(s),
                            c = ["2", "3"].includes(a) && s.pop().splice(r.length) || null,
                            d = 0,
                            h = s.map(function(t, n) {
                                return n % l[0] == 0 && d++, '<tr class="' + ("0" === o ? d % 2 == 0 ? "tr-bg1" : "tr-bg2" : "") + '">' + e.renderRow(t, n, l).join("") + "</tr>"
                            });
                        if (c) {
                            var f = c && c.map(function(t) {
                                return "<td>" + t + "</td>"
                            });
                            h.push('<tr class="' + ("0" === o ? "foot-bg" : "") + '"><td colspan="' + r.length + '">合计</td>' + f.join("") + "</tr>")
                        }
                        return h
                    }
                }, {
                    key: "rowspanCount",
                    value: function(t) {
                        return this.config.col_wd.map(function(e, n) {
                            var i = t[0][n],
                                r = t.findIndex(function(t, e) {
                                    return t[n] != i
                                });
                            return -1 === r ? 1 : r
                        })
                    }
                }, {
                    key: "colspanCount",
                    value: function(t, e) {
                        var n = this.config,
                            i = (n.row_wd, n.col_wd);
                        t.splice(0, i.length), ["1", "3"].includes(e) && t.pop();
                        var r = t.findIndex(function(e) {
                            return e !== t[0]
                        });
                        return {
                            headData: t,
                            colspanCount: r
                        }
                    }
                }]), t
            }();
            e.STable = r
        },
        17: function(t, e, n) {
            "use strict";
            Object.defineProperty(e, "__esModule", {
                value: !0
            }), e.Chart = void 0;
            var i = function() {
                function t(t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var i = e[n];
                        i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
                    }
                }
                return function(e, n, i) {
                    return n && t(e.prototype, n), i && t(e, i), e
                }
            }();
            n(13);
            var r = function() {
                function t(e, n, i) {
                    ! function(e, n) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    }(this);
                    var r = n.border;
                    this.border = r, this.type = "", this.Box = e, this.init(i), this.color = ["#1296FB", "#8FD6FA", "#0088CC", "#06B76A", "#CBC450", "#FD8D1D"]
                }
                return i(t, [{
                    key: "init",
                    value: function(t) {
                        var e = this.border,
                            n = t.graphInfo,
                            i = n.chartType,
                            r = n.chartName,
                            a = n.contrastDim,
                            o = n.rowDim,
                            s = t.data;
                        this.type = i;
                        var l = this[{
                            3: "tabConfig",
                            4: "lineConfig",
                            5: "pieConfig",
                            6: "radarConfig",
                            7: "scatterConfig"
                        }[this.type]](s);
                        l.Dim = {
                            contrastDim: a,
                            rowDim: o
                        }, "0" === e && (l.title = {
                            text: r,
                            left: "center",
                            textStyle: {
                                color: "white",
                                fontSize: 14
                            }
                        }, l.backgroundColor = "#4490c175");
                        var c = echarts.init(this.Box);
                        c.setOption(l), $(window).on("resize", function() {
                            c.resize()
                        })
                    }
                }, {
                    key: "pieConfig",
                    value: function(t) {
                        var e = this;
                        console.log(t);
                        var n = t[0],
                            i = n.rowData,
                            r = n.legend,
                            a = n.roseType,
                            o = i.map(function(n, i) {
                                return {
                                    name: t[0].rowDimName[i],
                                    value: n != "--" && n || null,
                                    selected: a % 2 != 0
                                }
                            }),
                            s = ["#c487ee", "#deb140", "#49dff0", "#034079", "#6f81da", "#00ffb4"],
                            l = ["#1296FB", "#0088CC", "#00c4a5", "#ea2e41", "#05ffff", "#ff6584"],
                            c = ["#05acff", "#ee36ff", "#05fcfb", "#ffa597"],
                            d = ["#09c1ff", "#8171ff", "#05ffff", "#ff6584"],
                            h = o.map(function(t, e) {
                                var n = {
                                    normal: {
                                        color: {
                                            type: "linear",
                                            x: 0,
                                            y: 0,
                                            x2: 0,
                                            y2: 1,
                                            colorStops: [{
                                                offset: 0,
                                                color: s[e]
                                            }, {
                                                offset: 1,
                                                color: l[e]
                                            }],
                                            globalCoord: !0
                                        }
                                    }
                                };
                                return Object.assign({}, t, {
                                    itemStyle: n
                                })
                            }),
                            f = (o.map(function(t, e) {
                                var n = {
                                    normal: {
                                        color: {
                                            type: "linear",
                                            x: 0,
                                            y: 0,
                                            x2: 0,
                                            y2: 1,
                                            colorStops: [{
                                                offset: 0,
                                                color: c[e]
                                            }, {
                                                offset: 1,
                                                color: d[e]
                                            }],
                                            globalCoord: !1
                                        }
                                    }
                                };
                                return Object.assign({}, t, n)
                            }), this.getLegendPosition(r)),
                            u = Object.assign(f.legend, {
                                textStyle: {
                                    color: "#f2f2f2",
                                    fontSize: 12
                                },
                                icon: "circle",
                                data: o
                            });
                        return {
                            tooltip: {
                                show: !0,
                                trigger: "item"
                            },
                            roseType: a % 2 == 0,
                            legend: u,
                            series: [{
                                radius: a < 3 && ["10%", "60%"] || ["30%", "60%"],
                                center: f.center,
                                type: "pie",
                                label: {
                                    show: !0,
                                    position: "outside",
                                    color: "#ddd",
                                    formatter: function(t) {
                                        for (var e, n = 0, i = 0; i < o.length; i++) n += o[i].value;
                                        return e = (t.value / n * 100).toFixed(0), "" !== t.name ? t.name + "\n{white|占比" + e + "%}" : ""
                                    },
                                    rich: {
                                        white: {
                                            color: "#ddd",
                                            align: "center",
                                            padding: [3, 0]
                                        }
                                    }
                                },
                                labelLine: {
                                    show: !0,
                                    color: "#ffff"
                                },
                                name: "",
                                data: h,
                                tooltip: {
                                    formatter: "{b}: {c}"
                                }
                            }]
                        }
                    }
                }, {
                    key: "getRandom",
                    value: function() {
                        var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 1e3;
                        return Math.floor(Math.random() * (t - 80 + 1) + 80)
                    }
                }, {
                    key: "getLegendPosition",
                    value: function(t) {
                        var e = 1 < arguments.length && void 0 !== arguments[1] && arguments[1],
                            n = this.border,
                            i = "3" === n ? "12%" : "8%",
                            r = e ? 2 : 0,
                            a = "3" === n ? 4 : 3,
                            o = "3" === n ? 8 : 6;
                        switch (t) {
                            case "1":
                                return {
                                    legend: {
                                        top: i,
                                        left: 20,
                                        orient: "horizontal"
                                    },
                                    grid: {
                                        top: o + 20 + "%",
                                        left: r + 10 + "%",
                                        right: "6%",
                                        bottom: "12%"
                                    },
                                    center: ["50%", a + 55 + "%"]
                                };
                            case "2":
                                return {
                                    legend: {
                                        bottom: 16,
                                        left: 20,
                                        orient: "horizontal"
                                    },
                                    grid: {
                                        top: o + 12 + "%",
                                        left: r + 14 + "%",
                                        right: "6%",
                                        bottom: "32%"
                                    },
                                    center: ["50%", a + 45 + "%"]
                                };
                            case "3":
                                return {
                                    legend: {
                                        top: i,
                                        left: 4,
                                        orient: "vertical"
                                    },
                                    grid: {
                                        left: r + 30 + "%",
                                        top: o + 12 + "%",
                                        right: "6%",
                                        bottom: "14%"
                                    },
                                    center: ["55%", a + 50 + "%"]
                                };
                            case "4":
                                return {
                                    legend: {
                                        top: i,
                                        right: 4,
                                        orient: "vertical"
                                    },
                                    grid: {
                                        top: o + 14 + "%",
                                        right: "24%",
                                        left: r + 12 + "%",
                                        bottom: "14%"
                                    },
                                    center: ["45%", a + 50 + "%"]
                                };
                            case "5":
                                return {
                                    legend: {
                                        show: !1
                                    },
                                    grid: {
                                        left: r + 14 + "%",
                                        right: "6%",
                                        top: o + 12 + "%",
                                        bottom: "14%"
                                    },
                                    center: ["45%", a + 50 + "%"]
                                }
                        }
                    }
                }, {
                    key: "lineConfig",
                    value: function(t) {
                        var e = this;
                        console.log(t);
                        var n = t[0],
                            i = n.rowDimName,
                            r = n.landscape,
                            a = n.legend,
                            o = n.threeD,
                            s = n.stack,
                            l = n.lineType,
                            c = o.split(","),
                            d = i.map(function(t) {
                                return {
                                    value: t,
                                    textStyle: {
                                        color: "white"
                                    }
                                }
                            }),
                            h = [],
                            f = ["#1a9bfc", "#99da69", "#e4c73c", "#01babc"],
                            u = t.map(function(t, n) {
                                var i = t.contrastDimName,
                                    a = t.rowData;
                                h[n] = i;
                                var o = "1" === l && "1" === r && {
                                        normal: {
                                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                                offset: 0,
                                                color: f[n]
                                            }, {
                                                offset: .8,
                                                color: "rgba(255,255,255,0)"
                                            }], !1),
                                            shadowBlur: 10,
                                            opacity: .3
                                        }
                                    } || null,
                                    c = a.map(function(t) {
                                        return t != "--" && t || null
                                    });
                                return {
                                    name: i,
                                    type: "1" === l ? "line" : "bar",
                                    areaStyle: o,
                                    smooth: !0,
                                    showSymbol: !0,
                                    symbol: "circle",
                                    symbolSize: 8,
                                    barWidth: 20,
                                    stack: "1" === s ? "stack" : null,
                                    data: c
                                }
                            }),
                            p = "2" === l && "1" === r,
                            g = this.getLegendPosition(a, p),
                            w = Object.assign(g.legend, {
                                textStyle: {
                                    fontSize: 12,
                                    color: "white"
                                },
                                data: h
                            }),
                            v = Object.assign(g.grid, {}),
                            b = {
                                type: "category",
                                data: d,
                                boundaryGap: "1" !== l,
                                axisLine: {
                                    show: Boolean(+c[0]),
                                    lineStyle: {
                                        color: "#fff"
                                    }
                                },
                                axisTick: {
                                    show: Boolean(+c[0])
                                },
                                axisLabel: {
                                    textStyle: {
                                        fontSize: 12
                                    }
                                }
                            },
                            m = {
                                type: "value",
                                axisLine: {
                                    show: Boolean(+c[1]),
                                    lineStyle: {
                                        color: "#fff"
                                    }
                                },
                                axisTick: {
                                    show: Boolean(+c[1])
                                },
                                splitLine: {
                                    show: Boolean(+c[1])
                                },
                                axisLabel: {
                                    show: Boolean(+c[1]),
                                    textStyle: {
                                        fontSize: 12
                                    }
                                }
                            };
                        return {
                            color: ["#1a9bfc", "#99da69", "#e4c73c", "#01babc"],
                            tooltip: {
                                trigger: "axis",
                                axisPointer: {
                                    lineStyle: {
                                        color: "#ddd"
                                    }
                                },
                                backgroundColor: "rgba(255,255,255,1)",
                                padding: [5, 10],
                                textStyle: {
                                    color: "#7588E4"
                                },
                                extraCssText: "box-shadow: 0 0 5px rgba(0,0,0,0.3)"
                            },
                            grid: v,
                            legend: w,
                            xAxis: p && m || b,
                            yAxis: p && b || m,
                            series: u
                        }
                    }
                }, {
                    key: "scatterConfig",
                    value: function(t) {
                        var e = this;
                        console.log(t);
                        var n = t[0],
                            i = n.rowDimName,
                            r = n.landscape,
                            a = n.legend,
                            o = n.threeD,
                            s = [],
                            l = t.map(function(t, n) {
                                var i = t.contrastDimName,
                                    a = t.rowData;
                                return {
                                    name: s[n] = i,
                                    type: "scatter",
                                    smooth: !0,
                                    showSymbol: !0,
                                    symbol: "circle",
                                    symbolSize: function(t) {
                                        return "1" === r && Math.sqrt(t) || 8
                                    },
                                    data: a.map(function(t) {
                                        return t != "--" && t || null
                                    })
                                }
                            }),
                            c = o.split(","),
                            d = i.map(function(t) {
                                return {
                                    value: t,
                                    textStyle: {
                                        color: "white"
                                    }
                                }
                            }),
                            h = this.getLegendPosition(a);
                        return {
                            color: ["#1296FB", "#8FD6FA", "#0088CC", "#06B76A", "#CBC450", "#FD8D1D"],
                            legend: Object.assign(h.legend, {
                                textStyle: {
                                    fontSize: 12,
                                    color: "white"
                                },
                                data: s
                            }),
                            grid: Object.assign(h.grid, {}),
                            tooltip: {
                                padding: 10,
                                backgroundColor: "#222",
                                borderColor: "#777",
                                borderWidth: 1,
                                formatter: function(t) {
                                    var e = t.value;
                                    return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 14px;padding-bottom: 7px;">' + t.seriesName + ": " + e + "</div>"
                                }
                            },
                            xAxis: {
                                type: "category",
                                data: d,
                                axisLine: {
                                    show: Boolean(+c[0]),
                                    lineStyle: {
                                        color: "#fff"
                                    }
                                },
                                axisTick: {
                                    show: Boolean(+c[0])
                                },
                                axisLabel: {
                                    textStyle: {
                                        fontSize: 12
                                    }
                                }
                            },
                            yAxis: {
                                type: "value",
                                axisLine: {
                                    show: Boolean(+c[1]),
                                    lineStyle: {
                                        color: "#fff"
                                    }
                                },
                                axisTick: {
                                    show: Boolean(+c[1])
                                },
                                splitLine: {
                                    show: Boolean(+c[1]),
                                    lineStyle: {
                                        type: "dashed",
                                        opacity: .6
                                    }
                                },
                                axisLabel: {
                                    show: Boolean(+c[1]),
                                    textStyle: {
                                        fontSize: 12
                                    }
                                }
                            },
                            series: l
                        }
                    }
                }, {
                    key: "radarConfig",
                    value: function(t) {
                        var e, n, i = this,
                            r = t[0],
                            a = r.rowDimName,
                            o = r.legend,
                            s = r.area,
                            l = a.map(function(t) {
                                return {
                                    text: t,
                                    max: function(t) {
                                        return 1.5 * t.max
                                    }
                                }
                            }),
                            c = [],
                            d = t.map(function(t, e) {
                                var n = t.rowData,
                                    r = t.contrastDimName;
                                return c[e] = r, {
                                    value: n.map(function(t) {
                                        return t != "--" && t || null
                                    }),
                                    name: r
                                }
                            }),
                            h = this.getLegendPosition(o);
                        return {
                            color: ["#1296FB", "#8FD6FA", "#0088CC", "#06B76A", "#CBC450", "#FD8D1D"],
                            tooltip: {
                                trigger: "axis"
                            },
                            legend: Object.assign(h.legend, {
                                textStyle: {
                                    color: "#f2f2f2",
                                    fontSize: 12
                                },
                                itemWidth: 12,
                                itemHeight: 12,
                                data: c
                            }),
                            radar: [{
                                indicator: l,
                                center: h.center,
                                radius: "55%",
                                shape: "1" === s ? "polygon" : "circle",
                                name: {
                                    textStyle: {
                                        color: "white",
                                        fontSize: 12
                                    }
                                },
                                nameGap: 10,
                                splitLine: {
                                    lineStyle: {
                                        color: "#0b5263",
                                        opacity: .5,
                                        width: 2
                                    }
                                },
                                splitArea: {
                                    areaStyle: (e = {
                                        color: "#E9E6C9",
                                        opacity: 1,
                                        shadowBlur: 45,
                                        shadowColor: "rgba(0,0,0,.5)",
                                        shadowOffsetX: 0,
                                        shadowOffsetY: 15
                                    }, n = "opacity", .5, n in e ? Object.defineProperty(e, n, {
                                        value: .5,
                                        enumerable: !0,
                                        configurable: !0,
                                        writable: !0
                                    }) : e[n] = .5, e)
                                },
                                axisLine: {
                                    show: !0,
                                    lineStyle: {
                                        color: "#189cbb",
                                        type: "dashed"
                                    }
                                }
                            }],
                            series: [{
                                type: "radar",
                                tooltip: {
                                    trigger: "item"
                                },
                                data: d,
                                symbolSize: 2,
                                itemStyle: {
                                    normal: {
                                        borderColor: "#ffc72b",
                                        borderWidth: 2
                                    }
                                },
                                lineStyle: {
                                    normal: {
                                        color: "#fff",
                                        width: 2
                                    }
                                },
                                areaStyle: {
                                    normal: {
                                        shadowBlur: 13,
                                        shadowColor: "rgba(127,95,132,.3)",
                                        shadowOffsetX: 0,
                                        shadowOffsetY: 10,
                                        opacity: .6
                                    }
                                }
                            }]
                        }
                    }
                }]), t
            }();
            e.Chart = r
        },
        18: function(t, e, n) {
            "use strict";
            Object.defineProperty(e, "__esModule", {
                value: !0
            });
            var i = function() {
                    function t(t, e) {
                        for (var n = 0; n < e.length; n++) {
                            var i = e[n];
                            i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
                        }
                    }
                    return function(e, n, i) {
                        return n && t(e.prototype, n), i && t(e, i), e
                    }
                }(),
                r = function() {
                    function t(e, n) {
                        ! function(e, n) {
                            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                        }(this);
                        var i = n.id,
                            r = n.title;
                        this.box = e, this.w = +e.attr("echo-w"), this.h = +e.attr("echo-y"), this.id = i, this.title = r, this.type = +e.attr("echo-type"), this.init()
                    }
                    return i(t, [{
                        key: "init",
                        value: function() {
                            this.box.html(this.render())
                        }
                    }, {
                        key: "getPoint1",
                        value: function(t) {
                            var e = t.rotate,
                                n = t.position,
                                i = "top" === n || "bottom" === n ? 950 : 500,
                                r = 950 === i,
                                a = r ? 250 : 115,
                                o = ("bottom" === n ? 235 : "top" === n && 225) || 87.5,
                                s = r ? 0 : 25,
                                l = ("bottom" === n ? 12.5 : "top" === n && 30) || 12.5,
                                c = [];
                            c[0] = 25, c[5] = e * i - 25 - s, c[1] = o + 25 + (e - 1) * a, c[2] = c[1] + l, c[4] = e * i - c[1] - s, c[3] = c[4] - l;
                            var d = r ? 0 : 1,
                                h = 1 - d,
                                f = [],
                                u = "top" === n || "left" === n ? 0 : "bottom" === n && 500 * this.h - 25 || 950 * this.w;
                            f[h] = u;
                            var p = ("top" === n ? 50 : "left" === n && 25) || "bottom" === n && 500 * this.h || 950 * this.w - 25;
                            return c.map(function(t, e) {
                                return f[d] = t, f[h] = 3 == e || 2 == e ? p : u, f.join(" ")
                            })
                        }
                    }, {
                        key: "getPoint2",
                        value: function(t) {
                            var e = t.rotate,
                                n = t.position,
                                i = "top" === n || "bottom" === n ? 950 : 500,
                                r = [];
                            if ("top" === n) r[0] = 80, r[3] = i * e - 30, r[2] = r[3] - 150 - 100 * (e - 1), r[1] = r[2] - 60;
                            else {
                                var a = ("left" === n ? 80 : "right" === n && 100) || 50;
                                r[0] = a, r[1] = i * e - 50
                            }
                            var o = 950 === i ? 0 : 1,
                                s = 1 - o,
                                l = [],
                                c = "top" === n || "left" === n ? 0 : "bottom" === n && 500 * this.h || 950 * this.w;
                            return l[s] = c, r.map(function(t, e) {
                                return l[o] = t, 2 == e && (l[s] = 60), l.join(" ")
                            })
                        }
                    }, {
                        key: "getPath",
                        value: function() {
                            var t = this,
                                e = ["", "getPoint1", "getPoint2"][this.type];
                            return ["top", "right", "bottom", "left"].map(function(n, i) {
                                var r = i % 2 == 0,
                                    a = t[e]({
                                        position: n,
                                        rotate: r && t.w || t.h
                                    });
                                return 1 < i && a.reverse().join(" , ") || a.join(" , ")
                            })
                        }
                    }, {
                        key: "render",
                        value: function() {
                            return this[["", "renderBoder1", "renderBoder2", "renderBoder3"][this.type]]()
                        }
                    }, {
                        key: "renderBoder1",
                        value: function() {
                            var t = this.id;
                            return '\n\t\t\t\t\t<svg xmlns="http://www.w3.org/2000/svg"   xmlns:xlink="http://www.w3.org/1999/xlink" viewbox="0 0 ' + (950 * this.w + 20) + " " + (500 * this.h + 20) + '" preserveAspectRatio="none">\n\t\t\t\t\t\t\t<defs >\n\t\t\t\t\t\t\t   <desc>边框形状的多边形</desc>\n\n\t\t\t\t\t\t\t  \t<filter width="100%" height="100%" x="0" y="0" id="blur' + t + '" filterUnits="objectBoundingBox">\n\t\t\t\t\t\t\t\t  \t<feGaussianBlur stdDeviation="15" in="SourceGraphic" />\n\t\t\t\t\t\t\t\t</filter>\n\t\t\t\t\t    \t\t<filter x="0" y="0" width="100%" height="100%" filterUnits="objectBoundingBox" id="filter' + t + '">\n\t\t\t                        <feOffset dx="0" dy="-10" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>\n\t\t\t                        <feGaussianBlur stdDeviation="15" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>\n\t\t\t                        <feColorMatrix values="0 0 0 0 0.266666667   0 0 0 0 0.694117647   0 0 0 0 0.607843137  0 0 0 0.7 0" in="shadowBlurOuter1" type="matrix" result="shadowMatrixOuter1"></feColorMatrix>\n\t\t\t                        <feMerge>\n\t\t\t                            <feMergeNode in="shadowMatrixOuter1"></feMergeNode>\n\t\t\t                            <feMergeNode in="SourceGraphic"></feMergeNode>\n\t\t\t                        </feMerge>\n                    \t\t\t</filter>\t\t\n\t\t\t\t\t\t\t\t<desc>四个角的形状</desc>\n\n\t\t\t\t\t\t\t\t<g id="angle' + t + '" class="angle" >\n\t\t\t\t\t\t\t\t\t<path  d="M26.48 4.94L68.35 4.94L70.56 9.46L92.41 9.46L87.78 0.01L68.35 0.01L68.35 0.01L24.67 0.01L24.67 0.01L24.67 0.01L0 27.82L0 27.82L0 74.38L0 77.07L0 98.99L8.38 104.2L8.38 79.59L4.35 77.07L4.37 77.07L4.37 29.87L4.37 29.87L26.48 4.94Z"  />\n\t\t\t\t\t\t\t\t\t<path d="M25.21 27.87L25.21 8.18L7.75 27.87L7.75 27.87L25.21 27.87Z" id="a4eOZ2LBP"/>\n\t\t\t\t\t\t\t\t</g>\n\t\t\t\t\t\t\t\t<desc>小菱形</desc>\n\t\t\t\t\t\t\t\t<pattern id="pattern' + t + '" x="0" y="0" width="10" height="10"\n\t\t\t\t\t\t\t           patternUnits="userSpaceOnUse" >\n\t\t\t\t\t\t\t     \t<rect x="2.5" y="0" width="5" height="10" fill="#3B9CCB"/>\n\t\t\t\t\t\t\t    </pattern>\n\t\t\t\t\t\t\t    <g id="rhombic' + t + '" class="rhombic" fill="#3B9CCB">\n\t\t\t\t\t\t\t   \t\t<desc>大菱形左</desc>\n\t\t\t\t\t\t\t    \t<rect x="105" y="0" width="30" height="10"  />\n\t\t\t\t\t\t\t\t\t<rect x="140" y="0" width="' + (60 + 100 * (this.w - 1)) + '" height="10" fill="url(#pattern' + t + ')" />\n\t\t\t\t\t\t\t\t\t<desc>大菱形右</desc>\n\t\t\t\t\t\t\t\t\t<rect x="' + (205 + 100 * (this.w - 1)) + '" y="0" width="30" height="10" />\n\t\t\t\t\t\t\t    </g>\n\t\t\t\t\t\t\t\t\t<image xlink:href="./img/view_bg1.png" ></image>\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t</defs>\n\n\t\t\t\t\t\t\t<g transform="translate(10 10)" >\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<g style="opacity:0.3;" >\n\t\t\t\t\t\t\t\t\t<polygon id="shape"  fill="#d2ebf0" class="shade" stroke="" points="' + this.getPath().join(" , ") + '"  />\n\t\t\t\t\t\t\t\t</g>\n\n\t\t\t\t\t\t\t\t\t<polygon   fill="none" filter="url(#blur' + t + ')" stroke-width="4" stroke="#d2ebf0" points="' + this.getPath().join(" , ") + '"  />\n\n\t\t\t\t\t\t\t\t<g fill="#95d3df">\n\t\t\t\t\t\t\t\t\t<use xlink:href="#angle' + t + '"/>\n\t\t\t\t\t\t\t\t\t<use xlink:href="#angle' + t + '" transform="scale(-1,1) translate(-' + 950 * this.w + ')" ></use>\n\t\t\t\t\t\t\t\t\t<use xlink:href="#angle' + t + '" transform="scale(1,-1) translate(0 -' + (500 * this.h - 25) + ')"/>\n\t\t\t\t\t\t\t\t\t<use xlink:href="#angle' + t + '" transform="scale(-1,-1) translate(-' + 950 * this.w + " -" + (500 * this.h - 25) + ')"/>\n\t\t\t\t\t\t\t\t</g>\n\t\t\t\t\t\t\t\t<g \tfill="#95d3df" >\n\t\t\t\t\t\t\t\t   <use xlink:href="#rhombic' + t + '" transform="skewX(30)" />\n\t\t\t\t\t\t\t\t   <use xlink:href="#rhombic' + t + '" transform="translate(' + (950 * this.w - 210 - 130 - 100 * (this.w - 1)) + ' 0) skewX(-30)" />\n\t\t\t\t\t\t\t\t</g>\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<text x="' + 950 * this.w / 2 + '" y="30" fill="white" text-anchor="middle" font-size="2em" letter-spacing="0.2em" lengthAdjust="spacing" > ' + this.title + " </text>\n\t\t\t\t\t\t\t</g>\n\t\t\t\t\t</svg>\n\n\t\t\t\t"
                        }
                    }, {
                        key: "renderBoder2",
                        value: function() {
                            var t = this.id;
                            return '\n\t\t\t\t\t<svg xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" viewbox="0 0 ' + (950 * this.w + 20) + " " + (500 * this.h + 20) + '" preserveAspectRatio="none">\n\t\t\t\t\t\t\t<defs >\n\t\t\t\t\t\t\t\t\t<linearGradient id="line' + t + '" gradientUnits="objectBoundingBox">\n\t\t\t\t\t                  <stop offset="0" stop-color="#2c93d2"/>\n\t\t\t\t\t                  <stop offset="1" stop-color="#3fbccf"/>\n\t\t\t\t\t              \t</linearGradient>\n\t\t\t\t\t              \t<g id="border' + t + '">\n\t\t\t\t\t\t\t\t\t\t<polygon   points="' + this.getPath().join(" , ") + '"  \n\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t              \t</g>\n\t\t\t\t\t\t\t</defs>\n\n\t\t\t\t\t\t\t<g transform="translate(10 10)" stroke="url(#line' + t + ')" stroke-width="5" >\n\t\t\t\t\t\t\t\t\t<use xlink:href="#border' + t + '" fill="none"/>\n\t\t\t\t\t\t\t\t\t<defc>三角形</defc>\n\t\t\t\t\t\t\t\t\t<path  fill="none" d="M 0 0 L 50 0 L 0 50 Z"  />\n\t\t\t\t\t\t\t\t\t<defc>斜线</defc>\n\t\t\t\t\t\t\t\t\t<line x1="' + (935 + 950 * (this.w - 1)) + '" y1="' + (435 + 500 * (this.h - 1)) + '" x2="' + (885 + 950 * (this.w - 1)) + '" y2="' + (485 + 500 * (this.h - 1)) + '"  />\n\t\t\t\t\t\t\t\t\t<line x1="' + (740 + 850 * (this.w - 1)) + '" y1="0" x2="' + (785 + 850 * (this.w - 1)) + '" y2="45"  />\n\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t</g>\n\t\t\t\t\t\t\t<text x="' + (950 * this.w - 90 - 150 - 100 * (this.w - 1)) / 2 + '" y="50" fill="white" text-anchor="middle" font-size="2em" letter-spacing="0.2em" lengthAdjust="spacing" > ' + this.title + " </text>\n\n\t\t\t\t\t</svg>\n\n\t\t\t\t"
                        }
                    }, {
                        key: "renderBoder3",
                        value: function() {
                            var t = this.id;
                            return '\n\t\t\t\t\t<svg xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" viewbox="0 0 ' + (950 * this.w + 20) + " " + (500 * this.h + 20) + '" preserveAspectRatio="none">\n\t\t\t\t\t\t\t<defs >\n\t\t\t\t\t\t\t\t\t<linearGradient id="line' + t + '" gradientUnits="objectBoundingBox">\n\t\t\t\t\t                  <stop offset="0" stop-color="#2c93d2"/>\n\t\t\t\t\t                  <stop offset="1" stop-color="#3fbccf"/>\n\t\t\t\t\t              \t</linearGradient>\n\t\t\t\t\t              \t<filter width="100%" height="100%" x="0" y="0" id="blur' + t + '" filterUnits="objectBoundingBox">\n\t\t\t\t\t\t\t\t  \t\t<feGaussianBlur stdDeviation="5" in="SourceGraphic" />\n\t\t\t\t\t\t\t\t\t</filter>\n\t\t\t\t\t              \t<g id="border' + t + '" stroke-opacity="0.8">\n\t\t\t\t\t\t\t\t\t\t<rect x="0" y="0" rx="15" ry="15" width="' + 950 * this.w + '" height="' + 500 * this.h + '" />\n\t\t\t\t\t              \t</g>\n\t\t\t\t\t              \t<g id="title' + t + '" transform="translate(30 20)" stroke-width="2">\n\t\t\t\t\t\t\t\t\t\t<polygon  fill="none" points="0 0 ,800 0 ,800 30,770 60,0 60" />\n\t\t\t\t\t              \t</g>\n\t\t\t\t\t              \t<g id="radius' + t + '" stroke-width="6"  stroke="#3fbccf">\n\t\t\t\t\t\t\t\t\t\t<path d="M55 0 h-40 A15 15 0 0 0 0 15 v40"  fill="none" stroke-linecap="round" />\n\t\t\t\t\t              \t</g>\n\t\t\t\t\t\t\t</defs>\n\n\t\t\t\t\t\t\t<g transform="translate(10 10)" stroke="url(#line' + t + ')" stroke-width="3" fill="none">\n\t\t\t\t\t\t\t\t\t<use xlink:href="#border' + t + '" />\n\t\t\t\t\t\t\t\t\t<defc>标题</defc>\n\t\t\t\t\t\t\t\t\t<use xlink:href="#title' + t + '" />\n\t\t\t\t\t\t\t\t\t<use xlink:href="#radius' + t + '"  />\n\t\t\t\t\t\t\t\t\t<use xlink:href="#radius' + t + '"  transform="scale(-1 1) translate(' + 950 * -this.w + ' 0)"/>\n\t\t\t\t\t\t\t\t\t<use xlink:href="#radius' + t + '" transform="scale(1 -1) translate(0 ' + 500 * -this.h + ')" />\n\t\t\t\t\t\t\t\t\t<use xlink:href="#radius' + t + '" transform="scale(-1 -1) translate(' + 950 * -this.w + " " + 500 * -this.h + ')" />\n \t\t\t\t\t\t\t</g>\n \t\t\t\t\t\t\t<text x="60" y="70" fill="white"  font-size="2em" letter-spacing="0.2em" lengthAdjust="spacing" > ' + this.title + " </text>\n\t\t\t\t\t</svg>\n\n\t\t\t\t"
                        }
                    }]), t
                }();
            e.Border = r
        },
        19: function(t, e) {},
        47: function(t, e, n) {
            "use strict";
            var i = function() {
                function t(t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var i = e[n];
                        i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
                    }
                }
                return function(e, n, i) {
                    return n && t(e.prototype, n), i && t(e, i), e
                }
            }();
            n(19);
            var r = n(13),
                a = n(12);

            function o(t) {
                if (Array.isArray(t)) {
                    for (var e = 0, n = Array(t.length); e < t.length; e++) n[e] = t[e];
                    return n
                }
                return Array.from(t)
            }
            var s = $("#viewsContent"),
                l = $("#app"),
                c = $("#maxWindow"),
                d = window.jsp_config.baseUrl,
                h = new(function() {
                    function t() {
                        ! function(t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, t);
                        var e = window.parent;
                        this.layout_id = e.menuID, $("#viewName").html(e.menuName), this.items = [], this.init(), this.handle()
                    }
                    return i(t, [{
                        key: "init",
                        value: function() {
                            this.getPre(), this.renderModal()
                        }
                    }, {
                        key: "getPre",
                        value: function() {
                            !window.location.search.includes("pre") && $("#back").remove()
                        }
                    }, {
                        key: "createView",
                        value: function(t) {
                            var e = this,
                                n = t.id,
                                i = t.type,
                                o = t.item,
                                s = t.box,
                                l = {
                                    table: {
                                        getDataUrl: "getTableData",
                                        configName: "tabInfo"
                                    },
                                    chart: {
                                        getDataUrl: "getGraphData",
                                        configName: "graphInfo"
                                    }
                                };
                            r.api[l[i].getDataUrl](n).then(function(t) {
                                if (t.data && t.data.length) {
                                    var r = t[l[i].configName].chartName;
                                    e.items[o] = new a.View(s, {
                                        id: n,
                                        type: i,
                                        index: o,
                                        viewTitle: r
                                    }, t)
                                } else alert("没数据！")
                            })
                        }
                    }, {
                        key: "renderModal",
                        value: function() {
                            var t = this;
                            r.api.showLayoutModel(this.layout_id).then(function(e) {
                                if (e.model) {
                                    s.html(e.model);
                                    var n = $("#viewTemplate").css("backgroundImage");
                                    c.css("backgroundImage", n), $(".view-item").removeAttr("draggable");
                                    var i = $("#viewTemplate").find(".view-item.view-fill");
                                    $.map(i, function(e, n) {
                                        var i, r, a, o, s;
                                        i = n, a = (r = $(e)).attr("echo-type"), o = r.attr("echo-id"), s = ["line", "pie", "scatter", "bar", "rader"].includes(a) ? "chart" : a, t.createView({
                                            item: i,
                                            box: r,
                                            type: s,
                                            id: o
                                        })
                                    })
                                } else alert("kong")
                            })
                        }
                    }, {
                        key: "MaxView",
                        value: function(t) {
                            var e = t.borderType,
                                n = t.option,
                                i = t.index,
                                o = t.viewTitle,
                                s = t.viewType,
                                l = t.id,
                                d = '\n\t\t\t\t\t\t\t<div class="view-item" echo-id="max" style="width:100%;height:100%;">\n\t\t\t\t\t\t       ' + ("0" === e ? "" : ' <div class="bgSvg" echo-w="3" echo-y="3" echo-type="' + e + '"></div>') + '\n\t\t\t\t\t\t        <div class="view-content" >\n\t\t\t\t\t\t        \t<div class="view-optBox ' + ("2" == e ? "border3-opt" : "") + '" >\n\t\t\t\t\t\t        \t\t<div class="btn-handle">\n\t\t\t\t\t\t\t\t\t\t\t<span class="fa fa-bars" ></span>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t        \t\t<div class="view-btns" echo-id="' + l + '" echo-index="' + i + '">\n\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t<span class="fa fa-compress view-btn" sign="compress" title="最小化"></span>\n\t\t\t\t\t\t\t\t\t\t\t<span class="fa fa-file-excel-o view-btn" sign="excel" title="导出excel"></span>\n\t\t\t\t\t\t\t\t\t\t\t<span class="fa fa-file-image-o view-btn" sign="image" title="导出图片"></span>\n\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t        \t</div>\n\t\t\t\t\t\t            <div class="chart"></div>\n\t\t\t\t\t\t        </div>\n\t\t\t\t\t\t    </div>\n\t\t\t\t\t\t\t';
                            c.html(d);
                            var h = c.find(".chart");
                            "table" == s ? r.api.getTableData(l).then(function(t) {
                                new a.STable(h, {
                                    borderType: e
                                }, t)
                            }) : "chart" == s && echarts.init(h[0]).setOption(n), "0" !== e && new a.Border(c.find(".bgSvg"), {
                                id: "max",
                                title: o
                            })
                        }
                    }, {
                        key: "Toexcel",
                        value: function(t, e, n) {
                            var i = [],
                                a = n.WdArr,
                                s = n.viewTitle,
                                l = n.chartType,
                                c = [],
                                h = [];
                            if ("table" == e) r.api.getTableData(t).then(function(t) {
                                i = t.data, l.col_wd.map(function(t, e) {
                                    i[0][e] = a[+t]
                                }), r.api.getExeclld({
                                    data: i,
                                    fileName: s
                                }).then(function(t) {
                                    t && (window.location.href = d + "Expo/getExecl?id=" + t)
                                })
                            });
                            else if ("chart" == e) {
                                var f = t.xAxis,
                                    u = t.series,
                                    p = t.Dim,
                                    g = t.legend,
                                    w = t.radar;
                                switch (l) {
                                    case "4":
                                        (h = f[0].data.map(function(t) {
                                            return t.value
                                        })).unshift(a[+p.contrastDim] + "/" + a[+p.rowDim]), c = u.map(function(t) {
                                            var e = t.data.map(function(t) {
                                                return t || "--"
                                            });
                                            return [t.name].concat(o(e))
                                        }), i = [h].concat(o(c));
                                        break;
                                    case "5":
                                        c.push(" "), (h = g[0].data.map(function(t) {
                                            var e = t.value || "--";
                                            return c.push(e), t.name
                                        })).unshift(a[+p.rowDim]), i = [h, c];
                                        break;
                                    case "6":
                                        c = u[0].data.map(function(t) {
                                            var e = t.value.map(function(t) {
                                                return t || "--"
                                            });
                                            return [t.name].concat(o(e))
                                        }), (h = w[0].indicator.map(function(t) {
                                            return t.text
                                        })).unshift(a[+p.contrastDim] + "/" + a[+p.rowDim]), i = [h].concat(o(c))
                                }
                                r.api.getExeclld({
                                    data: i,
                                    fileName: s
                                }).then(function(t) {
                                    t && (window.location.href = d + "Expo/getExecl?id=" + t)
                                })
                            }
                        }
                    }, {
                        key: "Toimage",
                        value: function(t) {
                            var e = t.viewTitle,
                                n = !c.is(":hidden");
                            if (t.border) {
                                var i = n && c.find(".bgSvg") || t.border.box,
                                    r = n && c.find("canvas") || $(t.chart.Box).find("canvas"),
                                    a = i.html(),
                                    o = new Image,
                                    s = new Image,
                                    l = new Image;
                                o.src = "data:image/svg+xml;base64," + window.btoa(unescape(encodeURIComponent(a))), s.src = "./img/view_bg1.png", l.src = r[0].toDataURL("png");
                                var d = document.createElement("canvas");
                                d.width = i.width(), d.height = i.height();
                                var h = d.getContext("2d");
                                o.onload = function() {
                                    setTimeout(function() {
                                        h.drawImage(s, 0, 0), h.drawImage(o, 0, 0), h.drawImage(l, 0, .05 * i.height());
                                        var t = document.createElement("a");
                                        document.body.appendChild(t), t.href = d.toDataURL("image/png"), t.download = e + ".png", t.click(), $(t).remove()
                                    }, 1e3)
                                }
                            }
                        }
                    }, {
                        key: "handle",
                        value: function() {
                            $("#back").click(function() {
                                var t = $("#slide", window.parent.document),
                                    e = $("#content", window.parent.document),
                                    n = t.hasClass("collapsed") ? 45 : 250;
                                t.animate({
                                    width: n
                                }, 500, function() {
                                    window.history.back(), e.removeClass("no-head")
                                })
                            }), l.on("click", ".btn-handle", function() {
                                $(this).toggleClass("active")
                            }), l.on("click", ".view-btn", function() {
                                var t = $(this).attr("sign"),
                                    e = $(this).parent().attr("echo-index"),
                                    n = h.items[+e],
                                    i = n.viewType,
                                    r = n.viewTitle,
                                    a = n.borderType,
                                    o = n.id,
                                    s = null,
                                    l = null,
                                    d = null;
                                if ("table" === i) {
                                    var f = n.table,
                                        u = (f.container, f.title, f.data, f.config);
                                    s = n.id, l = u, d = ["", "时间", "科室", "指标", "维度值"]
                                } else if ("chart" === i) {
                                    var p = n.chart,
                                        g = p.Box,
                                        w = p.type,
                                        v = echarts.getInstanceByDom(g);
                                    l = w, s = v.getOption(), d = ["", "时间", "科室", "维度值", "指标"]
                                }
                                switch (t) {
                                    case "refresh":
                                        break;
                                    case "excel":
                                        h.Toexcel(s, i, {
                                            WdArr: d,
                                            chartType: l,
                                            viewTitle: r
                                        });
                                        break;
                                    case "expand":
                                        $("#slide", window.parent.document).animate({
                                            width: 0
                                        }, 500, function() {
                                            c.show(), h.MaxView({
                                                option: s,
                                                borderType: a,
                                                index: e,
                                                viewTitle: r,
                                                viewType: i,
                                                id: o
                                            })
                                        });
                                        break;
                                    case "compress":
                                        var b = $("#slide", window.parent.document),
                                            m = b.hasClass("collapsed") ? 45 : 250;
                                        b.animate({
                                            width: m
                                        }, 500, function() {
                                            c.html(""), c.hide()
                                        });
                                        break;
                                    case "image":
                                        h.Toimage(n)
                                }
                            })
                        }
                    }]), t
                }())
        }
    },
    [
        [47, 0]
    ]
]);
//# sourceMappingURL=ManageViews.chunk.js.map