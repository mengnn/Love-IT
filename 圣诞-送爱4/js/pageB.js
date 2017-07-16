function PageB(e, t) {
    function n() {
        var e = $.Deferred();
        return function () {
            r(e)
        }.defer(500),e
    }

    function r(e) {
        var t = o(), n = 1, r = t.numpics
        var s = function () {
            i(n, t, function () {
                    ++n, a()
            })
        }
        var a = function () {
            return n > r ? (t.destroy(), void function () {
                e.resolve()
            }.defer(1e3)) : void function () {
                s()
            }.defer(1e3)
        };
        s()
    }

    //视频播放
    function i(e, t, n) {
        t.run(e), d.choose(function () {
            t.selected(function () {
                t.palyVideo({
                    load: function () {
                        d.reset(), t.reset(), p.strip(e)
                    }, complete: function () {
                            n()
                    }
                })
            })
        })
    }

    //旋转木马
    function o() {
        var e = new Carousel(u, {
            imgUrls: ["images/carousel/1.png","images/carousel/2.png","images/carousel/3.png"],
            videoUrls: ["images/carousel/1.mp4", "images/carousel/2.mp4", "images/carousel/3.mp4"]
        });
        return e
    }


    var s = e;
    var a = s.find(".christmas-boy");//男孩
    var u = s.find("#carousel");//旋转木马
    var c = s.find(".girl");//女孩
    var l = s.find(".cat");//猫
    //男孩女孩的动作时间
    var f = {
        boy: {walk: 4e3},
        girl: {standUp: 200, throwBook: 300, walk: 3e3, hugWalk: 1e3}
    };
    //女孩动画
    var d = {
        standUp: function () {
            var e = $.Deferred();
            return function () {
                c.addClass("girl-standUp");
            }.defer(f.girl.standUp), function () {
                l.addClass("cat-book"), c.addClass("girl-throwBook"), e.resolve()
            }.defer(f.girl.throwBook + f.girl.standUp), e
        }, walk: function (e) {
            var t = $.Deferred();
            return c.addClass("girl-walk"), c.transition({left: "4.5rem"}, f.girl.walk, "linear", function () {
                t.resolve()
            }), t
        }, stopWalk: function () {
            c.addClass("walk-stop").removeClass("girl-standUp").removeClass("girl-walk").removeClass("girl-throwBook").addClass("girl-stand")
        }, choose: function (e) {
            c.addClass("girl-choose").removeClass("walk-stop"), c.one("animationend webkitAnimationEnd", function () {
                e()
            })
        }, reset: function () {
            c.removeClass("girl-choose")
        }, hugWalk: function (e) {
            c.addClass("girl-weep"), c.transition({left: "7rem"}, f.girl.hugWalk, "linear", function () {
                c.addClass("walk-stop").removeClass("girl-weep"), e()
            })
        }, hug: function () {
            c.addClass("girl-hug").addClass("walk-run")
        }
    };
    //男孩的动画
    var p = {
        walk: function () {
            var e = $.Deferred();
            return a.transition({right: "4.5rem"}, f.boy.walk, "linear", function () {
                e.resolve()
            }), e
        }, stopWalk: function () {
            a.removeClass("boy-walk"), a.addClass("boy-stand")
        }, unwrapp: function () {
            var e = $.Deferred();
            return a.addClass("boy-unwrapp"), a.removeClass("boy-stand"), a.one("animationend webkitAnimationEnd", function () {
                e.resolve()
            }), e
        }, runWalk: function () {
            a.addClass("walk-run")
        }, hug: function () {
            a.addClass("boy-hug").one("animationend webkitAnimationEnd", function () {
                $(".christmas-boy-head").show()
            })
        }, strip: function (e) {
            a.addClass("boy-strip-" + e).removeClass("boy-unwrapp")
        }
    };
    //执行
    p.walk().then(function () {
        p.stopWalk()
    }).then(function () {
        return d.standUp()
    }).then(function () {
        return d.walk()
    }).then(function () {
        return d.stopWalk()
    }).then(function () {
        return p.unwrapp()
    }).then(function () {
        return n() //旋转木马
    }).then(function () {
        d.hugWalk(function () {
            d.hug(), p.hug(), function () {
                t && t()
            }.defer(1e3)
        })
    })
}

Function.prototype.defer = function (e, t, n, r) {
    var i = this.createDelegate(t, n, r);
    return e > 0 ? setTimeout(i, e) : (i(), 0)
}

Function.prototype.createDelegate = function (e, t, n) {
    var r = this;
    return function () {
        var i = t || arguments;
        if (n === !0)i = Array.prototype.slice.call(arguments, 0), i = i.concat(t); else if (isNumber(n)) {
            i = Array.prototype.slice.call(arguments, 0);
            var o = [n, 0].concat(t);
            Array.prototype.splice.apply(i, o)
        }
        return r.apply(e || window, i)
    }
}
function isNumber(e) {
    return "number" == typeof e && isFinite(e)
}

