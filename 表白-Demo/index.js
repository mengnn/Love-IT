// 小男孩开始走路
//  播放音乐
// page1 => 1/2 时   
    //  小男孩不移动，保持行走动作
    //  page1滚动到page2
// 到达page2
    //  走进商店
    //  走出商店
// page2 滚动到 page3 
//  上桥
//  桥上直行
//  转身
//  切换音乐
//  显示logo
//  飘花

~(function($){
    var CONF,       //基本配置
        tools,      //工具类
        pageAction, //页面元素处理
        girlAction, //女孩动作处理
        boyAction,  //男孩动作处理
        p_qixi;     //主页面

    var $pageWrap = $('#backdropWrap'),
        pageW = $pageWrap.width()/3,
        pageH = $pageWrap.height(),
        $boy = $('#boy'),
        $girl=$('#girl'),
        $road = $('.a_background_middle'),
        $bridge = $('.c_background_middle'),
        pathY = $road.height()/2+$road.position().top,
        bridgeY = $bridge.position().top;


    CONF={
        audio: {
            autoPlay: true,
            playURl: "music/happy.wav",
            cycleURL: "music/circulation.wav"
        },
        times: {
            walkToThird: 6000,
            walkToMiddle: 6500,
            walkToEnd: 6500,
            walkTobridge: 2000,
            bridgeWalk: 2000,
            walkToShop: 1500,
            walkOutShop: 1500,
            openDoorTime: 800,
            shutDoorTime: 500,
            waitRotate: 850,
            waitFlower: 800
        },
        snowflakeURl: ["images/snowflake/snowflake1.png", "images/snowflake/snowflake2.png", "images/snowflake/snowflake3.png", "images/snowflake/snowflake4.png", "images/snowflake/snowflake5.png", "images/snowflake/snowflake6.png"]
    };

    tools = {
        getDist: function(direction, proportion){ //计算男孩行走的距离 参数：方向 百分比 
            return (direction == "x" ? pageW : pageH) * proportion;
        },
        audioPlay:function(url, isLoop){ // 播放音乐 
            var audio = new Audio(url);
            audio.autoplay = true;
            audio.loop = !!isLoop;
            audio.play();
            return {
                endCallback: function(callback){
                    audio.addEventListener('ended', function(){
                        callback && callback();
                    })
                }
            };
        },
        operDoor:function(left, right, time){ //操作门
            var dtd = $.Deferred(), count = 2;
            var complete = function() {
                if (count == 1) {
                    dtd.resolve();
                    return
                }
                count--
            };
            $(".door-left").transition({
                "left": left
            }, time, complete);

           $(".door-right").transition({
                "left": right
            }, time, complete);
            return dtd
        }
    };

    pageAction={
        scrollTo:function(time, num){ //页面滚动 参数：时间 到达的页面
            $pageWrap.css({
                'transition-timing-function': 'linear',
                'transition-duration': time+'ms',
                'transform': 'translate3d(-' + pageW*(num-1)  + 'px,0px,0px)'
            });
        },
        lightOn:function(){ //开灯
            $('.b_background').addClass('lamp-bright');
        }, 
        lightDown:function(){ //关灯
            $('.b_background').removeClass('lamp-bright');
        }, 
        openDoor:function(){ //开门
            return tools.operDoor("-50%", "100%", CONF.times.openDoorTime);
        },
        closeDoor:function(){ //关门
            return tools.operDoor("0%", "50%", CONF.times.shutDoorTime);
        },
        sunMove:function(){ //太阳和云动
            $('.cloud1').addClass('cloud1Anim');
            $('.cloud2').addClass('cloud2Anim');
            $('#sun').addClass('rotation');
        },
        birdFly:function(){ //鸟飞
            $("#bird").addClass("birdFly").transition({
                right: pageW
            }, 15000, "linear")
        },
        snowing:function(){ //飘花
            var $flakeContainer = $("#snowflake");

            function getImagesName() {
                return CONF.snowflakeURl[[Math.floor(Math.random() * 6)]]
            }

            function createSnowBox() {
                var url = getImagesName();
                return $('<div class="snowbox" />').css({
                    "width": 41,
                    "height": 41,
                    "position": "absolute",
                    "backgroundSize": "cover",
                    "zIndex": 100000,
                    "top": "-41px",
                    "backgroundImage": "url(" + url + ")"
                }).addClass("snowRoll");
            }
            setInterval(function() {
                var startPositionLeft = Math.random() * pageW - 100,
                    startOpacity = 1;
                endPositionTop = pageH - 40, endPositionLeft = startPositionLeft - 100 + Math.random() * 500, duration = pageH * 10 + Math.random() * 5000;
                var randomStart = Math.random();
                randomStart = randomStart < 0.5 ? startOpacity : randomStart;
                var $flake = createSnowBox();
                $flake.css({
                    left: startPositionLeft,
                    opacity: randomStart
                });
                $flakeContainer.append($flake);
                $flake.transition({
                    top: endPositionTop,
                    left: endPositionLeft,
                    opacity: 0.7
                }, duration, "ease-out", function() {
                    $(this).remove()
                })
            }, 200)
        },
        showLogo:function(){ //logo
            $('#logo').addClass("logolightSpeedIn").on('webkitAnimationEnd', function() {
                $(this).addClass("logoshake").off();
            })
        }
    };

    girlAction={
        turnBack:function(){    //转身
            $girl.addClass("girl-rotate")
        },
        show:function(){
            $girl.css({
                left: pageW / 2,
                top: bridgeY - $girl.height()
            })
        }
    };

    boyAction={
        show:function(){
            $boy.css({
                top: pathY - $boy.height() + 25
            });
        },
        walkTo:function(time, proportionX, proportionY){//参数：走的时间，X轴的距离，Y轴的距离 
           
            time = time || 3000;
            var disX = tools.getDist('x', proportionX);
            var disY = tools.getDist('y', proportionY) || undefined;

            this.slowWalk();  

            return this.startWalk({'left': disX,'top': disY}, time);
        },
        startWalk:function(options, time){
            var dtd = $.Deferred();
            $boy.transition(
                options,
                time,
                'linear',
                function() {
                    dtd.resolve(); //动画完成
                });
            return dtd;
        },
        buyFlowers:function(){
            var self = this, dtd= $.Deferred();
            pageAction.lightOn();
            pageAction.openDoor().then(function(){
                self.restartWalk();
                return self._enterDoor.call(self);
            }).then(function(disX){
               return self._outDoor.call(self, disX);
            }).then(function(){
                dtd.resolve();
            });

            return dtd;
        },
        slowWalk:function(){    //慢走 
            $boy.addClass('slowWalk').removeClass('pauseWalk');
        },
        stopWalk:function(){   //暂停行走
            $boy.addClass('pauseWalk');
        },
        restartWalk:function(){ //恢复行走
            $boy.removeClass('pauseWalk');
        },
        _enterDoor:function(){   // 进门
            var defer = $.Deferred();
                doorObj = $(".door"),
                offsetDoor = doorObj.offset(),
                doorOffsetLeft = offsetDoor.left,
                offsetBoy = $boy.offset(),
                boyOffetLeft = offsetBoy.left
                instanceX = (doorOffsetLeft + doorObj.width() / 2) - (boyOffetLeft + $boy.width() / 2);
                window.instanceX = instanceX;

            var walkPlay = this.startWalk({
                transform: "translateX(" + instanceX + "px),scale(0.3,0.3)",
                opacity: 0.1
            }, CONF.times.walkToShop).done(function() {
                $boy.css({
                    opacity: 0
                });
                setTimeout(function(){
                    defer.resolve(instanceX);
                }, CONF.times.waitFlower);
            });
            return defer
        },
        _outDoor:function(disX){     //出门 
            var defer = $.Deferred();
            this.restartWalk();
            this.flowerWalk();
            var walkPlay = this.startWalk({
                transform: "translate(" + disX + "px,0px),scale(1,1)",
                opacity: 1
            }, CONF.times.walkOutShop).done(function() {
                    defer.resolve();
            });
            return defer;
        },
        flowerWalk:function(){  //带花走 
            $boy.addClass('slowFlowersWalk').removeClass('slowWalk');
        },
        turnBack:function(callback){    //转身 
            $boy.attr('class',"charector boy-rotate");
            $boy.on('webkitAnimationEnd', function() {
                callback();
                $(this).off();
            })
        }
    };

    p_qixi = {
        init:function(){
            // 定位 boy
            boyAction.show();
            // 出太阳
            pageAction.sunMove();
            // 放音乐
            CONF.audio.autoPlay && 
            tools.audioPlay(CONF.audio.playURl, false).endCallback(function(){
                tools.audioPlay(CONF.audio.cycleURL, true)
            });
            // 开始走
            boyAction.walkTo.call(boyAction,CONF.times.walkToThird, 0.6).then(function(){
                // 转场
               pageAction.scrollTo(CONF.times.walkToMiddle, 2);
               return boyAction.walkTo.call(boyAction, CONF.times.walkToMiddle, 0.5);
            }).then(function(){
                // 出鸟
                pageAction.birdFly();
                boyAction.stopWalk();
                // 进店买花
                return boyAction.buyFlowers.call(boyAction);
            }).then(function(){
                // 关门关灯
                pageAction.closeDoor().done(pageAction.lightDown);
                // 转场
                pageAction.scrollTo(CONF.times.walkToMiddle, 3);
                girlAction.show();
                return boyAction.walkTo.call(boyAction, CONF.times.walkToEnd, 0.15);
            }).then(function(){
                // 上桥
                return boyAction.walkTo.call(boyAction, CONF.times.walkTobridge, 0.25, (bridgeY - $girl.height()) / pageH);
            }).then(function(){
                // 计算移动距离
                var proportionX = ($girl.position().left - $boy.width() - window.instanceX + $girl.width() / 5) / pageW;
                // 走近点儿
                return boyAction.walkTo.call(boyAction, CONF.times.bridgeWalk, proportionX);
            }).then(function(){
                boyAction.stopWalk();
                setTimeout(function(){
                    // 转身
                    girlAction.turnBack();
                    boyAction.turnBack(function(){
                        // 出logo 和 飘花
                        pageAction.showLogo();
                        pageAction.snowing();
                    });
                }, CONF.times.waitRotate);
            });
        }
    };

    p_qixi.init();

})(jQuery);

