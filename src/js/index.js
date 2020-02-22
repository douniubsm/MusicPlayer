const root = window.player
const audio = root.audioManager
let dataList
let len
let indexControl
let timer
let timer1
let pro = root.pro
let per = 0
let offset = $('.pro-bottom').offset()
let left = offset.left
let width = offset.width

// 获取数据
function getData(url) {
    $.ajax({
        type: "get",
        url: url,
        success: function (data) {
            len = data.length
            indexControl = new root.indexControl(len)
            dataList = data
            root.render(data[0])
            audio.getAudio(data[0].audio)
            root.pro.renderAllTime(data[0].duration)
            bindEvent()
            bindTouch()
        },
        error: function () {
            console.log("error")
        }
    })
}

// 事件绑定
function bindEvent() {
    // 自定义事件
    $('body').on('play:change', function (e, index) {
        audio.getAudio(dataList[index].audio)
        root.render(dataList[index])
        if (audio.status == 'play') {
            audio.play()
            pro.start()
            rotated(0)
        } else {
            audio.pause()
            pro.stop()
        }
        $('.img-box').attr('data-deg', 0)
        $('.img-box').css({
            'transform': 'rotateZ(0deg)',
            'transition': 'none'
        })
        pro.renderAllTime(dataList[index].duration)
    })
    // 上一首
    $('.prev').on('click', function () {
        pro.start(0)
        let i = indexControl.prev()
        $('body').trigger('play:change', i)
    })
    // 下一首
    $('.next').on('click', function () {
        pro.start(0)
        let i = indexControl.next()
        $('body').trigger('play:change', i)
    })
    // 播放和暂停
    $('.play').on('click', function () {
        if (audio.status == 'pause') {
            audio.play()
            // console.log(audio.status) // play
            pro.start()
            let per = $('.pro-top').attr('data-per')
            // 设置自动切歌
            timer1 = setInterval(function () {
                let x = $('.pro-top').css('transform')
                let reg = /\((.+?)\)/g
                let arr = x.match(reg)
                let str = arr[0]
                let str1 = str.slice(1, -1)
                let per1 = str1.slice(0, length - 1)
                let newPer = per1 / per
                if (newPer <= 0.01) {
                    setTimeout(function () {
                        $('.next').click()
                    }, 1000)
                }
            }, 10000)
            let deg = $('.img-box').attr('data-deg')
            rotated(deg)
            $('.icon-bofangsanjiaoxing').css({
                display: "none"
            })
            $('.icon-zanting').css({
                display: "block"
            })
        } else {
            audio.pause()
            pro.stop()
            clearInterval(timer)
            $('.icon-zanting').css({
                display: "none"
            })
            $('.icon-bofangsanjiaoxing').css({
                display: "block"
            })
        }
    })
    // 我的喜欢
    let index = indexControl.index
    let isLike = dataList[index].isLike
    if (!dataList[index].isLike) {
        $('.like').on('click', function () {
            $('.icon-xihuan').css({display: 'none'})
            $('.icon-xihuan1').css({display: 'block'})
            dataList[index].isLike = true
            console.log(dataList[index].isLike)
        })
    } 
    if (dataList[index].isLike) {
        $('.like').on('click', function () {
            $('.icon-xihuan1').css({display: 'none'})
            $('.icon-xihuan').css({display: 'block'})
            dataList[index].isLike = false
            console.log(dataList[index].isLike)
        })
    }
}

// 元素旋转
function rotated(deg) {
    clearInterval(timer)
    // 类型转换为数字
    deg = +deg
    timer = setInterval(function () {
        deg += 2
        $('.img-box').attr('data-deg', deg)
        $('.img-box').css({
            'transform': 'rotateZ(' + deg + 'deg)',
            'transition': 'all 1s linear'
        })
    }, 200)
}

// 拖拽事件
function bindTouch() {
    let $spot = $('.slider')
    $spot.on('touchstart', function (e) {
        pro.stop()
    }).on('touchmove', function (e) {
        // console.log(e.changedTouches[0])
        let x = e.changedTouches[0].clientX
        per = (x - left) / width
        if (per >= 0 && per <= 1) {
            pro.update(per)
        }
    }).on('touchend', function (e) {
        // console.log(indexControl.index)
        let curTime = per * dataList[indexControl.index].duration
        if (per >= 0 && per <= 1) {
            audio.playTo(curTime)
            audio.play()
            audio.status = 'play'
            $('.icon-bofangsanjiaoxing').css({
                display: "none"
            })
            $('.icon-zanting').css({
                display: "block"
            })
            pro.start(per)
        }
    })
}

getData('../mock/data.json')