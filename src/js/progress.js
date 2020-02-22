// 进度条模块
(function ($, root) {
    let dur
    let frameId
    let lastPer = 0
    let startTime
    function renderAllTime (time) { // 293s
        dur = time
        time = formatTime(time)
        $('.all-time').html(time)
    }
    
    // 格式化时间
    function formatTime (time) {
        // 293s == 04:53
        time = Math.round(time)
        let minute = Math.floor(time / 60)
        let seconds = time - minute * 60
        minute = minute < 10 ? '0' + minute : minute
        seconds = seconds < 10 ? '0' + seconds : seconds
        return `${minute}:${seconds}`
    }

    // 开始计时
    function start (p) {
        lastPer = p == undefined ? lastPer : p
        startTime = new Date().getTime()
        function frame () {
            let curTime = new Date().getTime() 
            // 每隔16.7毫秒调用一次 将每次暂停的时间累加进来
            let per = lastPer + (curTime - startTime) / (dur * 1000) //s 转换为 ms
            if (per <= 1) {
                update(per)
            } else {
                cancelAnimationFrame(frameId)
            }
            frameId = requestAnimationFrame(frame)
        }
        frame()
    }

    // 停止计时
    function stop (p) {
        cancelAnimationFrame(frameId)
        let stopTime = new Date().getTime()
        // 每停止一次就累加一次
        lastPer += (stopTime - startTime) / (dur * 1000)
    }

    // 更新进度条样式
    function update (per) {
        let time = per * dur
        time = formatTime(time)
        $('.cur-time').html(time)
        let perX = (per - 1) * 100 + '%'
        $('.pro-top').css({transform: 'translateX('+ perX +')'})
    }
    root.pro = {
        renderAllTime : renderAllTime,
        start : start,
        stop : stop,
        update : update,
    }
} (window.Zepto, window.player || (window.player = {})))