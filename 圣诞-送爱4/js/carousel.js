//格式化字符串
var slice = Array.prototype.slice

function toArray(a, i, j) {
    return slice.call(a, i || 0, j || a.length);
}

function isDefined(v) {
    return typeof v !== 'undefined';
}


function applyIf(o, c) {
    if (o) {
        for (var p in c) {
            if (!isDefined(o[p])) {
                o[p] = c[p];
            }
        }
    }
    return o;
}
/*格式化字符串*/
applyIf(String, {
    format: function (format) {
        var args = toArray(arguments, 1);
        return format.replace(/\{(\d+)\}/g, function (m, i) {
            return args[i];
        });
    }
});
/*3d旋转木马*/
function Carousel(e, t) {
    function n(e) {
        var t = '<figure style="width:{0};transform:rotateY({1}deg) translateZ({2});position:absolute;"><img src="{3}" style="width:100%;height:100%;"></figure>';
        return String.format(t, "2rem", d, "1.2rem", e)
    }

    function r() {
        a.css({
            transform: "scale(0.3)",
            "-webkit-perspective": "500px",
            position: "absolute",
            left: "6.8rem",
            top: "4.5rem"
        }), u.css({width: "2rem", "transform-style": "preserve-3d", transition: "1s"})
    }

    function i() {
        var e = "";
        $.each(s, function (t, r) {
            e += n(r), d += f
        }), o = $(e), u.append(o)
    }

    var o;
    var s = t.imgUrls;
    var a = e;
    var u = e.find("#spinner");
    var c = 0;
    var l = s.length;
    var f = 360 / l, d = 0;
    this.numpics = l;

    r();
    i();
    var p;

    var config = {fullscreen: !0, layer: {width: "800", top: 0, left: 0}};

    this.run = function (e, t) {
        p = e, c = (e - 1) * f + 360, u.css("transform", "rotateY(-" + c + "deg)").one("transitionEnd webkitTransitionEnd", function () {
            t && t()
        })
    }, this.selected = function (e) {
        var t = o.find("img"), n = t.length;
        t.transition({scale: 1.5}, 2e3, "linear", function () {
            return 1 === n ? void e() : void n--
        })
    }, this.destroy = function () {
        u.remove()
    }, this.reset = function () {
        var e = o.find("img");
        e.css("scale", 1), u.css("transform", "rotateY(0deg)")
    }, this.palyVideo = function (e) {
        var n = p - 1;
        var r = r || o.eq(n);
        var video = $('<video preload="auto" autoplay class="bounceIn" style="width:50%;height:50%;position:absolute;left:30%;top:35%;"></video>');
        video.css({
            position: "absolute",
            "z-index": "999"})
        video.attr("src", t.videoUrls[n])
        video.on("loadeddata", function () {
            video[0].play(), setTimeout(function () {
                e.load()
            }, 1e3)//1*(10的三次方)
        });
        video.on("ended", function () {
            video.addClass("bounceOut").one("animationend webkitAnimationEnd", function () {
                video.remove(), e.complete()
            })
        });
        a.after(video)
    }
}