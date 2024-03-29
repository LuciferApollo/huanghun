/*
 @vimeo/player v2.0.2 | (c) 2017 Vimeo | MIT License | https://github.com/vimeo/player.js */
var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.arrayIteratorImpl = function(a) {
    var b = 0;
    return function() {
        return b < a.length ? {
            done: !1,
            value: a[b++]
        } : {
            done: !0
        }
    }
}
;
$jscomp.arrayIterator = function(a) {
    return {
        next: $jscomp.arrayIteratorImpl(a)
    }
}
;
$jscomp.makeIterator = function(a) {
    var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
    return b ? b.call(a) : $jscomp.arrayIterator(a)
}
;
$jscomp.getGlobal = function(a) {
    return "undefined" != typeof window && window === a ? a : "undefined" != typeof global && null != global ? global : a
}
;
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, g) {
    a != Array.prototype && a != Object.prototype && (a[b] = g.value)
}
;
$jscomp.polyfill = function(a, b, g, h) {
    if (b) {
        g = $jscomp.global;
        a = a.split(".");
        for (h = 0; h < a.length - 1; h++) {
            var f = a[h];
            f in g || (g[f] = {});
            g = g[f]
        }
        a = a[a.length - 1];
        h = g[a];
        b = b(h);
        b != h && null != b && $jscomp.defineProperty(g, a, {
            configurable: !0,
            writable: !0,
            value: b
        })
    }
}
;
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.polyfill("Promise", function(a) {
    function b() {
        this.batch_ = null
    }
    function g(d) {
        return d instanceof f ? d : new f(function(a, b) {
            a(d)
        }
        )
    }
    if (a && !$jscomp.FORCE_POLYFILL_PROMISE)
        return a;
    b.prototype.asyncExecute = function(a) {
        if (null == this.batch_) {
            this.batch_ = [];
            var d = this;
            this.asyncExecuteFunction(function() {
                d.executeBatch_()
            })
        }
        this.batch_.push(a)
    }
    ;
    var h = $jscomp.global.setTimeout;
    b.prototype.asyncExecuteFunction = function(a) {
        h(a, 0)
    }
    ;
    b.prototype.executeBatch_ = function() {
        for (; this.batch_ && this.batch_.length; ) {
            var a = this.batch_;
            this.batch_ = [];
            for (var b = 0; b < a.length; ++b) {
                var f = a[b];
                a[b] = null;
                try {
                    f()
                } catch (k) {
                    this.asyncThrow_(k)
                }
            }
        }
        this.batch_ = null
    }
    ;
    b.prototype.asyncThrow_ = function(a) {
        this.asyncExecuteFunction(function() {
            throw a;
        })
    }
    ;
    var f = function(a) {
        this.state_ = 0;
        this.result_ = void 0;
        this.onSettledCallbacks_ = [];
        var d = this.createResolveAndReject_();
        try {
            a(d.resolve, d.reject)
        } catch (l) {
            d.reject(l)
        }
    };
    f.prototype.createResolveAndReject_ = function() {
        function a(a) {
            return function(d) {
                f || (f = !0,
                a.call(b, d))
            }
        }
        var b = this
          , f = !1;
        return {
            resolve: a(this.resolveTo_),
            reject: a(this.reject_)
        }
    }
    ;
    f.prototype.resolveTo_ = function(a) {
        if (a === this)
            this.reject_(new TypeError("A Promise cannot resolve to itself"));
        else if (a instanceof f)
            this.settleSameAsPromise_(a);
        else {
            a: switch (typeof a) {
            case "object":
                var d = null != a;
                break a;
            case "function":
                d = !0;
                break a;
            default:
                d = !1
            }
            d ? this.resolveToNonPromiseObj_(a) : this.fulfill_(a)
        }
    }
    ;
    f.prototype.resolveToNonPromiseObj_ = function(a) {
        var d = void 0;
        try {
            d = a.then
        } catch (l) {
            this.reject_(l);
            return
        }
        "function" == typeof d ? this.settleSameAsThenable_(d, a) : this.fulfill_(a)
    }
    ;
    f.prototype.reject_ = function(a) {
        this.settle_(2, a)
    }
    ;
    f.prototype.fulfill_ = function(a) {
        this.settle_(1, a)
    }
    ;
    f.prototype.settle_ = function(a, b) {
        if (0 != this.state_)
            throw Error("Cannot settle(" + a + ", " + b + "): Promise already settled in state" + this.state_);
        this.state_ = a;
        this.result_ = b;
        this.executeOnSettledCallbacks_()
    }
    ;
    f.prototype.executeOnSettledCallbacks_ = function() {
        if (null != this.onSettledCallbacks_) {
            for (var a = 0; a < this.onSettledCallbacks_.length; ++a)
                n.asyncExecute(this.onSettledCallbacks_[a]);
            this.onSettledCallbacks_ = null
        }
    }
    ;
    var n = new b;
    f.prototype.settleSameAsPromise_ = function(a) {
        var b = this.createResolveAndReject_();
        a.callWhenSettled_(b.resolve, b.reject)
    }
    ;
    f.prototype.settleSameAsThenable_ = function(a, b) {
        var d = this.createResolveAndReject_();
        try {
            a.call(b, d.resolve, d.reject)
        } catch (k) {
            d.reject(k)
        }
    }
    ;
    f.prototype.then = function(a, b) {
        function d(a, b) {
            return "function" == typeof a ? function(b) {
                try {
                    k(a(b))
                } catch (z) {
                    g(z)
                }
            }
            : b
        }
        var k, g, h = new f(function(a, b) {
            k = a;
            g = b
        }
        );
        this.callWhenSettled_(d(a, k), d(b, g));
        return h
    }
    ;
    f.prototype.catch = function(a) {
        return this.then(void 0, a)
    }
    ;
    f.prototype.callWhenSettled_ = function(a, b) {
        function d() {
            switch (k.state_) {
            case 1:
                a(k.result_);
                break;
            case 2:
                b(k.result_);
                break;
            default:
                throw Error("Unexpected state: " + k.state_);
            }
        }
        var k = this;
        null == this.onSettledCallbacks_ ? n.asyncExecute(d) : this.onSettledCallbacks_.push(d)
    }
    ;
    f.resolve = g;
    f.reject = function(a) {
        return new f(function(b, d) {
            d(a)
        }
        )
    }
    ;
    f.race = function(a) {
        return new f(function(b, d) {
            for (var k = $jscomp.makeIterator(a), f = k.next(); !f.done; f = k.next())
                g(f.value).callWhenSettled_(b, d)
        }
        )
    }
    ;
    f.all = function(a) {
        var b = $jscomp.makeIterator(a)
          , d = b.next();
        return d.done ? g([]) : new f(function(a, f) {
            function k(b) {
                return function(k) {
                    h[b] = k;
                    r--;
                    0 == r && a(h)
                }
            }
            var h = []
              , r = 0;
            do
                h.push(void 0),
                r++,
                g(d.value).callWhenSettled_(k(h.length - 1), f),
                d = b.next();
            while (!d.done)
        }
        )
    }
    ;
    return f
}, "es6", "es3");
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function() {
    $jscomp.initSymbol = function() {}
    ;
    $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol)
}
;
$jscomp.SymbolClass = function(a, b) {
    this.$jscomp$symbol$id_ = a;
    $jscomp.defineProperty(this, "description", {
        configurable: !0,
        writable: !0,
        value: b
    })
}
;
$jscomp.SymbolClass.prototype.toString = function() {
    return this.$jscomp$symbol$id_
}
;
$jscomp.Symbol = function() {
    function a(g) {
        if (this instanceof a)
            throw new TypeError("Symbol is not a constructor");
        return new $jscomp.SymbolClass($jscomp.SYMBOL_PREFIX + (g || "") + "_" + b++,g)
    }
    var b = 0;
    return a
}();
$jscomp.initSymbolIterator = function() {
    $jscomp.initSymbol();
    var a = $jscomp.global.Symbol.iterator;
    a || (a = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("Symbol.iterator"));
    "function" != typeof Array.prototype[a] && $jscomp.defineProperty(Array.prototype, a, {
        configurable: !0,
        writable: !0,
        value: function() {
            return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this))
        }
    });
    $jscomp.initSymbolIterator = function() {}
}
;
$jscomp.initSymbolAsyncIterator = function() {
    $jscomp.initSymbol();
    var a = $jscomp.global.Symbol.asyncIterator;
    a || (a = $jscomp.global.Symbol.asyncIterator = $jscomp.global.Symbol("Symbol.asyncIterator"));
    $jscomp.initSymbolAsyncIterator = function() {}
}
;
$jscomp.iteratorPrototype = function(a) {
    $jscomp.initSymbolIterator();
    a = {
        next: a
    };
    a[$jscomp.global.Symbol.iterator] = function() {
        return this
    }
    ;
    return a
}
;
$jscomp.iteratorFromArray = function(a, b) {
    $jscomp.initSymbolIterator();
    a instanceof String && (a += "");
    var g = 0
      , h = {
        next: function() {
            if (g < a.length) {
                var f = g++;
                return {
                    value: b(f, a[f]),
                    done: !1
                }
            }
            h.next = function() {
                return {
                    done: !0,
                    value: void 0
                }
            }
            ;
            return h.next()
        }
    };
    h[Symbol.iterator] = function() {
        return h
    }
    ;
    return h
}
;
$jscomp.polyfill("Array.prototype.entries", function(a) {
    return a ? a : function() {
        return $jscomp.iteratorFromArray(this, function(a, g) {
            return [a, g]
        })
    }
}, "es6", "es3");
$jscomp.checkEs6ConformanceViaProxy = function() {
    try {
        var a = {}
          , b = Object.create(new $jscomp.global.Proxy(a,{
            get: function(g, h, f) {
                return g == a && "q" == h && f == b
            }
        }));
        return !0 === b.q
    } catch (g) {
        return !1
    }
}
;
$jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS = !1;
$jscomp.ES6_CONFORMANCE = $jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS && $jscomp.checkEs6ConformanceViaProxy();
$jscomp.owns = function(a, b) {
    return Object.prototype.hasOwnProperty.call(a, b)
}
;
$jscomp.polyfill("WeakMap", function(a) {
    function b() {
        if (!a || !Object.seal)
            return !1;
        try {
            var b = Object.seal({})
              , d = Object.seal({})
              , f = new a([[b, 2], [d, 3]]);
            if (2 != f.get(b) || 3 != f.get(d))
                return !1;
            f.delete(b);
            f.set(d, 4);
            return !f.has(b) && 4 == f.get(d)
        } catch (y) {
            return !1
        }
    }
    function g() {}
    function h(a) {
        var b = typeof a;
        return "object" === b && null !== a || "function" === b
    }
    function f(a) {
        if (!$jscomp.owns(a, d)) {
            var b = new g;
            $jscomp.defineProperty(a, d, {
                value: b
            })
        }
    }
    function n(a) {
        var b = Object[a];
        b && (Object[a] = function(a) {
            if (a instanceof g)
                return a;
            f(a);
            return b(a)
        }
        )
    }
    if ($jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
        if (a && $jscomp.ES6_CONFORMANCE)
            return a
    } else if (b())
        return a;
    var d = "$jscomp_hidden_" + Math.random();
    n("freeze");
    n("preventExtensions");
    n("seal");
    var B = 0
      , l = function(a) {
        this.id_ = (B += Math.random() + 1).toString();
        if (a) {
            a = $jscomp.makeIterator(a);
            for (var b; !(b = a.next()).done; )
                b = b.value,
                this.set(b[0], b[1])
        }
    };
    l.prototype.set = function(a, b) {
        if (!h(a))
            throw Error("Invalid WeakMap key");
        f(a);
        if (!$jscomp.owns(a, d))
            throw Error("WeakMap key fail: " + a);
        a[d][this.id_] = b;
        return this
    }
    ;
    l.prototype.get = function(a) {
        return h(a) && $jscomp.owns(a, d) ? a[d][this.id_] : void 0
    }
    ;
    l.prototype.has = function(a) {
        return h(a) && $jscomp.owns(a, d) && $jscomp.owns(a[d], this.id_)
    }
    ;
    l.prototype.delete = function(a) {
        return h(a) && $jscomp.owns(a, d) && $jscomp.owns(a[d], this.id_) ? delete a[d][this.id_] : !1
    }
    ;
    return l
}, "es6", "es3");
!function(a, b) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = b() : "function" == typeof define && define.amd ? define(b) : (a.Vimeo = a.Vimeo || {},
    a.Vimeo.Player = b())
}(this, function() {
    function a(a, c) {
        return c = {
            exports: {}
        },
        a(c, c.exports),
        c.exports
    }
    function b(a, c, b) {
        var e = p.get(a.element) || {};
        c in e || (e[c] = []);
        e[c].push(b);
        p.set(a.element, e)
    }
    function g(a, c) {
        return (p.get(a.element) || {})[c] || []
    }
    function h(a, c, b) {
        var e = p.get(a.element) || {};
        if (!e[c])
            return !0;
        if (!b)
            return e[c] = [],
            p.set(a.element, e),
            !0;
        b = e[c].indexOf(b);
        return -1 !== b && e[c].splice(b, 1),
        p.set(a.element, e),
        e[c] && 0 === e[c].length
    }
    function f(a, c) {
        var b = g(a, c);
        if (1 > b.length)
            return !1;
        b = b.shift();
        return h(a, c, b),
        b
    }
    function n(a, c) {
        return 0 === a.indexOf(c.toLowerCase()) ? a : "" + c.toLowerCase() + a.substr(0, 1).toUpperCase() + a.substr(1)
    }
    function d(a) {
        return /^(https?:)?\/\/((player|www).)?vimeo.com(?=$|\/)/.test(a)
    }
    function B() {
        var a = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {}
          , c = a.id;
        a = a.url;
        a = c || a;
        if (!a)
            throw Error("An id or url must be passed, either in an options object or as a data-vimeo-id or data-vimeo-url attribute.");
        if (!isNaN(parseFloat(a)) && isFinite(a) && Math.floor(a) == a)
            return "https://vimeo.com/" + a;
        if (d(a))
            return a.replace("http:", "https:");
        if (c)
            throw new TypeError("\u201c" + c + "\u201d is not a valid video id.");
        throw new TypeError("\u201c" + a + "\u201d is not a vimeo.com url.");
    }
    function l(a) {
        return K.reduce(function(c, b) {
            var e = a.getAttribute("data-vimeo-" + b);
            return (e || "" === e) && (c[b] = "" === e ? 1 : e),
            c
        }, 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {})
    }
    function k(a) {
        var c = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {};
        return new Promise(function(b, f) {
            if (!d(a))
                throw new TypeError("\u201c" + a + "\u201d is not a vimeo.com url.");
            var e = "https://vimeo.com/api/oembed.json?url=" + encodeURIComponent(a), g;
            for (g in c)
                c.hasOwnProperty(g) && (e += "&" + g + "=" + encodeURIComponent(c[g]));
            var u = "XDomainRequest"in window ? new XDomainRequest : new XMLHttpRequest;
            u.open("GET", e, !0);
            u.onload = function() {
                if (404 === u.status)
                    return void f(Error("\u201c" + a + "\u201d was not found."));
                if (403 === u.status)
                    return void f(Error("\u201c" + a + "\u201d is not embeddable."));
                try {
                    var c = JSON.parse(u.responseText);
                    b(c)
                } catch (L) {
                    f(L)
                }
            }
            ;
            u.onerror = function() {
                f(Error("There was an error fetching the embed code from Vimeo" + (u.status ? " (" + u.status + ")" : "") + "."))
            }
            ;
            u.send()
        }
        )
    }
    function r(a, c) {
        a = a.html;
        if (!c)
            throw new TypeError("An element must be provided");
        if (null !== c.getAttribute("data-vimeo-initialized"))
            return c.querySelector("iframe");
        var b = document.createElement("div");
        return b.innerHTML = a,
        c.appendChild(b.firstChild),
        c.setAttribute("data-vimeo-initialized", "true"),
        c.querySelector("iframe")
    }
    function H(a) {
        return "string" == typeof a && (a = JSON.parse(a)),
        a
    }
    function y(a, c, b) {
        a.element.contentWindow && a.element.contentWindow.postMessage && (c = {
            method: c
        },
        void 0 !== b && (c.value = b),
        b = parseFloat(navigator.userAgent.toLowerCase().replace(/^.*msie (\d+).*$/, "$1")),
        8 <= b && 10 > b && (c = JSON.stringify(c)),
        a.element.contentWindow.postMessage(c, a.origin))
    }
    function J(a, c) {
        c = H(c);
        var b = []
          , d = void 0;
        if (c.event)
            "error" === c.event && g(a, c.data.method).forEach(function(b) {
                var e = Error(c.data.message);
                e.name = c.data.name;
                b.reject(e);
                h(a, c.data.method, b)
            }),
            b = g(a, "event:" + c.event),
            d = c.data;
        else if (c.method) {
            var C = f(a, c.method);
            C && (b.push(C),
            d = c.value)
        }
        b.forEach(function(c) {
            try {
                if ("function" == typeof c)
                    return void c.call(a, d);
                c.resolve(d)
            } catch (O) {}
        })
    }
    var E = "undefined" != typeof window.postMessage;
    if ("undefined" == typeof Array.prototype.indexOf || !E)
        throw Error("Sorry, the Vimeo Player API is not available in this browser.");
    var z = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}
      , v = (a(function(a, c) {
        !function(a) {
            function c(a, c) {
                function e(a) {
                    return this && this.constructor === e ? (this._keys = [],
                    this._values = [],
                    this._itp = [],
                    this.objectOnly = c,
                    void (a && b.call(this, a))) : new e(a)
                }
                return c || F(a, "size", {
                    get: x
                }),
                a.constructor = e,
                e.prototype = a,
                e
            }
            function b(a) {
                this.add ? a.forEach(this.add, this) : a.forEach(function(a) {
                    this.set(a[0], a[1])
                }, this)
            }
            function e(a) {
                return this.has(a) && (this._keys.splice(q, 1),
                this._values.splice(q, 1),
                this._itp.forEach(function(a) {
                    q < a[0] && a[0]--
                })),
                -1 < q
            }
            function d(a) {
                return this.has(a) ? this._values[q] : void 0
            }
            function f(a, c) {
                if (this.objectOnly && c !== Object(c))
                    throw new TypeError("Invalid value used as weak collection key");
                if (c != c || 0 === c)
                    for (q = a.length; q-- && !G(a[q], c); )
                        ;
                else
                    q = a.indexOf(c);
                return -1 < q
            }
            function g(a) {
                return f.call(this, this._values, a)
            }
            function h(a) {
                return f.call(this, this._keys, a)
            }
            function k(a, c) {
                return this.has(a) ? this._values[q] = c : this._values[this._keys.push(a) - 1] = c,
                this
            }
            function l(a) {
                return this.has(a) || this._values.push(a),
                this
            }
            function w() {
                (this._keys || 0).length = this._values.length = 0
            }
            function n() {
                return A(this._itp, this._keys)
            }
            function t() {
                return A(this._itp, this._values)
            }
            function p() {
                return A(this._itp, this._keys, this._values)
            }
            function r() {
                return A(this._itp, this._values, this._values)
            }
            function A(a, c, b) {
                var e = [0]
                  , d = !1;
                return a.push(e),
                {
                    next: function() {
                        var f, x = e[0];
                        return !d && x < c.length ? (f = b ? [c[x], b[x]] : c[x],
                        e[0]++) : (d = !0,
                        a.splice(a.indexOf(e), 1)),
                        {
                            done: d,
                            value: f
                        }
                    }
                }
            }
            function x() {
                return this._values.length
            }
            function m(a, c) {
                for (var b = this.entries(); ; ) {
                    var e = b.next();
                    if (e.done)
                        break;
                    a.call(c, e.value[1], e.value[0], this)
                }
            }
            var q, F = Object.defineProperty, G = function(a, c) {
                return a === c || a !== a && c !== c
            };
            "undefined" == typeof WeakMap && (a.WeakMap = c({
                delete: e,
                clear: w,
                get: d,
                has: h,
                set: k
            }, !0));
            "undefined" != typeof Map && "function" == typeof (new Map).values && (new Map).values().next || (a.Map = c({
                delete: e,
                has: h,
                get: d,
                set: k,
                keys: n,
                values: t,
                entries: p,
                forEach: m,
                clear: w
            }));
            "undefined" != typeof Set && "function" == typeof (new Set).values && (new Set).values().next || (a.Set = c({
                has: g,
                add: l,
                delete: e,
                clear: w,
                keys: t,
                values: t,
                entries: r,
                forEach: m
            }));
            "undefined" == typeof WeakSet && (a.WeakSet = c({
                delete: e,
                add: l,
                clear: w,
                has: g
            }, !0))
        }("undefined" != typeof z ? z : window)
    }),
    a(function(a) {
        var c = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(a) {
            return typeof a
        }
        : function(a) {
            return a && "function" == typeof Symbol && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a
        }
        ;
        !function(c, b, d) {
            b[c] = b[c] || d();
            a.exports && (a.exports = b[c])
        }("Promise", z, function() {
            function a(a, c) {
                r.add(a, c);
                w || (w = p(r.drain))
            }
            function b(a) {
                var b, e = "undefined" == typeof a ? "undefined" : c(a);
                return null == a || "object" != e && "function" != e || (b = a.then),
                "function" == typeof b && b
            }
            function d() {
                for (var a = 0; a < this.chain.length; a++) {
                    var c = void 0
                      , e = void 0
                      , d = 1 === this.state ? this.chain[a].success : this.chain[a].failure
                      , f = this.chain[a];
                    try {
                        !1 === d ? f.reject(this.msg) : (e = !0 === d ? this.msg : d.call(void 0, this.msg),
                        e === f.promise ? f.reject(TypeError("Promise-chain cycle")) : (c = b(e)) ? c.call(e, f.resolve, f.reject) : f.resolve(e))
                    } catch (G) {
                        f.reject(G)
                    }
                }
                this.chain.length = 0
            }
            function f(c) {
                var e, m = this;
                if (!m.triggered) {
                    m.triggered = !0;
                    m.def && (m = m.def);
                    try {
                        (e = b(c)) ? a(function() {
                            var a = new k(m);
                            try {
                                e.call(c, function() {
                                    f.apply(a, arguments)
                                }, function() {
                                    g.apply(a, arguments)
                                })
                            } catch (F) {
                                g.call(a, F)
                            }
                        }) : (m.msg = c,
                        m.state = 1,
                        0 < m.chain.length && a(d, m))
                    } catch (q) {
                        g.call(new k(m), q)
                    }
                }
            }
            function g(c) {
                var b = this;
                b.triggered || (b.triggered = !0,
                b.def && (b = b.def),
                b.msg = c,
                b.state = 2,
                0 < b.chain.length && a(d, b))
            }
            function h(a, c, b, e) {
                for (var d = 0; d < c.length; d++)
                    !function(d) {
                        a.resolve(c[d]).then(function(a) {
                            b(d, a)
                        }, e)
                    }(d)
            }
            function k(a) {
                this.def = a;
                this.triggered = !1
            }
            function M(a) {
                this.promise = a;
                this.state = 0;
                this.triggered = !1;
                this.chain = [];
                this.msg = void 0
            }
            function l(c) {
                if ("function" != typeof c)
                    throw TypeError("Not a function");
                if (0 !== this.__NPO__)
                    throw TypeError("Not a promise");
                this.__NPO__ = 1;
                var b = new M(this);
                this.then = function(c, e) {
                    var f = {
                        success: "function" != typeof c || c,
                        failure: "function" == typeof e && e
                    };
                    return f.promise = new this.constructor(function(a, c) {
                        if ("function" != typeof a || "function" != typeof c)
                            throw TypeError("Not a function");
                        f.resolve = a;
                        f.reject = c
                    }
                    ),
                    b.chain.push(f),
                    0 !== b.state && a(d, b),
                    f.promise
                }
                ;
                this.catch = function(a) {
                    return this.then(void 0, a)
                }
                ;
                try {
                    c.call(void 0, function(a) {
                        f.call(b, a)
                    }, function(a) {
                        g.call(b, a)
                    })
                } catch (m) {
                    g.call(b, m)
                }
            }
            var w, n = Object.prototype.toString, p = "undefined" != typeof setImmediate ? function(a) {
                return setImmediate(a)
            }
            : setTimeout;
            try {
                Object.defineProperty({}, "x", {});
                var t = function(a, c, b, e) {
                    return Object.defineProperty(a, c, {
                        value: b,
                        writable: !0,
                        configurable: !1 !== e
                    })
                }
            } catch (A) {
                t = function(a, c, b) {
                    return a[c] = b,
                    a
                }
            }
            var r = function() {
                function a(a, c) {
                    this.fn = a;
                    this.self = c;
                    this.next = void 0
                }
                var c, b, e;
                return {
                    add: function(d, f) {
                        e = new a(d,f);
                        b ? b.next = e : c = e;
                        b = e;
                        e = void 0
                    },
                    drain: function() {
                        var a = c;
                        for (c = b = w = void 0; a; )
                            a.fn.call(a.self),
                            a = a.next
                    }
                }
            }();
            var v = t({}, "constructor", l, !1);
            return l.prototype = v,
            t(v, "__NPO__", 0, !1),
            t(l, "resolve", function(a) {
                return a && "object" == ("undefined" == typeof a ? "undefined" : c(a)) && 1 === a.__NPO__ ? a : new this(function(c, b) {
                    if ("function" != typeof c || "function" != typeof b)
                        throw TypeError("Not a function");
                    c(a)
                }
                )
            }),
            t(l, "reject", function(a) {
                return new this(function(c, b) {
                    if ("function" != typeof c || "function" != typeof b)
                        throw TypeError("Not a function");
                    b(a)
                }
                )
            }),
            t(l, "all", function(a) {
                var c = this;
                return "[object Array]" != n.call(a) ? c.reject(TypeError("Not an array")) : 0 === a.length ? c.resolve([]) : new c(function(b, e) {
                    if ("function" != typeof b || "function" != typeof e)
                        throw TypeError("Not a function");
                    var d = a.length
                      , f = Array(d)
                      , g = 0;
                    h(c, a, function(a, c) {
                        f[a] = c;
                        ++g === d && b(f)
                    }, e)
                }
                )
            }),
            t(l, "race", function(a) {
                var c = this;
                return "[object Array]" != n.call(a) ? c.reject(TypeError("Not an array")) : new c(function(b, e) {
                    if ("function" != typeof b || "function" != typeof e)
                        throw TypeError("Not a function");
                    h(c, a, function(a, c) {
                        b(c)
                    }, e)
                }
                )
            }),
            l
        })
    }))
      , p = new WeakMap
      , K = "id url width maxwidth height maxheight portrait title byline color autoplay autopause loop responsive".split(" ")
      , N = function() {
        function a(a, b) {
            for (var c = 0; c < b.length; c++) {
                var e = b[c];
                e.enumerable = e.enumerable || !1;
                e.configurable = !0;
                "value"in e && (e.writable = !0);
                Object.defineProperty(a, e.key, e)
            }
        }
        return function(c, b, d) {
            return b && a(c.prototype, b),
            d && a(c, d),
            c
        }
    }()
      , D = new WeakMap
      , I = new WeakMap;
    E = function() {
        function a(c) {
            var b = this
              , f = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {};
            if (!(this instanceof a))
                throw new TypeError("Cannot call a class as a function");
            if (window.jQuery && c instanceof jQuery && (1 < c.length && window.console && console.warn && console.warn("A jQuery object with multiple elements was passed, using the first element."),
            c = c[0]),
            "string" == typeof c && (c = document.getElementById(c)),
            !(c instanceof window.HTMLElement))
                throw new TypeError("You must pass either a valid element or a valid id.");
            if ("IFRAME" !== c.nodeName) {
                var g = c.querySelector("iframe");
                g && (c = g)
            }
            if ("IFRAME" === c.nodeName && !d(c.getAttribute("src") || ""))
                throw Error("The player element passed isn\u2019t a Vimeo embed.");
            if (D.has(c))
                return D.get(c);
            this.element = c;
            this.origin = "*";
            g = new v(function(a, e) {
                var g = function(c) {
                    if (d(c.origin) && b.element.contentWindow === c.source) {
                        "*" === b.origin && (b.origin = c.origin);
                        c = H(c.data);
                        var e = "method"in c && "ping" === c.method;
                        return "event"in c && "ready" === c.event || e ? (b.element.setAttribute("data-ready", "true"),
                        void a()) : void J(b, c)
                    }
                };
                if (window.addEventListener ? window.addEventListener("message", g, !1) : window.attachEvent && window.attachEvent("onmessage", g),
                "IFRAME" !== b.element.nodeName) {
                    g = l(c, f);
                    var h = B(g);
                    k(h, g).then(function(a) {
                        var e = r(a, c);
                        b.element = e;
                        var d = c
                          , f = p.get(d);
                        p.set(e, f);
                        p.delete(d);
                        return D.set(b.element, b),
                        a
                    }).catch(function(a) {
                        return e(a)
                    })
                }
            }
            );
            return I.set(this, g),
            D.set(this.element, this),
            "IFRAME" === this.element.nodeName && y(this, "ping"),
            this
        }
        return N(a, [{
            key: "callMethod",
            value: function(a) {
                var c = this
                  , d = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {};
                return new v(function(e, f) {
                    return c.ready().then(function() {
                        b(c, a, {
                            resolve: e,
                            reject: f
                        });
                        y(c, a, d)
                    })
                }
                )
            }
        }, {
            key: "get",
            value: function(a) {
                var c = this;
                return new v(function(e, d) {
                    return a = n(a, "get"),
                    c.ready().then(function() {
                        b(c, a, {
                            resolve: e,
                            reject: d
                        });
                        y(c, a)
                    })
                }
                )
            }
        }, {
            key: "set",
            value: function(a, e) {
                var c = this;
                return v.resolve(e).then(function(e) {
                    if (a = n(a, "set"),
                    void 0 === e || null === e)
                        throw new TypeError("There must be a value to set.");
                    return c.ready().then(function() {
                        return new v(function(d, f) {
                            b(c, a, {
                                resolve: d,
                                reject: f
                            });
                            y(c, a, e)
                        }
                        )
                    })
                })
            }
        }, {
            key: "on",
            value: function(a, e) {
                if (!a)
                    throw new TypeError("You must pass an event name.");
                if (!e)
                    throw new TypeError("You must pass a callback function.");
                if ("function" != typeof e)
                    throw new TypeError("The callback must be a function.");
                0 === g(this, "event:" + a).length && this.callMethod("addEventListener", a).catch(function() {});
                b(this, "event:" + a, e)
            }
        }, {
            key: "off",
            value: function(a, b) {
                if (!a)
                    throw new TypeError("You must pass an event name.");
                if (b && "function" != typeof b)
                    throw new TypeError("The callback must be a function.");
                h(this, "event:" + a, b) && this.callMethod("removeEventListener", a).catch(function(a) {})
            }
        }, {
            key: "loadVideo",
            value: function(a) {
                return this.callMethod("loadVideo", a)
            }
        }, {
            key: "ready",
            value: function() {
                var a = I.get(this);
                return v.resolve(a)
            }
        }, {
            key: "addCuePoint",
            value: function(a) {
                return this.callMethod("addCuePoint", {
                    time: a,
                    data: 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {}
                })
            }
        }, {
            key: "removeCuePoint",
            value: function(a) {
                return this.callMethod("removeCuePoint", a)
            }
        }, {
            key: "enableTextTrack",
            value: function(a, b) {
                if (!a)
                    throw new TypeError("You must pass a language.");
                return this.callMethod("enableTextTrack", {
                    language: a,
                    kind: b
                })
            }
        }, {
            key: "disableTextTrack",
            value: function() {
                return this.callMethod("disableTextTrack")
            }
        }, {
            key: "pause",
            value: function() {
                return this.callMethod("pause")
            }
        }, {
            key: "play",
            value: function() {
                return this.callMethod("play")
            }
        }, {
            key: "unload",
            value: function() {
                return this.callMethod("unload")
            }
        }, {
            key: "getAutopause",
            value: function() {
                return this.get("autopause")
            }
        }, {
            key: "setAutopause",
            value: function(a) {
                return this.set("autopause", a)
            }
        }, {
            key: "getColor",
            value: function() {
                return this.get("color")
            }
        }, {
            key: "setColor",
            value: function(a) {
                return this.set("color", a)
            }
        }, {
            key: "getCuePoints",
            value: function() {
                return this.get("cuePoints")
            }
        }, {
            key: "getCurrentTime",
            value: function() {
                return this.get("currentTime")
            }
        }, {
            key: "setCurrentTime",
            value: function(a) {
                return this.set("currentTime", a)
            }
        }, {
            key: "getDuration",
            value: function() {
                return this.get("duration")
            }
        }, {
            key: "getEnded",
            value: function() {
                return this.get("ended")
            }
        }, {
            key: "getLoop",
            value: function() {
                return this.get("loop")
            }
        }, {
            key: "setLoop",
            value: function(a) {
                return this.set("loop", a)
            }
        }, {
            key: "getPaused",
            value: function() {
                return this.get("paused")
            }
        }, {
            key: "getTextTracks",
            value: function() {
                return this.get("textTracks")
            }
        }, {
            key: "getVideoEmbedCode",
            value: function() {
                return this.get("videoEmbedCode")
            }
        }, {
            key: "getVideoId",
            value: function() {
                return this.get("videoId")
            }
        }, {
            key: "getVideoTitle",
            value: function() {
                return this.get("videoTitle")
            }
        }, {
            key: "getVideoWidth",
            value: function() {
                return this.get("videoWidth")
            }
        }, {
            key: "getVideoHeight",
            value: function() {
                return this.get("videoHeight")
            }
        }, {
            key: "getVideoUrl",
            value: function() {
                return this.get("videoUrl")
            }
        }, {
            key: "getVolume",
            value: function() {
                return this.get("volume")
            }
        }, {
            key: "setVolume",
            value: function(a) {
                return this.set("volume", a)
            }
        }]),
        a
    }();
    return function() {
        var a = function(a) {
            "console"in window && console.error && console.error("There was an error creating an embed: " + a)
        };
        [].slice.call((0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : document).querySelectorAll("[data-vimeo-id], [data-vimeo-url]")).forEach(function(b) {
            try {
                if (null === b.getAttribute("data-vimeo-defer")) {
                    var c = l(b)
                      , d = B(c);
                    k(d, c).then(function(a) {
                        return r(a, b)
                    }).catch(a)
                }
            } catch (C) {
                a(C)
            }
        })
    }(),
    E
});
