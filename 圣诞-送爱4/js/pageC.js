/*第三副场景页面*/
function PageC(element, callback) {

    this.$window   = $(".page-c .window");
    this.$leftWin  = this.$window.find(".window-left");
    this.$rightWin = this.$window.find(".window-right");
    this.$sceneBg  = this.$window.find(".window-scene-bg");
    this.$closeBg  = this.$window.find(".window-close-bg");
    this.$deer = element;


    // 背景切换
    this.$sceneBg.transition({
        opacity: 0,
    }, 3000);
    this.$closeBg.css("transform", "translateZ(0)")
    this.$closeBg.transition({
        opacity: 1
    }, 5000);

    //关门动作

    this.closeWindow(callback);
}

/*关闭窗*/
PageC.prototype.closeWindow = function(callback) {
    var count=1;
    var complete=function(){
        ++count;
        if(count==2){
            //窗户关闭
            callback & callback();
        }
    }
    var bind=function(element){
        element.addClass("close").one("animationend webkitAnimationEnd",function(event){
            complete()
        })
    }
    bind(this.$leftWin)
    bind(this.$rightWin)
}

/*运行下一个动画*/
PageC.prototype.next = function(options) {
    var dfd = $.Deferred();
    this.$deer.transition(options.style, options.time, "linear",function() {
        dfd.resolve()
    });
    return dfd;
}

//路径
PageC.prototype.run = function (e) {
    var t = function () {
        return this.next.apply(this, arguments)
    }.bind(this);
    this.$deer.addClass("deer-animate"), t({
        time: 5e3,
        style: {bottom: "4rem", right: "-5rem", scale: "1"}
    }).then(function () {
        return t({time: 100, style: {rotateY: "-180", scale: "0.8"}})
    }).then(function () {
        return t({time: 1e4, style: {bottom: "8rem", right: "15rem", scale: "0.2"}})
    }).then(e)
};