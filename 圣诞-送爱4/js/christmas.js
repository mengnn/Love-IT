var Christmas = function() {

    var i = Hmlt5Audio("music/scene.mp3");
    i.end(function () {
        Hmlt5Audio("music/circulation.mp3", !0)
    });

    //页面容器元素
    var $pageA = $(".page-a");
    var $pageB = $(".page-b");
    var $pageC = $(".page-c");

    //鹿脱雪橇
    var $deer = $(".deer");
    //构建第一个场景页面对象
    var a = new pageA($pageA);
    //观察者
    var o = new Observer();

    a.run(function(){
        o.publish("completeA");
    });

    //A场景完成---A场景消失  A-B
    o.subscribe("completeA", function () {
        $pageA.addClass("effect-out").one("animationend webkitAnimationEnd", function () {
            o.publish("pageB");
        })
    });

    //B-C
    o.subscribe("completeB", function() {
       $pageB.addClass("effect-out").one("animationend webkitAnimationEnd", function (){
           o.publish("pageC")
       })
    });
    //B场景出现动画
    o.subscribe("pageB", function () {
        new PageB($pageB, function () {
            o.publish("completeB");
        });
    });
    //B场景完成，C场景出现动画
    o.subscribe("completeB", function () {
        changePage($pageC, "effect-in", function () {
            o.publish("pageC")
        });
    });
    //C场景出现
    o.subscribe("pageC", function () {
        var c = new PageC($deer, function(){
            //下雪
            Snowflake(snowflake);
        })
        //鹿拉雪橇运动
        c.run();
    });
};

function Hmlt5Audio(e, t) {
    var n = new Audio(e);
    return n.autoplay = !0, n.loop = t || !1, n.play(), {
        end: function (e) {
            n.addEventListener("ended", function () {
                e()
            }, !1)
        }
    }
}

$(function() {
    Christmas();
})

